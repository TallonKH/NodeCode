// CLASSES
//	node			: 	node parent div
//	nodepart	:		a div within a node

// ATTRIBUTES
//	data-nodeid			:		holds id of a div's respective node
//	data-ovrdclick	:		if div should override click functionality (select/drag)
//	data-ovrdkeys		:		if div should override keyboard functionality

class NNode {
	constructor() {
		this.resizable = false;

		this.board = null;
		this.containerDiv = null;
		this.nodeDiv = null;
		this.bodyDiv = null;
		this.centerDiv = null;
		this.headerDiv = null;
		this.inPinsDiv = null;
		this.inPinfosDiv = null;
		this.ipcNameDiv = null; // ipc = inpinfo column
		this.ipcEditDiv = null;
		this.outPinsDiv = null;
		this.outPinfosDiv = null;
		this.opcNameDiv = null; // opc = outpinfo column

		this.selected = false;
		this.position = new NPoint(0, 0);
		this.offset = new NPoint(0, 0);
		this.displayPosition = new NPoint(0, 0);

		this.nodeid = ~~(Math.random() * 8388607) // generate random int as ID
		this.inpins = {};
		this.inpinOrder = [];
		this.outpins = {};
		this.outpinOrder = [];
	}

	makeResizable(minWidth = 75, minHeight = 22, maxWidth = 1000, maxHeight = 750) {
		if (!this.resizable) {
			this.resizable = true
			$(this.nodeDiv).resizable({
				handles: "se",
				maxHeight: maxHeight,
				maxWidth: maxWidth,
				minHeight: minHeight,
				minWidth: minWidth
			});
			this.nodeDiv.className = this.nodeDiv.className + " resizable"
		}
	}

	createNodeDiv() {
		this.containerDiv = document.createElement("div");
		this.containerDiv.className = "container";

		this.nodeDiv = document.createElement("div");
		this.nodeDiv.className = "node nodepart";
		this.nodeDiv.setAttribute("data-nodeid", this.nodeid);

		this.bodyDiv = document.createElement("div");
		this.bodyDiv.className = "nodepart body";
		this.bodyDiv.setAttribute("data-nodeid", this.nodeid);

		this.nodeDiv.append(this.bodyDiv);
		this.containerDiv.append(this.nodeDiv);

		return this.containerDiv;
	}

	destroy() {
		this.board.destroyNode(this);
	}

	unlinkAllInpins(){
		for (const pin in this.inpins) {
			this.inpins[pin].unlinkAll();
		}
	}

	unlinkAllOutpins(){
		for (const pin in this.outpins) {
			this.outpins[pin].unlinkAll();
		}
	}

	unlinkAllPins() {
		this.unlinkAllInpins();
		this.unlinkAllOutpins();
	}

	addHeader(text = this.constructor.getName()) {
		this.headerDiv = document.createElement("header");
		this.headerDiv.className = "nodepart";
		this.headerDiv.setAttribute("data-nodeid", this.nodeid);
		this.headerDiv.innerHTML = text;
		this.nodeDiv.append(this.headerDiv);
		this.updateDims();
	}

	addCenter(text = null) {
		this.centerDiv = document.createElement("div");
		this.centerDiv.className = "nodepart center";
		this.centerDiv.setAttribute("data-nodeid", this.nodeid);
		if (text) {
			const txt = document.createElement("div");
			txt.className = "nodepart text";
			txt.setAttribute("data-nodeid", this.nodeid);
			txt.innerHTML = text;
			this.centerDiv.append(txt);
		}
		this.bodyDiv.append(this.centerDiv);
	}

