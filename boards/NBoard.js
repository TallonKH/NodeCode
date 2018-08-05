class NBoard {
	constructor(env, data) {
		if (typeof data == "string") {
			console.log("Created board " + data);
			this.name = data;
			this.uid = (~~(Math.random() * 8388607));
			this.zoom = 1;
			this.zoomCounter = -1.0417;
			this.displayOffset = new NPoint(0, 0);
		} else {
			console.log("Created board " + data.name);
			this.name = data.name;
			this.uid = data.id;
			this.zoom = data.zoom;
			this.zoomCounter = -Math.log(this.zoom) / Math.log(1.0075);;
			this.displayOffset = new NPoint(data.dpsoX, data.dspoY);
			this.activeCategories = new Set(data.cats);
		}
		this.tabId = "maintab-" + env.boardCount;
		this.saved = ~~env.savedBoards[this.name];
		this.named = this.saved;
		this.env = env;
		env.boardCount += 1;
		this.zoomCounter = 0;
		this.paneDiv = null;
		this.boardDiv = null;
		this.canvasDiv = null;
		this.containerDiv = null;

		this.nodes = {}; // nodeid : node
		this.selectedNodes = {};
		this.selectedNodeCount = 0;
		this.pins = {}; // pinid : pin
		this.links = {}; // linkid : [pin1, pin2]

		this.activeCtxMenu = null;

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

		this.activeGLContexts = {};

		// mouse stuff
		this.leftMDown = false;
		this.rightMDown = false;
		this.lastMouseButton = -1;
		this.clickStartTarget = null;
		this.clickEndTarget = null;
		this.clickStart = new NPoint();
		this.clickEnd = new NPoint();
		this.clickDelta = new NPoint();
		this.clickDistance = 0;
		this.lastMousePosition = new NPoint();
		this.currentMouse = new NPoint();
		this.trueLastMouse = new NPoint();
		this.trueCurrentMouse = new NPoint();
		this.trueFrameMouseDelta = new NPoint();
		this.frameMouseDelta = new NPoint();
		this.currentMouseDelta = new NPoint();
		this.lastMouseMoveEvent = null;
		this.prevMouseDownTime = 0;
		this.mouseDownTime = 0;
		this.prevMouseUpTime = 0;
		this.mouseUpTime = 0;

		setInterval(this.shaderClock.bind(this), 16);
	}

	evntToPt(event) {
		const p = new NPoint(event.clientX, event.clientY).subtract2(this.boundRect.left, this.boundRect.top).subtractp(this.displayOffset).divide1(this.zoom);
		return p;
	}

	evntToDivPos(event) {
		const p = new NPoint(event.clientX, event.clientY).subtract2(this.boundRect.left - 20, 5);
		return p;
	}

	duplicateNodes(nodes) {
		const newNodes = this.loadNodes(scrambleIDs(this.saveNodes(nodes)));
		const bounds = getGroupBounds(nodes);
		let diff = bounds.max.subtractp(bounds.min);
		// offset duplicated nodes in the most space-efficient manner
		if (diff.y > diff.x) {
			diff = new NPoint(diff.x + 20, 0);
		} else {
			diff = new NPoint(0, diff.y + 20);
		}
		for (const node of newNodes) {
			node.setPosition(node.position.addp(diff));
		}
		return newNodes;
	}

	duplicateNode(node) {
		const newNode = this.loadNodes(scrambleIDs(this.saveNodes([node])))[0];
		newNode.setPosition(node.position.add2(0, node.nodeDiv.clientHeight + 20));
		return newNode;
	}

	copyNodes(nodes) {
		localStorage.setItem("clipboard", JSON.stringify(this.saveNodes(nodes)));
	}

	cutNodes(nodes) {
		this.copyNodes(nodes);
		nodes.forEach(x => x.remove());
	}

	pasteNodes(position) {
		const parsed = scrambleIDs(JSON.parse(localStorage.getItem("clipboard")));
		this.deselectAllNodes();
		const nodes = this.loadNodes(parsed);
		const offset = position.subtractp(getGroupCenter(nodes));
		for (const node of nodes) {
			node.setPosition(node.position.addp(offset));
			node.select();
		}
		return nodes;
	}

	evntToPtBrd(event) {
		const p = new NPoint(event.clientX, event.clientY).subtract2(this.boundRect.left, this.boundRect.top);
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
		if (this.activeCtxMenu) {
			this.activeCtxMenu.onClosed();
			try {
				this.activeCtxMenu.containerDiv.remove();
			} catch (e) {}
			this.activeCtxMenu = null;
		}
	}

	makeContextMenu(pos) {
		const brd = this;
		const menu = new NCtxMenu(this, pos);
		menu.setHeader("Board - " + this.name);

		let op;

		op = new NCtxMenuOption("Create Node");
		op.action = function(p) {
			brd.applyMenu(brd.makeNodeCreationMenu(pos));
			return true;
		}
		menu.addOption(op);

		if (brd.selectedNodeCount) {
			op = new NCtxMenuOption("[Selected Nodes]...");
			op.action = function(p) {
				brd.applyMenu(makeMultiNodeMenu(brd, pos, Object.values(brd.selectedNodes)));
				return true;
			}
			menu.addOption(op);
		}

		if (localStorage.getItem("clipboard")) {
			op = new NCtxMenuOption("Paste");
			op.action = function(p) {
				const prevSelected = Object.values(brd.selectedNodes);
				const nodes = brd.pasteNodes(p);
				brd.addAction(new ActPasteClipboard(brd, prevSelected, nodes));
			}
			menu.addOption(op);
		}

		op = new NCtxMenuOption("Export Board");
		op.action = function(p) {
			// TODO M4K3 4 T3XT4R34
			console.log(JSON.stringify(brd.exportBoard()));
		}
		menu.addOption(op);

		op = new NCtxMenuOption("Select All");
		op.action = function(p) {
			brd.addAction(new ActSelectAll(brd));
			brd.selectAllNodes();
		};
		menu.addOption(op);

		if (this.actionStackIndex > -1) {
			op = new NCtxMenuOption("Undo (" + (this.actionStackIndex + 1) + ")");
			op.action = p => brd.undo();
			menu.addOption(op);
		}

		const diff = this.actionStack.length - 1 - this.actionStackIndex
		if (diff > 0) {
			op = new NCtxMenuOption("Redo (" + diff + ")");
			op.action = p => brd.redo();
			menu.addOption(op);
		}

		op = new NCtxMenuOption("Unsave All");
		op.action = function(p) {
			if (prompt("Unsaving will remove any revisions of this file stored on your computer. The file will stay open, however, in case you want to re-save it. Please enter the name of this file to confirm.") == brd.name) {
				alert("Files removed.");
				brd.env.unsave(brd);
				brd.env.refreshFileList();
			} else {
				alert("Cancelled. No files removed.");
			}
		}
		menu.addOption(op);

		return menu;
	}

	applyMenu(menu) {
		this.closeMenu();
		this.activeCtxMenu = menu;
		this.boardDiv.append(menu.createDiv());
		if (menu.searchable) {
			menu.searchDiv.focus();
		}
	}

	makeNodeCreationMenu(pos, pinFilter = null) {
		const brd = this;
		const menu = new NCtxMenu(this, pos);
		menu.setHeader("Create Node");

		let validCount = 0;

		for (const catn in this.env.nodeCategories) {
			if (!this.activeCategories.has(catn)) {
				continue
			}
			for (const type of this.env.nodeCategories[catn]) {
				if (pinFilter) {
					let filteredOut = false;
					let can = false;
					if (pinFilter.side) {
						if (!type.getInTypes) {
							continue;
						}
						if (pinFilter.multiTyped) {
							for (const inT of type.getInTypes()) {
								for (const outT of pinFilter.types) {
									if (outT.isA(inT)) {
										can = true;
										break;
									}
								}
								if (can) {
									break;
								}
							}
						} else {
							for (const inT of type.getInTypes()) {
								if (pinFilter.type.isA(inT)) {
									can = true;
									break;
								}
							}
						}
					} else {
						if (!type.getOutTypes) {
							continue;
						}
						if (pinFilter.multiTyped) {
							for (const outT of type.getOutTypes()) {
								for (const inT of pinFilter.types) {
									if (outT.isA(inT)) {
										can = true;
										break;
									}
								}
								if (can) {
									break;
								}
							}
						} else {
							for (const outT of type.getOutTypes()) {
								if (outT.isA(pinFilter.type)) {
									can = true;
									break;
								}
							}
						}
					}

					if (!can) {
						continue;
					}
				}
				const op = new NCtxMenuOption(type.getName());
				let otherPin = null;
				if (pinFilter) {
					op.action = function(p) {
						const node = brd.createNode(type);
						if (pinFilter.side) {
							for (const pinn of node.inpinOrder) {
								otherPin = node.inpins[pinn];
								if (otherPin.linkTo(pinFilter)) {
									break;
								} else {
									otherPin = null;
								}
							}
						} else {
							for (const pinn of node.outpinOrder) {
								otherPin = node.outpins[pinn];
								if (otherPin.linkTo(pinFilter)) {
									break;
								} else {
									otherPin = null;
								}
							}
						}
						delete brd.links[pinFilter.pinid];
						node.setPosition(p);
						if (otherPin) {
							brd.addAction(new NMacro(new ActAddNode(brd, node), new ActCreateLink(brd, pinFilter, otherPin)));
						} else {
							brd.addAction(new ActAddNode(brd, node));
						}
					}
				} else {
					op.action = function(p) {
						const node = brd.createNode(type);
						node.setPosition(p);
						brd.addAction(new ActAddNode(brd, node));
					}
				}
				if (type.getTags) {
					op.setTags(...type.getTags());
				}
				menu.addOption(op);
				validCount++;
			}
		}

		if (pinFilter) {
			menu.onClosed = function() {
				delete brd.links[pinFilter.pinid];
				brd.redraw();
			}
		}

		return menu;
	}

	mouseDown(event) {
		this.prevMouseDownTime = this.mouseDownTime;
		this.mouseDownTime = currentTimeMillis();
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
		if (this.activeCtxMenu != null && !this.activeCtxMenu.containerDiv.contains(this.clickStartTarget)) {
			this.closeMenu();
		}

		this.redraw();
		return true;
	}

	mouseUp(event) {
		const prevClickDelta = this.clickDelta;
		const button = event.which;
		this.prevMouseUpTime = this.mouseUpTime;
		this.mouseUpTime = currentTimeMillis();
		this.clickEnd = this.evntToPt(event);
		this.clickDelta = this.clickEnd.subtractp(this.clickStart);
		this.clickEndTarget = event.target;

		// stop ticking for screen edge panning
		clearInterval(this.dragPanID);

		if (!this.lastDoubleClicked && this.mouseUpTime - this.prevMouseDownTime < 300 && prevClickDelta.lengthSquared() < 5 && this.clickDelta.lengthSquared() < 5) {
			// double click
			this.lastDoubleClicked = true;
			if (this.clickEndTarget.classList.contains("nodepart")) {
				const node = this.getDivNode(this.clickEndTarget);
				this.goToNodes([node]);
			}
		} else {
			// normal click
			this.lastDoubleClicked = false;
		}

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

							if (selectedNodes2.length) {
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
					} else if (this.cutting) {
						const linksCut = this.doCut(this.clickStart, this.clickEnd);
						if (linksCut.length) {
							this.addAction(new ActRemoveLinks(this, linksCut));
						}
						this.cutting = false;
					} else if (this.draggedNode) { // finish moving node(s)
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

						let releaseLink = true;

						// successful link
						if (this.clickEndTarget.classList.contains("pin")) {
							const other = this.getDivPin(this.clickEndTarget);
							this.addAction(new ActCreateLink(this, this.draggedPin, other));
							const lank = this.draggedPin.linkTo(other);
						} else if (this.clickEndTarget.classList.contains("nodepart")) { // tried to link to node
							const node = this.getDivNode(this.clickEndTarget);

							// null = no custom action specified
							// false = connection will fail
							// truthy = connection allowed - returns custom action
							const action = node.onAttemptedDropLink(this.draggedPin);

							if (action !== false) {
								if (this.draggedPin.side) {
									for (const pinn of node.inpinOrder) {
										const other = node.inpins[pinn];
										if ((other.multiConnective || other.linkNum == 0)) {
											if (this.draggedPin.canPlugInto(other)) {
												if (action) {
													this.addAction(new NMacro(action, new ActCreateLink(this, this.draggedPin, other)));
												} else {
													this.addAction(new ActCreateLink(this, this.draggedPin, other));
												}
												other.linkTo(this.draggedPin);
												break;
											}
										}
									}
								} else {
									for (const pinn of node.outpinOrder) {
										const other = node.outpins[pinn];
										if ((other.multiConnective || other.linkNum == 0)) {
											if (other.canPlugInto(this.draggedPin)) {
												if (action) {
													this.addAction(new NMacro(action, new ActCreateLink(this, this.draggedPin, other)));
												} else {
													this.addAction(new ActCreateLink(this, this.draggedPin, other));
												}
												other.linkTo(this.draggedPin);
												break;
											}
										}
									}
								}
							}
						} else { // tried to link to something else (board, probably);
							const evnt = this.lastMouseMoveEvent || event;
							releaseLink = false;
							this.applyMenu(this.makeNodeCreationMenu(evnt, this.draggedPin));
						}
						if (releaseLink) {
							delete this.links[this.draggedPin.pinid];
						}
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
					if (this.clickDistance > this.env.dragDistance) {

					} else {
						this.closeMenu();
						if (event.target == this.boardDiv) {
							// board context menu
							this.applyMenu(this.makeContextMenu(event));
						} else if (event.target.classList.contains("nodepart")) {
							// node context menus
							const node = this.getDivNode(event.target);
							if (node.selected && this.selectedNodeCount > 1) {
								let sameType = true;
								// check if all node types are the same
								for (const id in this.selectedNodes) {
									if (this.nodes[id].constructor.getName() != node.constructor.getName()) {
										sameType = false;
										break;
									}
								}
								// menu for multiple nodes of varying type
								this.applyMenu(makeMultiNodeMenu(this, event, Object.values(this.selectedNodes)));
							} else {
								// menu for single node
								this.applyMenu(node.makeContextMenu(event));
							}
						} else if (event.target.classList.contains("pin")) {
							// menu for pins
							this.applyMenu(this.getDivPin(event.target).makeContextMenu(event));
						}
					}
				}
		}
		this.redraw();
		return false;
	}

	mouseMoved(event) {
		this.trueLastMouse = this.trueCurrentMouse;
		this.trueCurrentMouse = new NPoint(event.clientX, event.clientY);
		this.trueFrameMouseDelta = this.trueCurrentMouse.subtractp(this.trueLastMouse);
		this.lastMouseMoveEvent = event;
		this.currentMouse = this.evntToPt(event);
		this.frameMouseDelta = this.currentMouse.subtractp(this.lastMousePosition);
		this.clickDistance += this.frameMouseDelta.lengthSquared();
		this.currentMouseDelta = this.currentMouse.subtractp(this.clickStart);

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
			} else if (this.cutting) {

			} else if (this.draggedNode) { // currently dragging node(s)
				if (this.draggedNode.selected) { // dragging selected nodes
					if (this.env.altDown) {
						for (const sNodeID in this.selectedNodes) {
							this.selectedNodes[sNodeID].move(this.frameMouseDelta);
						}
					} else {
						const offset = this.draggedNodeInitialPos.addp(this.currentMouseDelta).divide1(this.env.snapDistance).round().multiply1(this.env.snapDistance).subtractp(this.draggedNode.position);
						for (const sNodeID in this.selectedNodes) {
							const snode = this.selectedNodes[sNodeID];
							snode.move(offset);
						}
					}
				} else { // dragging unselected node
					if (this.env.altDown) {
						this.draggedNode.move(this.frameMouseDelta);
					} else {
						const pos = this.draggedNodeInitialPos.addp(this.currentMouseDelta).divide1(this.env.snapDistance).round().multiply1(this.env.snapDistance);
						this.draggedNode.setPosition(pos);
					}
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
					this.draggedNodeInitialPos = this.draggedNode.position;
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
		} else if (this.rightMDown) {
			if (this.clickDistance > this.env.dragDistance) {
				this.displayOffset = this.displayOffset.addp(this.trueFrameMouseDelta);
				this.redraw();
			}
		}

		if (this.cutting) {
			this.redraw();
		}

		this.lastMousePosition = this.currentMouse;
		return true;
	}

	mouseWheel(event) {
		if (this.activeCtxMenu) {
			return true;
		}
		if (event.ctrlKey) {
			const prevZoom = this.zoom;
			this.zoomCounter += event.deltaY;
			this.zoomCounter = Math.min(200, Math.max(-219, this.zoomCounter));
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
			case 27: // ESC
				if (this.cutting) {
					this.cutting = false;
					this.redraw();
				}
				this.closeMenu();
				break;
			case 37:
				{ // LEFT ARROW
					const delta = new NPoint(-this.env.moveDistance, 0);
					this.addAction(new ActNudgeLeft(this));
					for (const nn in this.selectedNodes) {
						this.nodes[nn].move(delta);
					}
					break;
				}
			case 80:
				console.log(this.actionStack);
				break;
			case 39:
				{ // RIGHT ARROW
					const delta = new NPoint(this.env.moveDistance, 0);
					this.addAction(new ActNudgeRight(this));
					for (const nn in this.selectedNodes) {
						this.nodes[nn].move(delta);
					}
					break;
				}
			case 38: // UP ARROW
				{
					const delta = new NPoint(0, -this.env.moveDistance);
					this.addAction(new ActNudgeUp(this));
					for (const nn in this.selectedNodes) {
						this.nodes[nn].move(delta);
					}
					break;
				}
			case 40: // DOWN ARROW
				{
					const delta = new NPoint(0, this.env.moveDistance);
					this.addAction(new ActNudgeDown(this));
					for (const nn in this.selectedNodes) {
						this.nodes[nn].move(delta);
					}
					break;
				}
			case 32: // SPACE
				this.closeMenu();
				if (this.lastMouseMoveEvent) {
					this.applyMenu(this.makeNodeCreationMenu(this.lastMouseMoveEvent));
				}
				break;
			case 8: // BACKSPACE
			case 46: // DELETE
				const selected = Object.values(this.selectedNodes);
				this.addAction(new ActRemoveSelectedNodes(this));
				for (const node of selected) {
					this.removeNode(node);
				}
				break;
			case 67: // C
				if (this.env.ctrlDown || this.env.metaDown) {
					if (this.selectedNodeCount) {
						this.copyNodes(Object.values(this.selectedNodes));
					}
				}
				break;
			case 69: // E
				if (this.env.ctrlDown || this.env.metaDown) {
					if (confirm("Download?")) {
						downloadFile(this.name + ".json", JSON.stringify(this.exportBoard()));
					}
				}
				break;
			case 75: // K
				this.cutting = !this.cutting;
				this.redraw();
				break;
			case 86: // V
				if (this.env.ctrlDown || this.env.metaDown) {
					if (this.lastMousePosition) {
						const prevSelected = Object.values(this.selectedNodes);
						const nodes = this.pasteNodes(this.lastMousePosition);
						this.addAction(new ActPasteClipboard(this, prevSelected, nodes));
					}
				}
				break;
			case 88: // X
				if (this.env.ctrlDown || this.env.metaDown) {
					if (this.selectedNodeCount) {
						this.addAction(new ActRemoveSelectedNodes(this));
						this.cutNodes(Object.values(this.selectedNodes));
					}
				}
				break;
			case 90: // Z
				if (this.env.ctrlDown || this.env.metaDown) {
					if (this.env.shiftDown) {
						this.redo();
					} else {
						this.undo();
					}
				}
				break;
			case 65: // A
				if (main.ctrlDown || this.env.metaDown) {
					this.addAction(new ActSelectAll(this));
					main.activeBoard.selectAllNodes();
				}
				break;
			case 83: // S
				if (main.ctrlDown || this.env.metaDown) {
					let saveChanged = false;
					if (!this.named || this.env.shiftDown) {
						const name = prompt("What would you like to name this file?", this.name);
						if (name) {
							saveChanged = true;
							this.name = name;
							this.named = true;
							localStorage.removeItem("initialPreset");
						} else {
							break;
						}
					}
					this.saved = this.env.saveBoardToStorage(this);
					if (saveChanged) {
						this.env.rememberOpened();
						this.env.refreshFileList();
					}
					if (this.saved) {
						this.tabDivLink.innerHTML = this.name;
					}
				}
				break;
			case 187: // +
				if (main.ctrlDown || this.env.metaDown) {
					const prevZoom = this.zoom;
					if (this.zoom < 5) {
						this.zoom *= 1.2;
					}
					this.redraw();
				}
				break;
			case 189: // -
				if (main.ctrlDown || this.env.metaDown) {
					const prevZoom = this.zoom;
					if (this.zoom > 0.28) {
						this.zoom *= 0.8333333;
					}
					this.redraw();
				}
				break;
		}
	}

	undo() {
		this.setUnsaved();
		if (this.actionStackIndex == -1) {
			return;
		}
		this.actionStack[this.actionStackIndex].undo();
		this.actionStackIndex--;
	}

	redo() {
		this.setUnsaved();
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

	doCut(start, end) {
		if (this.cutting) {
			const linksCut = [];
			start = start.multiply1(this.zoom).addp(this.displayOffset);
			end = end.multiply1(this.zoom).addp(this.displayOffset);
			for (const linkid in this.links) {
				const link = this.links[linkid];
				const pinA = link[0];
				const pinB = link[1];

				const pts = this.calcLinkPoints(pinA, pinB);
				const ctx = this.canvasDiv.getContext("2d");
				for (let i = 0, l = pts.length - 1; i < l; i++) {
					if (NPoint.segIntersect(pts[i], pts[i + 1], start, end)) {
						linksCut.push([pinA.pinid, pinB.pinid]);
						pinA.unlink(pinB);
						break;
					}
				}
			}
			return linksCut;
		} else {
			return [];
		}
	}

	calcLinkPoints(pinA, pinB) {
		let l1;
		let l2;
		if (pinA.side) {
			l1 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);;
			l2 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
		} else {
			l1 = divCenter(pinA.pinDiv).subtractp(this.cvOffset);
			l2 = divCenter(pinB.pinDiv).subtractp(this.cvOffset);;
		}

		const yDist = Math.abs(l1.y - l2.y);
		const xDist = Math.abs(l1.x - l2.x);

		const xPush = Math.min(300 * this.zoom, Math.max(0, (l2.x - l1.x) - yDist) / 2);
		const yPush = l1.y > l2.y ? xPush : -xPush;

		const splineDist = yDist / 2 + xDist / 4;
		const p1 = new NPoint(l1.x - splineDist - xPush, l1.y - yPush);
		const p2 = new NPoint(l2.x + splineDist + xPush, l2.y + yPush);

		const bzpts = [];
		bzpts.push(l1);
		for (let i = 0; i <= 0.5; i += 0.1) {
			const t = i * i + 0.05;
			bzpts.push(pointOnBezier(l1, p1, p2, l2, t));
		}
		for (let i = 0.5; i <= 1; i += 0.1) {
			const oi = 1 - i;
			const t = 0.95 - oi * oi;
			bzpts.push(pointOnBezier(l1, p1, p2, l2, t));
		}
		bzpts.push(l2);

		return bzpts;
	}

	scrolled(event) {
		this.displayOffset = this.displayOffset.add2(event.deltaX, event.deltaY);
	}

	setUnsaved() {
		if (this.saved) {
			this.saved = false;
			this.tabDivLink.innerHTML = this.name + "*";
		}
	}

	setSaved() {
		if (!this.saved) {
			this.saved = true;
			this.tabDivLink.innerHTML = this.name;
		}
	}

	addAction(action) {
		action.added(this.actionStack);
		this.setUnsaved();
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

		this.tabDivLink = document.createElement("a");
		this.tabDivLink.innerHTML = this.name + (this.saved ? "" : "*");
		this.tabDivLink.setAttribute("href", "#" + this.tabId);

		this.tabDiv.append(this.tabDivLink);
		return this.tabDiv;
	}

	createPaneDiv() {
		if (this.paneDiv != null) {
			return null;
		}

		this.paneDiv = document.createElement("div");
		this.paneDiv.className = "tabpane";
		this.paneDiv.id = this.tabId;
		let brd = this;

		this.boardDiv = document.createElement("div");
		this.boardDiv.className = "board";
		this.boardDiv.oncontextmenu = function(e) {
			return false
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
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.canvasDiv.width, this.canvasDiv.height);
		ctx.restore();

		ctx.lineCap = "round";

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

			const yDist = Math.abs(l1.y - l2.y);
			const xDist = Math.abs(l1.x - l2.x);

			const xPush = Math.min(300 * this.zoom, Math.max(0, (l2.x - l1.x) - yDist) / 2);
			const yPush = l1.y > l2.y ? xPush : -xPush;

			const splineDist = yDist / 2 + xDist / 4;
			const p1 = new NPoint(l1.x - splineDist - xPush, l1.y - yPush);
			const p2 = new NPoint(l2.x + splineDist + xPush, l2.y + yPush);

			ctx.beginPath();
			ctx.moveTo(l1.x, l1.y);
			ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, l2.x, l2.y);
			ctx.stroke();
		}

		if (this.cutting) {
			const p1 = this.lastMousePosition.multiply1(this.zoom).addp(this.displayOffset);
			ctx.lineWidth = this.zoom * 8;
			ctx.strokeStyle = "#FF0000";
			ctx.beginPath();
			ctx.arc(p1.x, p1.y, 16 * this.zoom, 0, TAU);
			ctx.stroke();

			if (this.leftMDown) {
				const p2 = this.clickStart.multiply1(this.zoom).addp(this.displayOffset);
				ctx.beginPath();
				ctx.arc(p2.x, p2.y, 16 * this.zoom, 0, TAU);
				ctx.stroke();

				ctx.lineWidth = this.zoom * 24;
				ctx.strokeStyle = "#FFFFFF";
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();

				ctx.lineWidth = this.zoom * 8;
				ctx.strokeStyle = "#FF0000";
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			}
		}
	}

	saveSelectedNodes() {
		return this.saveNodes(Object.values(this.selectedNodes));
	}

	saveAllNodes() {
		return this.saveNodes(Object.values(this.nodes));
	}

	exportBoard() {
		const data = this.saveAllNodes();
		data.name = this.name;
		data.id = this.uid;
		data.dspoX = this.displayOffset.x;
		data.dspoY = this.displayOffset.y;
		data.zoom = this.zoom;
		data.cats = Array.from(this.activeCategories);
		return data;
	}

	saveNodes(nodes) {
		const nodeids = {};
		const pinids = {};
		const data = {};
		const linkData = {};
		const nodata = []; // nodedata, not no-data

		// data.nids = nodeids;
		// data.pids = pinids;
		data.nodes = nodata;

		for (const node of nodes) {
			const no = node.save(nodeids, pinids);

			nodata.push(no.nodes[0]);

			if (no.links) {
				for (const linkid in no.links) {
					linkData[linkid] = no.links[linkid];
				}
			}
		}

		data.links = Object.values(linkData);

		return data;
	}

	loadNodes(data) {
		const nodatas = data.nodes;
		const addedNodes = [];
		for (const nodata of nodatas) {
			const node = this.loadNode(nodata);
			if (node) {
				addedNodes.push(node);
			}
		}
		this.loadLinks(data.links);
		return addedNodes;
	}

	loadLinks(linkData) {
		for (const link of linkData) {
			const a = this.pins[link[0]];
			const b = this.pins[link[1]];
			if (a && b) {
				a.linkTo(b);
			}
		}
	}

	loadNode(nodata) {
		const type = this.env.nodeTypeDict[nodata.type];
		const cat = type.getCategory();
		if (this.activeCategories.has(cat)) {
			const node = this.createNode(type, nodata);
			node.load(nodata);
			return node;
		} else {
			console.log("Cannot load node of type '" + nodata.type + "' because the category '" + cat + "' is not active!");
		}
	}

	createNode(type, data = undefined) {
		const node = new type(data);
		node.board = this;
		node.createNodeDiv();
		this.addNode(node);
		return node;
	}

	addNode(node) {
		node.board = this;
		this.containerDiv.append(node.containerDiv);
		this.nodes[node.nodeid] = node;
		for (const pinid in node.inpins) {
			const pin = node.inpins[pinid];
			this.pins[pin.pinid] = pin;
		}
		for (const pinid in node.outpins) {
			const pin = node.outpins[pinid];
			this.pins[pin.pinid] = pin;
		}
	}

	removeNode(node) {
		node.unlinkAllPins();
		node.removed();
		this.deselectNode(node);
		for (const pinid in node.inpins) {
			const pin = node.inpins[pinid];
			delete this.pins[pin.pinid];
		}
		for (const pinid in node.outpins) {
			const pin = node.outpins[pinid];
			delete this.pins[pin.pinid];
		}
		node.containerDiv.remove();
		delete this.nodes[node.nodeid];
	}

	shaderClock() {
		for (const nodeid in this.activeGLContexts) {
			const info = this.activeGLContexts[nodeid];
			const timel = info.uniforms["time"];
			let changed = false;
			if (timel) {
				changed = true;
				const time = (currentTimeMillis() / 1000.0) % 8192;
				const x = info.context.uniform1f(timel.location, time);
			}

			if (changed) {
				info.redraw();
			}
		}
	}

	goToNodes(nodes) {
		const screenDims = new NPoint(this.boardDiv.clientWidth, this.boardDiv.clientHeight);
		const bounds = getGroupBounds(nodes);
		this.zoom = Math.max(screenDims.dividep(bounds.max.subtractp(bounds.min)).min() * 0.9, 0.224);
		this.zoomCounter = -Math.log(this.zoom) / Math.log(1.0075);
		this.displayOffset = getGroupCenter(nodes).multiply1(-this.zoom).addp(screenDims.divide1(2));
		this.redraw();
	}
}