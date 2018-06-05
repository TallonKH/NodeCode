class NBoard {
	constructor(env, name) {
		console.log("Created board " + name);
		this.env = env;
		env.boardCount += 1;
		this.name = name;
		this.id = "maintab-" + env.boardCount;
		this.zoomCounter = 0;
		this.displayOffset = new NPoint(0, 0);
		this.zoom = 1;

		this.paneDiv = null;
		this.boardDiv = null;
		this.canvasDiv = null;
		this.containerDiv = null;

		this.nodes = {};
		this.nodesPendingCreate = {};
		this.nodesPendingDelete = {};
		this.selectedNodes = {};

		this.actionStack = [];
		this.actionStackIndex = -1;

		this.dragging = false;
		this.selectionBox = null;
		this.sboxMin = new NPoint(0, 0);
		this.sboxMax = new NPoint(0, 0);

		// mouse stuff
		this.leftMDown = false;
		this.rightMDown = false;
		this.lastMouseButton = -1;
		this.clickStartTarget = null;
		this.clickEndTarget = null;
		this.clickStart = new NPoint(0, 0);
		this.clickEnd = new NPoint(0, 0);
		this.clickDelta = new NPoint(0, 0);
		this.clickDistance = 0;
		this.lastMousePosition = new NPoint(0, 0);
		this.currentMouse = new NPoint(0, 0);
		this.frameMouseDelta = new NPoint(0, 0);
	}

	evntToPt(event) {
		const p = new NPoint(event.clientX, event.clientY).subtract2(25, 60).subtractp(this.displayOffset).divide1(this.zoom);
		return p;
	}

	evntToPtBrd(event) {
		const p = new NPoint(event.clientX, event.clientY).subtract2(25, 60);
		return p;
	}

	makeSelectionBox(point) {
		if (this.selectionBox == null) {
			this.sBoxContainer = document.createElement("div");
			this.sBoxContainer.className = "container";
			this.selectionBox = document.createElement("div");
			this.selectionBox.className = "selectbox";
			if (this.env.altDown) {
				this.selectionBox.setAttribute('anti', true);
			}
			this.sBoxContainer.append(this.selectionBox);
			this.containerDiv.append(this.sBoxContainer);
		}
	}

	destroySelectionBox() {
		if (this.selectionBox != null) {
			this.selectionBox = null;
			this.sBoxContainer.remove();
			this.sBoxContainer = null;
		}
	}

	addListeners() {
		const brd = this;
		this.boardDiv.onmousedown = function(event) {
			brd.lastMouseButton = event.which;
			brd.clickStart = brd.evntToPt(event);
			brd.clickStartTarget = event.target;
			brd.clickDistance = 0;
			// Left mouse button

			switch (event.which) {
				case 1:
					{
						brd.leftMDown = true;
						break;
					}
				case 2:
					{
						break;
					}
				case 3:
					{
						brd.rightMDown = true;
					}
			}

			return true;
		};

		this.boardDiv.onmouseup = function(event) {
			const button = event.which;
			// Left mouse button
			brd.clickEnd = brd.evntToPt(event);
			brd.clickDelta = brd.clickEnd.subtractp(brd.clickStart);
			brd.clickEndTarget = event.target;
			switch (button) {
				case 1: // LEFT MOUSE
					{
						brd.leftMDown = false;
						// Click (no drag) logic
						if (brd.clickDistance <= 30) {
							// clicked board
							if (brd.clickStartTarget == brd.boardDiv) {
								if (Object.keys(brd.selectedNodes).length > 0) {
									brd.addAction(new ActDeselectAll(brd));
									brd.deselectAllNodes();
								}
							} else /* Non-board click logic */ {
								const upTargetClasses = brd.clickStartTarget.classList;

								// click selection logic
								if (upTargetClasses.contains("nodepart")) {
									const divNode = brd.getDivNode(brd.clickEndTarget);
									if (brd.env.shiftDown) {
										brd.addAction(new ActSelect(brd, [divNode]));
										brd.selectNode(divNode);
									} else if (brd.env.altDown) {
										brd.addAction(new ActToggleSelect(brd, [divNode]));
										brd.toggleSelectNode(divNode); // TODO - get actual node from clickEndTarget
									} else {
										brd.addAction(new NMacro(new ActDeselectAll(brd), new ActSelect(brd, [divNode])));
										brd.deselectAllNodes();
										brd.selectNode(divNode);
									}
								}
							}
						} else /* mouse moved */ {
							// selection box confirmed
							if (brd.clickStartTarget == brd.boardDiv) {
								if (brd.env.altDown) {
									// deselect in box
									const deselectedNodes = [];
									for (const nodeid in brd.selectedNodes) {
										const node = brd.nodes[nodeid];
										if (node.within(brd.sboxMin, brd.sboxMax)) {
											deselectedNodes.push(node);
											brd.deselectNode(node);
										}
									}
									if (deselectedNodes.length > 0) {
										brd.addAction(new ActDeselect(brd, deselectedNodes));
									}
								} else {
									const selectedNodes = [];
									for (const nodeid in brd.nodes) {
										const node = brd.nodes[nodeid];
										if (node.within(brd.sboxMin, brd.sboxMax)) {
											selectedNodes.push(node);
										}
									}

									if (selectedNodes.length > 0) {
										if (brd.env.shiftDown) {
											brd.addAction(new ActSelect(brd, selectedNodes));
										} else {
											brd.addAction(new NMacro(new ActDeselectAll(brd), new ActSelect(brd, selectedNodes)));
										}
									} else {
										if (!brd.env.shiftDown) {
											brd.addAction(new ActDeselectAll(brd));
										}
									}

									// deselect all if shift isn't down
									if (!brd.env.shiftDown) {
										brd.deselectAllNodes();
									}

									for (const node of selectedNodes) {
										brd.selectNode(node);
									}
								}
								brd.destroySelectionBox();
							} else /* node drag complete */
								if (brd.clickStartTarget.classList.contains("nodepart")) {
									const pressedNode = brd.getDivNode(brd.clickStartTarget);
									if (pressedNode.selected) {
										brd.addAction(new ActMoveSelectedNodes(brd, brd.clickDelta));
									} else {
										brd.addAction(new ActMoveNodes(brd, brd.clickDelta, [pressedNode]));
									}
								}
						}
						break;
					}
				case 2: // MIDDLE MOUSE
					{
						break;
					}
				case 3: // RIGHT MOUSE
					{
						brd.rightMDown = false;
					}
			}

			return false;
		};

		this.boardDiv.onmousemove = function(event) {
			brd.currentMouse = brd.evntToPt(event);
			brd.frameMouseDelta = brd.currentMouse.subtractp(brd.lastMousePosition);
			brd.clickDistance += brd.frameMouseDelta.lengthSquared();

			// click & drag on board
			if (brd.leftMDown) {
				if (brd.clickStartTarget == brd.boardDiv) {
					if (brd.clickDistance > 30) {
						brd.makeSelectionBox(brd.clickStart);
						brd.sboxMin = NPoint.prototype.min(brd.clickStart, brd.currentMouse);
						brd.sboxMax = NPoint.prototype.max(brd.clickStart, brd.currentMouse);

						const sboxMin = brd.sboxMin;
						const sboxSize = brd.sboxMax.subtractp(brd.sboxMin);
						brd.selectionBox.style.left = sboxMin.x + "px";
						brd.selectionBox.style.top = sboxMin.y + "px";
						brd.selectionBox.style.width = sboxSize.x + "px";
						brd.selectionBox.style.height = sboxSize.y + "px";
					}

				} else /* click & drag elsewhere */ {
					const upTargetClasses = brd.clickStartTarget.classList;

					// drag on node
					if (upTargetClasses.contains("nodepart")) {
						const pressedNode = brd.getDivNode(brd.clickStartTarget);

						// drag on selected nodes
						if (pressedNode.selected) {
							for (const sNodeID in brd.selectedNodes) {
								const selectedNode = brd.selectedNodes[sNodeID];
								selectedNode.move(brd.frameMouseDelta);
							}
						} else /* drag on unselected node */ {
							pressedNode.move(brd.frameMouseDelta);
						}
					}
				}
			}

			brd.lastMousePosition = brd.currentMouse;
			return true;
		}

		this.boardDiv.onmousewheel = function(event) {
			if (event.ctrlKey) {
				const prevZoom = brd.zoom;
				brd.zoomCounter += event.deltaY;
				brd.zoomCounter = Math.min(171, Math.max(-219, brd.zoomCounter));
				brd.zoom = Math.pow(1.0075, -brd.zoomCounter);
				brd.displayOffset = brd.displayOffset.subtractp(brd.evntToPtBrd(event).subtractp(brd.displayOffset).divide1(prevZoom).multiply1(brd.zoom - prevZoom))
			} else {
				brd.displayOffset = brd.displayOffset.subtract2(event.deltaX, event.deltaY);
			}
			brd.updateTransform();
			return false;
		}
	}

	keyPressed(event) {
		switch (event.key) {
			case 'Alt':
				if (this.selectionBox) {
					this.selectionBox.setAttribute('anti', true);
				}
				break;
		}
		switch (event.which) {
			case 90:
				if (this.env.ctrlDown) {
					if (this.env.shiftDown) {
						this.redo();
					} else {
						this.undo();
					}
				}
				break;
			case 65:
				if (main.ctrlDown) {
					this.addAction(new ActSelectAll(this));
					main.activeBoard.selectAllNodes();
				}
				break;
			case 187:
				if (main.ctrlDown) {
					const prevZoom = this.zoom;
					if (this.zoom < 5) {
						this.zoom *= 1.2;
					}
					this.updateTransform();
				}
				break;
			case 189:
				if (main.ctrlDown) {
					const prevZoom = this.zoom;
					if (this.zoom > 0.28) {
						this.zoom *= 0.8333333;
					}
					this.updateTransform();
				}
				break;
		}
	}

	updateTransform() {
		this.containerDiv.style.transform = "translate(" + this.displayOffset.x + "px, " + this.displayOffset.y + "px) scale(" + this.zoom + ")";
		this.redraw();
	}

	undo() {
		if (this.actionStackIndex == -1) {
			return;
		}
		this.actionStack[this.actionStackIndex].undo();
		this.actionStackIndex--;
	}

	redo() {
		if (this.actionStackIndex == this.actionStack.length - 1) {
			return;
		}
		this.actionStackIndex++;
		this.actionStack[this.actionStackIndex].redo();
	}

	keyReleased(event) {
		switch (event.key) {
			case 'Alt':
				if (this.selectionBox) {
					this.selectionBox.removeAttribute('anti');
				}
				break;
		}
	}

	scrolled(event) {
		this.displayOffset = this.displayOffset.add2(event.deltaX, event.deltaY);
	}

	addAction(action) {
		this.actionStackIndex++;
		this.actionStack = this.actionStack.slice(0, this.actionStackIndex);
		this.actionStack.push(action);
	}

	// returns a nodepart div's node
	getDivNode(div) {
		return this.nodes[div.getAttribute("data-nodeid")];
	}

	selectNode(node) {
		if (!node.selected) {
			node.nodeDiv.setAttribute("selected", "");
			node.selected = true;
			this.selectedNodes[node.nodeid] = node;
		}
	}

	deselectNode(node) {
		if (node.selected) {
			node.nodeDiv.removeAttribute("selected");
			node.selected = false;
			delete this.selectedNodes[node.nodeid];
		}
	}

	selectAllNodes() {
		for (const nodeid in this.nodes) {
			this.selectNode(this.nodes[nodeid]);
		}
	}

	deselectAllNodes() {
		for (const nodeid in this.selectedNodes) {
			const node = this.selectedNodes[nodeid];
			node.nodeDiv.removeAttribute("selected");
			node.selected = false;
		}
		this.selectedNodes = {};
	}

	toggleSelectNode(node) {
		if (node.selected) {
			this.deselectNode(node);
		} else {
			this.selectNode(node);
		}
	}

	fixSize() {
		const h = window.innerHeight - 90;
		const w = window.innerWidth - 52;
		console.log(w, h);

		//TODO M4K3 TH1S DO SOM3TH1NG
		this.paneDiv.width = w;
		this.paneDiv.height = h;
	}

	createTabDiv() {
		if (this.tabDiv != null) {
			return null;
		}

		this.tabDiv = document.createElement("li");
		this.tabDiv.className = "tab";

		const link = document.createElement("a");
		link.innerHTML = this.name;
		link.setAttribute("href", "#" + this.id);

		this.tabDiv.append(link);
		return this.tabDiv;
	}

	createPaneDiv() {
		if (this.paneDiv != null) {
			return null;
		}

		this.paneDiv = document.createElement("div");
		this.paneDiv.className = "tabpane";
		this.paneDiv.id = this.id;
		let brd = this;

		this.boardDiv = document.createElement("div");
		this.boardDiv.className = "board";
		this.paneDiv.append(this.boardDiv);

		this.containerDiv = document.createElement("div");
		this.containerDiv.className = "container";
		this.boardDiv.append(this.containerDiv);

		this.canvasDiv = document.createElement("canvas");
		this.boardDiv.append(this.canvasDiv);

		this.addListeners();

		return this.paneDiv;
	}

	redraw() {
		this.canvasDiv.width = this.canvasDiv.clientWidth;
		this.canvasDiv.height = this.canvasDiv.clientHeight;
		window.requestAnimationFrame(this.draw.bind(this));
	}

	draw() {
		const ctx = this.canvasDiv.getContext("2d");
		const cvOffset = divPos(this.canvasDiv);

		for (const node1id in this.nodes) {
			for (const node2id in this.nodes) {
				if (node1id == node2id) {
					continue;
				}
				const node1 = this.nodes[node1id];
				const node2 = this.nodes[node2id];

				for (const inpinid in node1.inpins) {
					for (const outpinid in node2.outpins) {
						const inpin = node1.inpins[inpinid];
						const outpin = node2.outpins[outpinid];

						const inl = divCenter(inpin.pinDiv).subtractp(cvOffset);
						const outl = divCenter(outpin.pinDiv).subtractp(cvOffset);

						ctx.lineWidth = 4 * this.zoom;

						const grad = ctx.createLinearGradient(inl.x, inl.y, outl.x, outl.y);
						grad.addColorStop("0", inpin.color);
						grad.addColorStop("1.0", outpin.color);
						ctx.strokeStyle = grad;

						ctx.beginPath();
						ctx.moveTo(inl.x, inl.y);
						const yDiff = Math.abs(inl.y - outl.y)/2 + Math.abs((inl.x-outl.x))/4;
						let splineDist = yDiff;
						ctx.bezierCurveTo(inl.x - splineDist, inl.y, outl.x + splineDist, outl.y, outl.x, outl.y);
						ctx.stroke();
					}
				}
			}
		}
	}

	addNode(type) {
		const node = new type(this);
		const d = node.createNodeDiv();
		this.containerDiv.append(d);
		this.nodes[node.nodeid] = node;
		return node;
	}
}