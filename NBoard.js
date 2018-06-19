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
		this.selectedNodeCount = 0;
		this.pins = {}; // pinid : pin
		this.links = {}; // linkid : [pin1, pin2]
		this.linkLines = {}; // linkid : [p1, p2, p3, p4, ...]

		this.activeMenu = null;

		this.nodeTypeList = [
			StringNode, IntegerNode, DoubleNode, DisplayNode, SubstringNode, AdditionNode, IncrementNode, CommentNode
		];
		this.nodeTypeDict = {};
		for(const type of this.nodeTypeList){
			this.nodeTypeDict[type.getName()] = type;
		}

		this.actionStack = [];
		this.actionStackIndex = -1;
		this.execIterCount = 0;

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
		this.lastMouseMoveEvent = null;
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
		if (this.lastMouseMoveEvent) {
			this.mouseMoved(this.lastMouseMoveEvent);
		}
		this.redraw();
	}

	closeMenu() {
		if (this.activeMenu) {
			try {
				this.activeMenu.remove();
			} catch (e) {}
			this.activeMenu = null;
		}
	}

	contextMenu(event) {
		const brd = this;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";

		const header = document.createElement("header");
		header.innerHTML = this.name;
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const micreateNode = document.createElement("div");
		micreateNode.className = "menuitem";
		micreateNode.innerHTML = "Create Node"
		micreateNode.onclick = function(e) {
			brd.applyMenu(brd.nodeCreationMenu(event));
		}
		menu.append(micreateNode);

		const miSelectAll = document.createElement("div");
		miSelectAll.className = "menuitem";
		miSelectAll.innerHTML = "Select All"
		miSelectAll.onclick = function(e) {
			brd.addAction(new ActSelectAll(brd));
			brd.selectAllNodes();
			brd.closeMenu();
		}
		menu.append(miSelectAll);

		if (this.actionStackIndex > -1) {
			const miUndo = document.createElement("div");
			miUndo.className = "menuitem";
			miUndo.innerHTML = "Undo"
			miUndo.onclick = function(e) {
				brd.undo();
				brd.closeMenu();
			}
			menu.append(miUndo);
		}

		if (this.actionStackIndex < this.actionStack.length - 1) {
			const miRedo = document.createElement("div");
			miRedo.className = "menuitem";
			miRedo.innerHTML = "Redo"
			miRedo.onclick = function(e) {
				brd.redo();
				brd.closeMenu();
			}
			menu.append(miRedo);
		}

		const mi = document.createElement("div");
		mi.className = "menuitem";
		mi.innerHTML = "Menu Item"
		mi.onclick = function(e) {
			brd.closeMenu();
		}
		menu.append(mi);

		return main;
	}

	applyMenu(menu) {
		this.closeMenu();
		this.activeMenu = menu;
		this.boardDiv.append(menu);
		$(".menusearch").focus();
	}

	nodeCreationMenu(event) {
		const brd = this;

		let selectedItem = 1;
		let validCount = 0;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";
		main.onkeydown = function(e) {
			switch (e.which) {
				case 38: // up arrow
					selectedItem--;
					if (selectedItem == 0) {
						selectedItem = validCount;
					}
					break;
				case 40: // down arrow
					selectedItem++;
					if (selectedItem == validCount + 1) {
						selectedItem = 1;
					}
					break;
			}
		}

		const header = document.createElement("header");
		header.innerHTML = "Create Node";
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const items = {};

		const miSearch = document.createElement("div");
		miSearch.className = "menuitem";
		// miSearch.innerHTML = type.getName();
		const searcharea = document.createElement("input");
		searcharea.type = "text";
		searcharea.className = "menusearch";
		searcharea.onkeydown = function(e) {
			switch (e.which) {
				case 13: // ENTER
					if (menu.children.length > 1) {
						menu.children[1].onclick(event);
					}
					return false;
				case 27: // ESC
					brd.closeMenu();
					return false;
			}
			return true;
		}
		searcharea.oninput = function(e) {
			const valid = [
				[],
				[],
				[],
				[]
			];
			const search = searcharea.value.toLowerCase().replace(/ /g, "");

			// clear menu
			for (const mn in items) {
				items[mn].remove();
			}

			if (search.length == 0) { // no search
				// add all nodes back
				for (const mn in items) {
					menu.append(items[mn]);
				}
			} else {
				validCount = 0;
				for (const type of brd.nodeTypeList) {
					const name = type.getName().toLowerCase().replace(' ', "");
					if (name.startsWith(search)) {
						if (name.length == search.length) { // exact name match
							valid[0].push(type);
							validCount++;
						} else { // prefix name match
							valid[2].push(type);
							validCount++;
						}
					} else if (typeof type.getTags === "function") {
						for (const tag of type.getTags()) {
							if (tag.startsWith(search)) {
								if (tag.length == search.length) { // exact tag match
									valid[1].push(type);
									validCount++;
								} else { // prefix tag match
									valid[3].push(type);
									validCount++;
								}
								break;
							}
						}
					}
				}
				for (const lst of valid) {
					for (const type of lst) {
						menu.append(items[type]);
					}
				}
			}
		}
		miSearch.append(searcharea);
		menu.append(miSearch);

		for (const type of this.nodeTypeList) {
			const mi = document.createElement("div");
			mi.className = "menuitem";
			mi.innerHTML = type.getName();
			mi.onclick = function(e) {
				// TODO 4DD 4N 4CT1ON H3R3
				const node = brd.createNode(type);
				node.setPosition(brd.evntToPt(e));
				brd.closeMenu();
			}
			items[type] = mi;
			menu.append(mi);
		}

		return main;
	}

	mouseDown(event) {
		this.lastMouseButton = event.which;
		this.clickStart = this.evntToPt(event);
		this.clickStartTarget = event.target;
		this.clickDistance = 0;

		switch (event.which) {
			// Left mouse button
			case 1:
				{
					// start ticking for screen edge panning
					this.dragPanID = setInterval(this.dragPanLogic.bind(this), 50);
					this.leftMDown = true;
					break;
				}
			case 2:
				{
					break;
				}
			case 3:
				{
					this.rightMDown = true;
				}
		}
		if (this.activeMenu != null && !this.activeMenu.contains(this.clickStartTarget)) {
			this.closeMenu()
		}

		this.redraw();
		return true;
	}

	mouseUp(event) {
		const button = event.which;
		// Left mouse button
		this.clickEnd = this.evntToPt(event);
		this.clickDelta = this.clickEnd.subtractp(this.clickStart);
		this.clickEndTarget = event.target;

		// stop ticking for screen edge panning
		clearInterval(this.dragPanID);

		switch (button) {
			case 1: // LEFT MOUSE
				{
					this.leftMDown = false;

					if (this.selectionBox) { // finish selection box
						// next 40ish lines are selection logic...
						if (this.env.altDown) { // deselect things in box
							const deselectedNodes = [];
							for (const nodeid in this.selectedNodes) {
								const node = this.nodes[nodeid];
								if (node.within(this.sboxMin, this.sboxMax)) {
									deselectedNodes.push(node);
									this.deselectNode(node);
								}
							}
							if (deselectedNodes.length > 0) {
								this.addAction(new ActDeselect(this, deselectedNodes));
							}
						} else {
							const selectedNodes2 = [];
							for (const nodeid in this.nodes) {
								const node = this.nodes[nodeid];
								if (node.within(this.sboxMin, this.sboxMax)) {
									selectedNodes2.push(node);
								}
							}

							if (selectedNodes2.length > 0) {
								if (this.env.shiftDown) {
									this.addAction(new ActSelect(this, selectedNodes2));
								} else {
									this.addAction(new NMacro(new ActDeselectAll(this), new ActSelect(this, selectedNodes2)));
								}
							} else {
								if (!this.env.shiftDown) {
									this.addAction(new ActDeselectAll(this));
								}
							}

							// deselect all if shift isn't down
							if (!this.env.shiftDown) {
								this.deselectAllNodes();
							}

							for (const node of selectedNodes2) {
								this.selectNode(node);
							}
						}
						this.destroySelectionBox();
					} else if (this.draggedNode) { // finish moving node(s)
						this.draggedNode = this.getDivNode(this.clickStartTarget);
						if (this.draggedNode.selected) {
							this.addAction(new ActMoveSelectedNodes(this, this.clickDelta));
						} else {
							this.addAction(new ActMoveNodes(this, this.clickDelta, [this.draggedNode]));
						}
						this.draggedNode = null;
					} else if (this.draggedPin) { // finish dragging pin
						this.boardDiv.removeAttribute("linking");
						this.draggedPin.pinDiv.removeAttribute("linking");
						for (const nodeid in this.nodes) {
							const node = this.nodes[nodeid];
							if (this.draggedPin.side) {
								for (const pinid in node.inpins) {
									node.inpins[pinid].pinDiv.removeAttribute("match");
								}
							} else {
								for (const pinid in node.outpins) {
									node.outpins[pinid].pinDiv.removeAttribute("match");
								}
							}
						}
						// successful link
						if (this.clickEndTarget.classList.contains("pin")) {
							// TODO 4DD 4N 4CT1ON H3R3
							const lank = this.draggedPin.linkTo(this.getDivPin(this.clickEndTarget));
						}
						delete this.links[this.draggedPin.pinid];
						this.draggedPin = null;
					} else if (this.clickDistance > this.env.dragDistance) { // something unknown was dragged

					} else { // nothing was dragged - click occured
						const upTargetClasses = this.clickStartTarget.classList;

						if (this.clickStartTarget == this.boardDiv) { // board clicked
							if (this.selectedNodeCount) {
								this.addAction(new ActDeselectAll(this));
								this.deselectAllNodes();
							}
						} else if (upTargetClasses.contains("nodepart")) { // a node was clicked
							const divNode = this.getDivNode(this.clickStartTarget);
							if (this.env.shiftDown) {
								this.addAction(new ActSelect(this, [divNode]));
								this.selectNode(divNode);
							} else if (this.env.altDown) {
								this.addAction(new ActToggleSelect(this, [divNode]));
								this.toggleSelectNode(divNode);
							} else {
								this.addAction(new NMacro(new ActDeselectAll(this), new ActSelect(this, [divNode])));
								this.deselectAllNodes();
								this.selectNode(divNode);
							}
						} else if (upTargetClasses.contains("pin")) { // a pin was clicked
							const divPin = this.getDivPin(this.clickStartTarget);
							if (this.env.altDown) {
								if (divPin.isExec) {
									this.execIterCount = 0;
									console.log("Started Execution.");
									divPin.execute();
									console.log("Finished Execution.");
								} else {
									console.log(divPin.getValue());
								}
							}
						} else { // something else was clicked
							if (typeof this.onclick === "function") {
								this.clickStartTarget.onclick(event);
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
					this.rightMDown = false;
				}
		}
		this.redraw();
		return false;
	}

	mouseMoved(event) {
		this.lastMouseMoveEvent = event;
		this.currentMouse = this.evntToPt(event);
		this.trueCurrentMouse = new NPoint(event.clientX, event.clientY);
		this.frameMouseDelta = this.currentMouse.subtractp(this.lastMousePosition);
		this.clickDistance += this.frameMouseDelta.lengthSquared();

		if (this.leftMDown) {
			// click & drag in progress?
			if (this.selectionBox) { // currently dragging board (selection box)
				this.sboxMin = NPoint.min(this.clickStart, this.currentMouse);
				this.sboxMax = NPoint.max(this.clickStart, this.currentMouse);

				const sboxMin = this.sboxMin;
				const sboxSize = this.sboxMax.subtractp(this.sboxMin);
				this.selectionBox.style.left = sboxMin.x + "px";
				this.selectionBox.style.top = sboxMin.y + "px";
				this.selectionBox.style.width = sboxSize.x + "px";
				this.selectionBox.style.height = sboxSize.y + "px";
			} else if (this.draggedNode) { // currently dragging node(s)
				if (this.draggedNode.selected) { // dragging selected nodes
					for (const sNodeID in this.selectedNodes) {
						const selectedNode = this.selectedNodes[sNodeID];
						selectedNode.move(this.frameMouseDelta);
					}
				} else { // dragging unselected node
					this.draggedNode.move(this.frameMouseDelta);
				}
			} else if (this.draggedPin) { // currently dragging pins
				// only redrawing is required for dragged pin
				this.redraw();

			} else if (this.clickDistance > this.env.dragDistance) { // currently dragging nothing - check if drag has started
				const upTargetClasses = this.clickStartTarget.classList;

				if (this.clickStartTarget == this.boardDiv) { // start selection box
					this.makeSelectionBox(this.clickStart);
				} else if (upTargetClasses.contains("nodepart")) { // start dragging node
					this.draggedNode = this.getDivNode(this.clickStartTarget);
				} else if (upTargetClasses.contains("pin")) { // start dragging pin
					this.draggedPin = this.getDivPin(this.clickStartTarget);
					this.links[this.draggedPin.pinid] = [this.draggedPin, null];
					this.draggedPin.pinDiv.setAttribute("linking", true);
					this.boardDiv.setAttribute("linking", true);
					for (const nodeid in this.nodes) {
						const node = this.nodes[nodeid];
						if (this.draggedPin.side) {
							for (const pinid in node.inpins) {
								const pin = node.inpins[pinid]
								if (this.draggedPin.canPlugInto(pin)) {
									pin.pinDiv.setAttribute("match", true);
								}
							}
						} else {
							for (const pinid in node.outpins) {
								const pin = node.outpins[pinid]
								if (pin.canPlugInto(this.draggedPin)) {
									pin.pinDiv.setAttribute("match", true);
								}
							}
						}
					}
				}
			}
		}

		this.lastMousePosition = this.currentMouse;
		return true;
	}

	mouseWheel(event) {
		if (event.ctrlKey) {
			const prevZoom = this.zoom;
			this.zoomCounter += event.deltaY;
			this.zoomCounter = Math.min(171, Math.max(-219, this.zoomCounter));
			this.zoom = Math.pow(1.0075, -this.zoomCounter);
			this.displayOffset = this.displayOffset.subtractp(this.evntToPtBrd(event).subtractp(this.displayOffset).divide1(prevZoom).multiply1(this.zoom - prevZoom))
		} else {
			this.displayOffset = this.displayOffset.subtract2(event.deltaX, event.deltaY);
		}
		this.redraw();
		return false;
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
			case 8: // BACKSPACE
			case 46: // DELETE
				const selected = Object.values(this.selectedNodes);
				// TODO 4DD 4N 4CT1ON H3R3
				for (const node of selected) {
					this.removeNode(node);
				}
				break;
			case 27: // ESC
				this.closeMenu();
				break;
			case 32: // SPACE
				this.closeMenu();
				this.activeMenu = this.nodeCreationMenu(this.lastMouseMoveEvent);
				this.boardDiv.append(this.activeMenu);
				$(".menusearch").focus();
				break;
			case 90: // Z
				if (this.env.ctrlDown) {
					if (this.env.shiftDown) {
						this.redo();
					} else {
						this.undo();
					}
				}
				break;
			case 65: // A
				if (main.ctrlDown) {
					this.addAction(new ActSelectAll(this));
					main.activeBoard.selectAllNodes();
				}
				break;
			case 187: // +
				if (main.ctrlDown) {
					const prevZoom = this.zoom;
					if (this.zoom < 5) {
						this.zoom *= 1.2;
					}
					this.redraw();
				}
				break;
			case 189: // /
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
			this.selectedNodeCount++;
		}
	}

	deselectNode(node) {
		if (node.selected) {
			node.nodeDiv.removeAttribute("selected");
			node.selected = false;
			delete this.selectedNodes[node.nodeid];
			this.selectedNodeCount--;
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
		this.selectedNodeCount = 0;
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
		this.redraw();
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
		this.boardDiv.oncontextmenu = function(event) {
			brd.closeMenu();
			if (event.target == brd.boardDiv) {
				// board context menu
				brd.applyMenu(brd.contextMenu(event));
			} else if (event.target.classList.contains("nodepart")) {
				// node context menus
				const node = brd.getDivNode(event.target);
				if (node.selected && brd.selectedNodeCount > 1) {
					let sameType = true;
					// check if all node types are the same
					for (const id in brd.selectedNodes) {
						if (brd.nodes[id].constructor.getName() != node.constructor.getName()) {
							sameType = false;
							break;
						}
					}
					// TODO F1GUR3 TH1S OUT
					if (false && sameType) {
						// menu for multiple nodes of same type
					} else {
						// menu for multiple nodes of varying type
						brd.applyMenu(multiNodeMenu(brd, event, Object.values(brd.selectedNodes)));
					}
				} else {
					// menu for single node
					brd.applyMenu(node.contextMenu(event));
				}
			} else if (event.target.classList.contains("pin")) {
				// menu for pins
				brd.applyMenu(brd.getDivPin(event.target).contextMenu(event));
			}
			return false;
		};
		this.paneDiv.append(this.boardDiv);

		this.containerDiv = document.createElement("div");
		this.containerDiv.className = "container";
		this.boardDiv.append(this.containerDiv);

		this.canvasDiv = document.createElement("canvas");
		this.boardDiv.append(this.canvasDiv);

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
			const splineDist = Math.abs(l1.y - l2.y) / 2 + Math.abs((l1.x - l2.x)) / 4;
			const p1 = new NPoint(l1.x - splineDist, l1.y);
			const p2 = new NPoint(l2.x + splineDist, l2.y);
			ctx.moveTo(l1.x, l1.y);
			ctx.bezierCurveTo(p1.x, p1.y, p2.x, l2.y, l2.x, l2.y);
			ctx.stroke();
			// let lastp = l1;
			// const inc = (this.env.lineClickDistance * 2)/(Math.abs(l1.x - l2.x)+Math.abs(l1.y - l2.y));
			// for(let i=inc; i<1; i+=inc){
			// 	const curvePt = pointOnBezier(l1,p1,p2,l2, i);
			// 	ctx.lineWidth = 4;
			// 	ctx.moveTo(lastp.x, lastp.y);
			// 	ctx.beginPath();
			// 	const slope = Math.abs(slopeOnBezier(l1,p1,p2,l2,i).y);
			// 	ctx.arc(curvePt.x,curvePt.y,slope,0,2*Math.PI);
			// 	ctx.stroke();
			// }
		}
	}

	createNode(type) {
		const node = new type();
		this.addNode(node);
		return node;
	}

	addNode(node) {
		node.board = this;
		this.containerDiv.append(node.createNodeDiv());
		this.nodes[node.nodeid] = node;
	}

	removeNode(node) {
		node.unlinkAllPins();
		node.containerDiv.remove();
		delete this.nodes[node.nodeid];
		delete this.selectedNodes[node.nodeid];
		this.redraw();
	}
}