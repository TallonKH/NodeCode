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

		this.nodes = {}; // nodeid : node
		this.selectedNodes = {};
		this.pins = {}; // pinid : pin

		this.links = {}; // (pin1, (pin2|null))

		this.actionStack = [];
		this.actionStackIndex = -1;

		this.draggedNodes = null;
		this.draggedPin = null;
		this.selectionBox = null;
		this.sboxMin = new NPoint(0, 0);
		this.sboxMax = new NPoint(0, 0);
		this.dragPanID = null;

		this.boundRect = null;
		this.rectDims = new NPoint(0, 0);
		this.cvOffset = new NPoint(0, 0);

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
		this.trueCurrentMouse = new NPoint(0, 0);
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

			// start ticking for screen edge panning
			brd.dragPanID = setInterval(brd.dragPanLogic.bind(brd), 50);

			switch (event.which) {
				// Left mouse button
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
			brd.redraw();
			return true;
		};

		this.boardDiv.onmouseup = function(event) {
			const button = event.which;
			// Left mouse button
			brd.clickEnd = brd.evntToPt(event);
			brd.clickDelta = brd.clickEnd.subtractp(brd.clickStart);
			brd.clickEndTarget = event.target;

			// stop ticking for screen edge panning
			clearInterval(brd.dragPanID);

			switch (button) {
				case 1: // LEFT MOUSE
					{
						brd.leftMDown = false;

						if(brd.selectionBox){ // finish selection box
							// next 40ish lines are selection logic...
							if (brd.env.altDown) { // deselect things in box
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
						}else if(brd.draggedNode){ // finish moving node(s)
							brd.draggedNode = brd.getDivNode(brd.clickStartTarget);
							if (brd.draggedNode.selected) {
								brd.addAction(new ActMoveSelectedNodes(brd, brd.clickDelta));
							} else {
								brd.addAction(new ActMoveNodes(brd, brd.clickDelta, [brd.draggedNode]));
							}
							brd.draggedNode = null;
						}else if(brd.draggedPin){ // finish dragging pin
							brd.boardDiv.removeAttribute("linking");
							brd.draggedPin.pinDiv.removeAttribute("linking");
							for(const nodeid in brd.nodes){
								const node = brd.nodes[nodeid];
								if(brd.draggedPin.side){
									for(const pinid in node.inpins){
										node.inpins[pinid].pinDiv.removeAttribute("match");
									}
								}else{
									for(const pinid in node.outpins){
										node.outpins[pinid].pinDiv.removeAttribute("match");
									}
								}
							}
							// successful link
							if (brd.clickEndTarget.classList.contains("pin")) {
								console.log("link attempt!");
								const lank = brd.draggedPin.linkTo(brd.getDivPin(brd.clickEndTarget));
							}
							delete brd.links[brd.draggedPin.pinid];
							brd.draggedPin = null;
						}else if(brd.clickDistance > brd.env.dragDistance){ // something unknown was dragged

						}else{ // nothing was dragged - click occured
							const upTargetClasses = brd.clickStartTarget.classList;

							if (brd.clickStartTarget == brd.boardDiv) { // board clicked
								if (Object.keys(brd.selectedNodes).length > 0) {
									brd.addAction(new ActDeselectAll(brd));
									brd.deselectAllNodes();
								}
							} else if (upTargetClasses.contains("nodepart")) { // a node was clicked
								const divNode = brd.getDivNode(brd.clickEndTarget);
								if (brd.env.shiftDown) {
									brd.addAction(new ActSelect(brd, [divNode]));
									brd.selectNode(divNode);
								} else if (brd.env.altDown) {
									brd.addAction(new ActToggleSelect(brd, [divNode]));
									brd.toggleSelectNode(divNode);
								} else {
									brd.addAction(new NMacro(new ActDeselectAll(brd), new ActSelect(brd, [divNode])));
									brd.deselectAllNodes();
									brd.selectNode(divNode);
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
			brd.redraw();
			return false;
		};

		this.boardDiv.onmousemove = function(event) {
			brd.lastMouseMoveEvent = event;
			brd.currentMouse = brd.evntToPt(event);
			brd.trueCurrentMouse = new NPoint(event.clientX, event.clientY);
			brd.frameMouseDelta = brd.currentMouse.subtractp(brd.lastMousePosition);
			brd.clickDistance += brd.frameMouseDelta.lengthSquared();

			if (brd.leftMDown) {
				// click & drag in progress?
				if (brd.selectionBox) { // currently dragging board (selection box)
					brd.sboxMin = NPoint.prototype.min(brd.clickStart, brd.currentMouse);
					brd.sboxMax = NPoint.prototype.max(brd.clickStart, brd.currentMouse);

					const sboxMin = brd.sboxMin;
					const sboxSize = brd.sboxMax.subtractp(brd.sboxMin);
					brd.selectionBox.style.left = sboxMin.x + "px";
					brd.selectionBox.style.top = sboxMin.y + "px";
					brd.selectionBox.style.width = sboxSize.x + "px";
					brd.selectionBox.style.height = sboxSize.y + "px";
				} else if (brd.draggedNode) { // currently dragging node(s)
					if (brd.draggedNode.selected) { // dragging selected nodes
						for (const sNodeID in brd.selectedNodes) {
							const selectedNode = brd.selectedNodes[sNodeID];
							selectedNode.move(brd.frameMouseDelta);
						}
					} else { // dragging unselected node
						brd.draggedNode.move(brd.frameMouseDelta);
					}
				} else if (brd.draggedPin) { // currently dragging pins
					// only redrawing is required for dragged pin
					brd.redraw();

				} else if (brd.clickDistance > brd.env.dragDistance) { // currently dragging nothing - check if drag has started
					const upTargetClasses = brd.clickStartTarget.classList;

					if (brd.clickStartTarget == brd.boardDiv) { // start selection box
						brd.makeSelectionBox(brd.clickStart);
					} else if (upTargetClasses.contains("nodepart")) { // start dragging node
						brd.draggedNode = brd.getDivNode(brd.clickStartTarget);
					} else if (upTargetClasses.contains("pin")) { // start dragging pin
						brd.draggedPin = brd.getDivPin(brd.clickStartTarget);
						brd.links[brd.draggedPin.pinid] = [brd.draggedPin, null];
						brd.draggedPin.pinDiv.setAttribute("linking", true);
						brd.boardDiv.setAttribute("linking", true);
						for(const nodeid in brd.nodes){
							const node = brd.nodes[nodeid];
							if(brd.draggedPin.side){
								console.log(brd.draggedPin.side);
								for(const pinid in node.inpins){
									const pin = node.inpins[pinid]
									if(brd.draggedPin.canPlugInto(pin)){
										pin.pinDiv.setAttribute("match", true);
									}
								}
							}else{
								for(const pinid in node.outpins){
									const pin = node.outpins[pinid]
									if(pin.canPlugInto(brd.draggedPin)){
										pin.pinDiv.setAttribute("match", true);
									}
								}
							}
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
			brd.redraw();
			return false;
		}
	}

	dragPanLogic() {
		const topEdgeDist = this.trueCurrentMouse.y - this.boundRect.top;
		const bottomEdgeDist = this.boundRect.bottom - this.trueCurrentMouse.y;
		const leftEdgeDist = this.trueCurrentMouse.x - this.boundRect.left;
		const rightEdgeDist = this.boundRect.right - this.trueCurrentMouse.x;
		let panned = false;

		if (topEdgeDist < this.env.maxPanDist) {
			this.displayOffset = this.displayOffset.add2(0, (this.env.maxPanDist - topEdgeDist) * this.env.panSpeed);
			panned = true;
		} else if (bottomEdgeDist < this.env.maxPanDist) {
			this.displayOffset = this.displayOffset.add2(0, (bottomEdgeDist - this.env.maxPanDist) * this.env.panSpeed);
			panned = true;
		}
		if (rightEdgeDist < this.env.maxPanDist) {
			this.displayOffset = this.displayOffset.add2((rightEdgeDist - this.env.maxPanDist) * this.env.panSpeed, 0);
			panned = true;
		} else if (leftEdgeDist < this.env.maxPanDist) {
			this.displayOffset = this.displayOffset.add2((this.env.maxPanDist - leftEdgeDist) * this.env.panSpeed, 0);
			panned = true;
		}

		// fake a mouse move event to ensure things keep happening even if the mouse isn't moving
		this.boardDiv.onmousemove(this.lastMouseMoveEvent);
		this.redraw();
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
					this.redraw();
				}
				break;
			case 189:
				if (main.ctrlDown) {
					const prevZoom = this.zoom;
					if (this.zoom > 0.28) {
						this.zoom *= 0.8333333;
					}
					this.redraw();
				}
				break;
		}
	}

	redraw() {
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

	// returns a pin/pinfo div's pin
	getDivPin(div) {
		return this.pins[div.getAttribute("data-pinid")];
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
		this.paneDiv.width = w;
		this.paneDiv.height = h;
		this.boundRect = this.boardDiv.getBoundingClientRect();
		this.rectDims = new NPoint(this.boundRect.width, this.boundRect.height);
		this.canvasDiv.width = this.rectDims.x;
		this.canvasDiv.height = this.rectDims.y;
		this.cvOffset = divPos(this.canvasDiv);
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

		this.redraw();

		return this.paneDiv;
	}

	redraw() {
		window.requestAnimationFrame(this.draw.bind(this));
	}

	draw() {
		const ctx = this.canvasDiv.getContext("2d");
		// clear canvas
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvasDiv.width, this.canvasDiv.height);
		ctx.restore();

		// update transform
		this.containerDiv.style.transform = "translate3d(" + this.displayOffset.x + "px, " + this.displayOffset.y + "px, 0px) scale(" + this.zoom + ")";

		for (const linkid in this.links) {
			const link = this.links[linkid];
			let pinA = link[0];
			let pinB = link[1];
			let l1;
			let l2;
			let c1;
			let c2;
			if (pinA == null) {
				if (pinB == null) {
					console.log("Attempted to draw link with 2 null pins");
				} else {
					if (pinB.side) {
						l1 = this.currentMouse.multiply1(this.zoom).addp(this.displayOffset);
						l2 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);
						c1 = NObject.color + "44";
						c2 = pinB.color;
					} else {
						l1 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);
						l2 = this.currentMouse.multiply1(this.zoom).addp(this.displayOffset);
						c1 = pinB.color;
						c2 = NObject.color + "44";
					}
				}
			} else {
				if (pinB == null) {
					if (pinA.side) {
						l2 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
						l1 = this.currentMouse.multiply1(this.zoom).addp(this.displayOffset);
						c1 = NObject.color + "44";
						c2 = pinA.color;
					} else {
						l1 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
						l2 = this.currentMouse.multiply1(this.zoom).addp(this.displayOffset);
						c1 = pinA.color;
						c2 = NObject.color + "44";
					}
				} else {
					if (pinA.side) {
						l1 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);
						l2 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
						c1 = pinB.color;
						c2 = pinA.color;
					} else {
						l1 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
						l2 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);
						c1 = pinA.color;
						c2 = pinB.color;
					}
				}
			}
			const grad = ctx.createLinearGradient(l1.x, l1.y, l2.x, l2.y);
			grad.addColorStop("0", c1);
			grad.addColorStop("1.0", c2);

			ctx.strokeStyle = grad;
			ctx.lineWidth = 8 * this.zoom;

			ctx.beginPath();
			ctx.moveTo(l1.x, l1.y);
			const splineDist = Math.abs(l1.y - l2.y) / 2 + Math.abs((l1.x - l2.x)) / 4;
			ctx.bezierCurveTo(l1.x - splineDist, l1.y, l2.x + splineDist, l2.y, l2.x, l2.y);
			ctx.stroke();
		}
	}

	addNode(type) {
		const node = new type();
		node.board = this;
		const d = node.createNodeDiv();
		this.containerDiv.append(d);
		this.nodes[node.nodeid] = node;
		return node;
	}
}