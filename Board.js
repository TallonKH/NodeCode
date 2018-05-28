class Board {
	constructor(env, name) {
		console.log("Created board " + name);
		this.env = env;
		env.boardCount += 1;
		this.name = name;
		this.id = "maintab-" + env.boardCount;
		this.zoomCounter = 0;
		this.zoomAmount = 0;
		this.displayOffset = new Point(0, 0);

		this.paneDiv = null;
		this.boardDiv = null;

		this.nodes = {};
		this.nodesPendingCreate = {};
		this.nodesPendingDelete = {};
		this.selectedNodes = {};


		this.dragging = false;
		this.selectionBox = null;
		this.sboxMin = new Point(0, 0);
		this.sboxMax = new Point(0, 0);

		// mouse stuff
		this.leftMDown = false;
		this.rightMDown = false;
		this.lastMouseButton = -1;
		this.clickStartTarget = null;
		this.clickEndTarget = null;
		this.clickStart = new Point(0, 0);
		this.clickEnd = new Point(0, 0);
		this.clickDelta = new Point(0, 0);
		this.clickDistance = 0;
		this.lastMousePosition = new Point(0, 0);
		this.currentMouse = new Point(0, 0);
		this.frameMouseDelta = new Point(0, 0);
	}

	evntToPt(event) {
		const p = new Point(event.clientX, event.clientY).subtract2(25, 60);
		return p;
	}

	makeSelectionBox(point) {
		if (this.selectionBox == null) {
			this.sBoxContainer = document.createElement("div");
			this.sBoxContainer.className = "container";
			this.selectionBox = document.createElement("div");
			this.selectionBox.className = "selectbox";
			this.sBoxContainer.append(this.selectionBox);
			this.boardDiv.append(this.sBoxContainer);
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
		const cv = this;
		this.boardDiv.onmousedown = function(event) {
			cv.lastMouseButton = event.which;
			cv.clickStart = cv.evntToPt(event);
			cv.clickStartTarget = event.target;
			cv.clickDistance = 0;
			// Left mouse button

			switch (event.which) {
				case 1:
					{
						cv.leftMDown = true;
						break;
					}
				case 2:
					{
						break;
					}
				case 3:
					{
						cv.rightMDown = true;
					}
			}

			return true;
		};

		this.boardDiv.onmouseup = function(event) {
			const button = event.which;
			// Left mouse button
			cv.clickEnd = cv.evntToPt(event);
			cv.clickDelta = cv.clickEnd.subtractp(cv.clickStart);
			cv.clickEndTarget = event.target;
			switch (button) {
				case 1: // LEFT MOUSE
					{
						cv.leftMDown = false;
						// Click (no drag) logic
						if (cv.clickDistance <= 30) {
							// clicked board
							if (cv.clickStartTarget == cv.boardDiv) {
								cv.deselectAllNodes();
							} else /* Non-board click logic */ {
								const upTargetClasses = cv.clickStartTarget.classList;

								// click selection logic
								if (upTargetClasses.contains("nodepart")) {
									if (cv.env.shiftDown) {
										cv.selectNode(cv.getDivNode(cv.clickEndTarget));
									} else if (cv.env.altDown) {
										cv.toggleSelectNode(cv.getDivNode(cv.clickEndTarget)); // TODO - get actual node from clickEndTarget
									} else {
										cv.deselectAllNodes();
										cv.selectNode(cv.getDivNode(cv.clickEndTarget));
									}
								}
							}
						} else /* mouse moved */ {
							// selection box confirmed
							if (cv.clickStartTarget == cv.boardDiv) {
								if (cv.env.altDown) {
									// deselect in box
									for (const nodeid in cv.selectedNodes) {
										const node = cv.nodes[nodeid];
										if (node.within(cv.sboxMin, cv.sboxMax)) {
											cv.deselectNode(node);
										}
									}
								} else {
									// deselect all
									if (!cv.env.shiftDown) {
										cv.deselectAllNodes();
									}

									for (const nodeid in cv.nodes) {
										const node = cv.nodes[nodeid];
										if (node.within(cv.sboxMin, cv.sboxMax)) {
											console.log(' W I T H I N');
											cv.selectNode(node);
										}
									}
								}
								cv.destroySelectionBox();
							} else /* node drag complete */ {

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
						cv.rightMDown = false;
					}
			}

			return false;
		};

		this.boardDiv.onmousemove = function(event) {
			cv.currentMouse = cv.evntToPt(event);
			cv.frameMouseDelta = cv.currentMouse.subtractp(cv.lastMousePosition);
			cv.clickDistance += cv.frameMouseDelta.lengthSquared();

			// click & drag on board
			if (cv.leftMDown) {
				if (cv.clickStartTarget == cv.boardDiv) {
					if (cv.clickDistance > 30) {
						cv.makeSelectionBox(cv.clickStart);
						cv.sboxMin = Point.prototype.min(cv.clickStart, cv.currentMouse);
						cv.sboxMax = Point.prototype.max(cv.clickStart, cv.currentMouse);

						const sboxMin = cv.sboxMin;
						const sboxSize = cv.sboxMax.subtractp(cv.sboxMin);
						cv.selectionBox.style.left = sboxMin.x + "px";
						cv.selectionBox.style.top = sboxMin.y + "px";
						cv.selectionBox.style.width = sboxSize.x + "px";
						cv.selectionBox.style.height = sboxSize.y + "px";
					}

				} else /* click & drag elsewhere */ {
					const upTargetClasses = cv.clickStartTarget.classList;

					// drag on node
					if (upTargetClasses.contains("nodepart")) {
						const pressedNode = cv.getDivNode(cv.clickStartTarget);

						// drag on selected nodes
						if (pressedNode.selected) {
							for (const sNodeID in cv.selectedNodes) {
								const selectedNode = cv.selectedNodes[sNodeID];
								selectedNode.move(cv.frameMouseDelta);
							}
						} else /* drag on unselected node */ {
							pressedNode.move(cv.frameMouseDelta);
						}
					}
				}
			}

			cv.lastMousePosition = cv.currentMouse;
			return true;
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
		console.log(event);
		this.displayOffset = this.displayOffset.add2(event.deltaX, event.deltaY);
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

	changeZoom(change, center) {
		const prevZoom = this.zoomAmount;
		this.zoomCounter -= change;
		this.zoomCounter = Math.max(Math.min(zoomCounter, 1000), -400);
		this.zoomAmount = 1 + this.zoomCounter / 500;
		diff = (this.zoomAmount - prevZoom);
		this.viewportPos = this.viewportPos.addp(center.addp(this.viewportPos).divide1(prevZoom).multiply1(diff))
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
		let cv = this;

		this.boardDiv = document.createElement("div");
		this.boardDiv.className = "board";
		this.paneDiv.append(this.boardDiv);

		this.addListeners();

		return this.paneDiv;
	}

	addNode(type) {
		const node = new type(this);
		const d = node.createNodeDiv();
		this.boardDiv.append(d);
		this.nodes[node.nodeid] = node;
		node.updatePosition();
		return node;
	}
}