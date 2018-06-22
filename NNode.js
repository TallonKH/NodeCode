// CLASSES
//	node			: 	node parent div
//	nodepart	:		a div within a node

// ATTRIBUTES
//	data-nodeid			:		holds id of a div's respective node
//	data-ovrdclick	:		if div should override click functionality (select/drag)
//	data-ovrdkeys		:		if div should override keyboard functionality

class NNode {
	constructor(data = null) {
		this.startData = data;
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

		this.nodeid = data ? (data.id) : (~~(Math.random() * 8388607)) // generate random int as ID
		this.inpins = {}; // name : pin
		this.inpinOrder = [];
		this.outpins = {};
		this.outpinOrder = [];

		this.pinlist = [];
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

	remove() {
		this.board.removeNode(this);
	}

	select() {
		return this.board.selectNode(this);
	}

	deselect() {
		return this.board.deselectNode(this);
	}

	unlinkAllInpins() {
		for (const pin in this.inpins) {
			this.inpins[pin].unlinkAll();
		}
	}

	unlinkAllOutpins() {
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
		if(this.startData){
			pin.pinid = this.startData.ipids[this.inpinOrder.length];
		}else{
			pin.pinid = ~~(Math.random() * 8388607);
		}
		pin.node = this;
		pin.side = false;
		pin.setTypes(true, ...pin.types);
		this.inpins[pin.name] = pin;
		this.inpinOrder.push(pin.name);
		this.board.pins[pin.pinid] = pin;
		this.pinlist.push(pin);

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

		const pinfoDiv = document.createElement("div");
		pinfoDiv.className = "nodepart pinfo " + (this.side ? "outpinfo" : "inpinfo");
		pinfoDiv.setAttribute("data-pinid", this.pinid);
		this.ipcEditDiv.append(pinfoDiv);

		if (pin.type && pin.type.edit) {
			const node = this;
			const pedit = pin.type.edit(pin);
			pedit.onfocus = function(e) {
				node.inPinfosDiv.setAttribute("opened", true);
			}
			pedit.onblur = function(e) {
				node.inPinfosDiv.removeAttribute("opened");
			}
			pinfoDiv.append(pedit);
			pin.editDiv = pedit;
		}
	}

	addOutPin(pin) {
		if (this.outpins[pin.name]) {
			console.log("An outpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		if(this.startData){
			pin.pinid = this.startData.opids[this.outpinOrder.length];
		}else{
			pin.pinid = ~~(Math.random() * 8388607);
		}
		pin.node = this;
		pin.side = true;
		pin.setTypes(true, ...pin.types);
		this.outpins[pin.name] = pin;
		this.outpinOrder.push(pin.name);
		this.board.pins[pin.pinid] = pin;
		this.pinlist.push(pin);

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
		this.position = this.position.round(2);
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

	save(nodeids, pinids) {
		const node = this;
		const data = {
			"type": this.constructor.getName(),
			"id": idRepl(nodeids, this.nodeid),
			"ipids": this.inpinOrder.map(x => idRepl(pinids, node.inpins[x].pinid)),
			"opids": this.outpinOrder.map(x => idRepl(pinids, node.outpins[x].pinid)),
			"x": this.position.x,
			"y": this.position.y
		};

		const inLinks = {};
		const defVals = {};
		for (const inni in this.inpinOrder) {
			const pin = node.inpins[this.inpinOrder[inni]];
			if(pin.linkNum){
				inLinks[inni] = Object.keys(pin.links).map(id => idRepl(pinids, id));
			}
			console.log(pin.defaultVal);
			console.log(pin.defaultDefaultVal);
			if (pin.defaultVal != pin.defaultDefaultVal) {
				defVals[inni] = pin.defaultVal;
			}
		}
		if(Object.keys(inLinks).length){
			data["links"] = inLinks
		}
		if (Object.keys(defVals).length) {
			data["defV"] = defVals;
		}
		return data;
	}

	load(data) {
		this.nodeid = data.id;
		this.applyPinIDs(data);
		this.loadDefVals(data);
		this.position = new NPoint(data.x, data.y);
		this.updatePosition();
	}

	// override pin default values with those from saved node data
	// assume existing pins are in same order as data
	loadDefVals(data) {
		const defVals = data["defV"];

		if (!defVals) {
			return false;
		}

		for (const index in defVals) {
			try {
				this.inpins[this.inpinOrder[index]].setDefaultVal(defVals[index], false);
			} catch (e) {
				throw e;
			}
		}
	}

	// override pin ID's with ID's from saved node data
	// assume existing pins are in same order as data
	applyPinIDs(data) {
		for (let i = 0; i < this.inpinOrder.length; i++) {
			this.inpins[this.inpinOrder[i]].pinid = data.ipids[i];
		}
		for (let i = 0; i < this.outpinOrder.length; i++) {
			this.outpins[this.outpinOrder[i]].pinid = data.opids[i];
		}
	}

	static getName() {
		return "Unknode";
	}

	makeContextMenu(event) {
		const node = this;
		const brd = this.board;
		const menu = new NMenu(this.board, event);
		menu.setHeader(this.constructor.getName() + " Node" + (this.selected ? " (selected)" : ""));

		let op;

		op = new NMenuOption("Details");
		op.action = function(e) {
			brd.applyMenu(node.makeDetailsMenu(event));
			return true;
		}
		menu.addOption(op);

		op = new NMenuOption("Copy");
		op.action = function(e) {
			console.log(node.save({},{}));
			return true;
		}
		menu.addOption(op);

		let hasInLinks = false;
		let hasOutLinks = false;
		for (const pinid in this.inpins) {
			if (this.inpins[pinid].linkNum) {
				hasInLinks = true;
				break;
			}
		}

		for (const pinid in this.outpins) {
			if (this.outpins[pinid].linkNum) {
				hasOutLinks = true;
				break;
			}
		}

		if (hasInLinks) {
			op = new NMenuOption("Unlink All Inputs");
			op.action = function(e) {
				// TODO 4DD 4N 4CT1ON H3R3
				node.unlinkAllInpins();
			}
			menu.addOption(op);
		}
		if (hasOutLinks) {
			op = new NMenuOption("Unlink All Outputs");
			op.action = function(e) {
				// TODO 4DD 4N 4CT1ON H3R3
				node.unlinkAllOutpins();
			}
			menu.addOption(op);
		}

		if (hasInLinks && hasOutLinks) {
			op = new NMenuOption("Unlink All");
			op.action = function(e) {
				// TODO 4DD 4N 4CT1ON H3R3
				node.unlinkAll();
			}
			menu.addOption(op);
		}

		if (hasInLinks) {
			op = new NMenuOption("Select Parent Nodes");
			op.action = function(e) {
				for (const pinid in node.inpins) {
					const pin = node.inpins[pinid];
					for (const link in pin.links) {
						// 4DD 4N 4CT1ON H3R3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		if (hasOutLinks) {
			op = new NMenuOption("Select Child Nodes");
			op.action = function(e) {
				for (const pinid in node.outpins) {
					const pin = node.outpins[pinid];
					for (const link in pin.links) {
						// 4DD 4N 4CT1ON H3R3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		if (hasInLinks && hasOutLinks) {
			op = new NMenuOption("Select Linked Nodes");
			op.action = function(e) {
				for (const pin of node.pinlist) {
					for (const link in pin.links) {
						//4DD 4N 4CT1ON H3R3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		op = new NMenuOption("Delete Node");
		op.action = function(e) {
			//4DD 4N 4CT1ON H3R3
			node.remove();
		}
		menu.addOption(op);

		return menu;
	}

	makeDetailsMenu(event) {
		const node = this;
		const brd = this.board;
		const menu = new NMenu(this.board, event);
		menu.setHeader("Node Details");

		menu.addOption(new NMenuOption("<div class=mih>Type:</div> \"" + this.constructor.getName() + "\""));
		menu.addOption(new NMenuOption("<div class=mih>Node ID:</div> " + this.nodeid));
		menu.addOption(new NMenuOption("<div class=mih>Position:</div> " + this.position.round(2).toString()));

		return menu;
	}

}

makeMultiNodeMenu = function(brd, event, nodes) {
	const node = this;
	const menu = new NMenu(brd, event);
	menu.setHeader("Multiple Nodes (" + nodes.length + ")");

	let op;

	op = new NMenuOption("Details");
	op.action = function(e) {
		brd.applyMenu(makeMultiNodeDetailsMenu(brd, event, nodes));
		return true;
	}
	menu.addOption(op);

	op = new NMenuOption("Delete All");
	op.action = function(e) {
		// TODO 4DD 4N 4CT1ON H3R3
		for (const node of nodes) {
			node.remove();
		}
	}
	menu.addOption(op);

	let hasLinks = false;
	for (const node of nodes) {
		for (const pin of node.pinlist) {
			if (pin.linkNum) {
				hasLinks = true;
			}
			break;
		}
		if (hasLinks) {
			break;
		}
	}
	if (hasLinks) {
		op = new NMenuOption("Unlink All");
		op.action = function(e) {
			// TODO 4DD 4N 4CT1ON H3R3
			for (const node of nodes) {
				node.unlinkAllPins();
			}
		}
		menu.addOption(op);

		op = new NMenuOption("Detach Group");
		op.action = function(e) {
			// TODO 4DD 4N 4CT1ON H3R3
			for (const node of nodes) {
				for (const pin of node.pinlist) {
					for (const linkid in pin.links) {
						const other = pin.links[linkid];
						if (!other.node.selected) {
							pin.unlink(other);
						}
					}
				}
			}
		}
		menu.addOption(op);
	}

	return menu;
}

makeMultiNodeDetailsMenu = function(brd, event, nodes) {
	const node = this;
	const menu = new NMenu(brd, event);
	menu.setHeader("Group Details");

	const minp = NPoint.min(...nodes.map(x => x.position)).round(2);
	const maxp = NPoint.max(...nodes.map(x => x.position.add2(x.nodeDiv.clientWidth, x.nodeDiv.clientHeight))).round(2);

	menu.addOption(new NMenuOption("<div class=mih>Nodes:</div> " + nodes.length));
	menu.addOption(new NMenuOption("<div class=mih>Bounds:</div> " + minp.toString() + ", " + maxp.toString()));
	menu.addOption(new NMenuOption("<div class=mih>Center:</div> " + minp.addp(maxp).divide1(2)));

	return menu;
}