	addInPin(pin) {
		if (this.inpins[pin.name]) {
			console.log("A inpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		pin.node = this;
		pin.side = false;
		pin.setTypes(true, ...pin.types);
		this.inpins[pin.name] = pin;
		this.inpinOrder.push(pin.name);
		this.board.pins[pin.pinid] = pin;

		this.updateDims();

		if (this.inPinsDiv == null) {
			this.inPinsDiv = document.createElement("div");
			this.inPinsDiv.className = "inpins pins"
			this.inPinsDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinsDiv);

			this.inPinfosDiv = document.createElement("div");
			this.inPinfosDiv.className = "inpinfos pinfos nodepart"
			this.inPinfosDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinfosDiv);

			this.ipcNameDiv = document.createElement("div");
			this.ipcNameDiv.className = "inpinfocol pinfocol";
			this.ipcNameDiv.setAttribute("data-nodeid", this.nodeid);
			this.inPinfosDiv.append(this.ipcNameDiv);

			this.ipcEditDiv = document.createElement("div");
			this.ipcEditDiv.className = "inpinfocol pinfocol";
			this.ipcEditDiv.setAttribute("data-nodeid", this.nodeid);
			this.inPinfosDiv.append(this.ipcEditDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.inPinsDiv.append(pin.createPinDiv());

		const pinfo = pin.createPinfoDiv();
		pinfo.setAttribute("data-nodeid", this.nodeid);
		this.ipcNameDiv.append(pinfo);

		if (pin.type && pin.type.edit) {
			const pinfoDiv = document.createElement("div");
			pinfoDiv.className = "nodepart pinfo " + (this.side ? "outpinfo" : "inpinfo");
			pinfoDiv.setAttribute("data-pinid", this.pinid);
			this.ipcEditDiv.append(pinfoDiv);

			const node = this;
			const pedit = pin.type.edit(pin);
			pedit.onfocus = function(e) {
				node.inPinfosDiv.setAttribute("opened", true);
			}
			pedit.onblur = function(e) {
				node.inPinfosDiv.removeAttribute("opened");
			}
			pinfoDiv.append(pedit);
		}
	}

	addOutPin(pin) {
		if (this.outpins[pin.name]) {
			console.log("An outpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		pin.node = this;
		pin.side = true;
		pin.setTypes(true, ...pin.types);
		this.outpins[pin.name] = pin;
		this.outpinOrder.push(pin.name);
		this.board.pins[pin.pinid] = pin;

		this.updateDims();

		if (this.outPinsDiv == null) {
			this.outPinsDiv = document.createElement("div");
			this.outPinsDiv.className = "outpins pins"
			this.outPinsDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinsDiv);

			this.outPinfosDiv = document.createElement("div");
			this.outPinfosDiv.className = "outpinfos pinfos nodepart"
			this.outPinfosDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinfosDiv);

			this.opcNameDiv = document.createElement("div");
			this.opcNameDiv.className = "outpinfocol pinfocol";
			this.opcNameDiv.setAttribute("data-nodeid", this.nodeid);
			this.outPinfosDiv.append(this.opcNameDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.outPinsDiv.append(pin.createPinDiv());

		const pinfo = pin.createPinfoDiv();
		pinfo.setAttribute("data-nodeid", this.nodeid);
		this.opcNameDiv.append(pinfo);
	}

	move(delta) {
		this.position = this.position.addp(delta);
		this.updatePosition();
	}

	updateDims() {
		//HEIGHT
		// pins
		const hp = Math.max(this.inpinOrder.length, this.outpinOrder.length) * 24;
		// center
		if (this.centerDiv) {
			var hc = this.centerDiv.scrollHeight;
			var hc2 = 0;
			for (const child of this.centerDiv.children) {
				hc2 += child.scrollHeight;
			}
		}
		// header
		let h = Math.max(hp, hc, hc2);
		if (this.headerDiv) {
			h += 22;
		}

		this.nodeDiv.style.height = h + "px";

		//WIDTH
		let w = 0;
		// center
		if (this.centerDiv) {
			w = this.centerDiv.scrollWidth;
		}
		// header
		if (this.headerDiv) {
			w = Math.max(w, this.headerDiv.scrollWidth);
		}
		// pinfo + inputs
		if (this.inPinfosDiv) {
			let lastPinfo = 0;
			for (const div of this.inPinfosDiv.children) {
				if (div.nodeNode == "INPUT") {
					w = Math.max(w, div.scrollWidth);
				} else {

				}
			}
		}
		if (this.outPinfosDiv) {
			for (const div of this.outPinfosDiv.children) {
				w = Math.max(w, div.scrollWidth);
			}
		}
		this.nodeDiv.style.minWidth = w + "px";
	}

	setPosition(pos) {
		this.position = pos;
		this.updatePosition()
	}

	updatePosition() {
		this.offset = new NPoint(this.containerDiv.offsetLeft, this.containerDiv.offsetTop);
		// this.offset = new NPoint(this.containerDiv.getBoundingClientRect().left, this.containerDiv.getBoundingClientRect().top);
		this.displayPosition = this.position.subtractp(this.offset);
		this.nodeDiv.style.left = this.displayPosition.x + "px";
		this.nodeDiv.style.top = this.displayPosition.y + "px";
		this.board.redraw();
	}

	pinLinked(selfPin, otherPin) {}

	pinUnlinked(selfPin, otherPin) {}

	linkedPinChangedType(thisPin, changedPin, from, to) {}

	linkedPinChangedByRef(thisPin, changedPin, from, to) {}

	returnValRequested(pin) {}

	inputExecuted(pin) {}

	getValue(pin) {
		if (pin.isExec) {
			console.log("Can't get a return value from an exec pin! (" + pin.name + ")");
			return null;
		}
		if (pin.side) { // if called on an output, run node logic
			return this.returnValRequested(pin);
		} else { // if called on an input, get value from the connected output
			if (pin.linkNum > 0) {
				return pin.getSingleLinked().getValue();
			} else { // has no connected output...
				// console.log("Returning default value for pin \'" + pin.name + "\'");
				return pin.defaultVal;
			}
		}
	}

	// shortcut to get input by name
	inputN(inpinName) {
		return this.getValue(this.inpins[inpinName]);
	}

	// shortcut to get input by index
	inputI(i) {
		return this.getValue(this.inpinOrder[i]);
	}

	// shortcut to execute by name
	execN(outpinName) {
		this.execute(this.outpins[outpinName]);
	}

	execute(pin) {
		if (!pin.isExec) {
			console.log("Can't execute a non-exec pin! (" + pin.name + ")");
			return null;
		}

		if (pin.side) { // execute the connected input
			if (pin.linkNum > 0) {
				pin.getSingleLinked().execute();
			} else {
				// nothing to execute! reached end of branch
			}
		} else { // execute this input
			this.board.execIterCount++;
			if (this.board.execIterCount >= this.board.env.maxExecIterations) {
				console.log("REACHED MAXIMUM EXECUTION ITERATIONS - STOPPING");
				return null;
			}
			this.inputExecuted(pin);
		}
	}

	// returns if node is within points
	within(a, b) {
		const min = this.displayPosition;
		const max = new NPoint(min.x + this.nodeDiv.clientWidth, min.y + this.nodeDiv.clientHeight);
		return (min.x >= a.x && max.x <= b.x && min.y >= a.y && max.y <= b.y);
	}

	save() {
		return {
			"id": this.nodeid,
			"x": this.position.x,
			"y": this.position.y
		};
	}

	load(data) {
		this.nodeid = data.id;
		this.position = new NPoint(data.x, data.y);
		updatePosition();
	}

	static getName() {
		return "Unknode";
	}

	contextMenu(event) {
		const node = this;
		const brd = this.board;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";

		const header = document.createElement("header");
		header.innerHTML = this.constructor.getName() + " Node";
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const miDetails = document.createElement("div");
		miDetails.className = "menuitem";
		miDetails.innerHTML = "Details"
		miDetails.onclick = function(e) {
			brd.applyMenu(node.detailsMenu(event));
		}
		menu.append(miDetails);

		let hasInLinks = false;
		let hasOutLinks = false;
		for (const pinid in this.inpins) {
			if (this.inpins[pinid].linkNum) {
				hasInLinks = true;
				const miUnlinkAllIns = document.createElement("div");
				miUnlinkAllIns.className = "menuitem";
				miUnlinkAllIns.innerHTML = "Unlink All Inputs"
				miUnlinkAllIns.onclick = function(e) {
					node.unlinkAllInpins();
					brd.closeMenu();
				}
				menu.append(miUnlinkAllIns);
				break;
			}
		}
		for (const pinid in this.outpins) {
			if (this.outpins[pinid].linkNum) {
				hasOutLinks = true;
				const miUnlinkAllOuts = document.createElement("div");
				miUnlinkAllOuts.className = "menuitem";
				miUnlinkAllOuts.innerHTML = "Unlink All Outputs"
				miUnlinkAllOuts.onclick = function(e) {
					node.unlinkAllOutpins();
					brd.closeMenu();
				}
				menu.append(miUnlinkAllOuts);
				break;
			}
		}
		if (hasInLinks && hasOutLinks) {
			const miUnlinkAllOuts = document.createElement("div");
			miUnlinkAllOuts.className = "menuitem";
			miUnlinkAllOuts.innerHTML = "Unlink All"
			miUnlinkAllOuts.onclick = function(e) {
				node.unlinkAllPins();
				brd.closeMenu();
			}
			menu.append(miUnlinkAllOuts);
		}

		return main;
	}

	detailsMenu(event) {
		const node = this;
		const brd = this.board;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";

		const header = document.createElement("header");
		header.innerHTML = "Node Details";
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const miName = document.createElement("div");
		miName.className = "menuitem";
		miName.innerHTML = "<div class=mih>Name:</div> \"" + this.constructor.getName() + "\"";
		menu.append(miName);

		const miID = document.createElement("div");
		miID.className = "menuitem";
		miID.innerHTML = "<div class=mih>Node ID:</div> " + this.nodeid;
		menu.append(miID);

		const miPos = document.createElement("div");
		miPos.className = "menuitem";
		miPos.innerHTML = "<div class=mih>Position:</div> (" + this.position.x + ", " + this.position.y+ ")";
		menu.append(miPos);

		return main;
	}
}