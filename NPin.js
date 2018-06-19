const reTrailing = /[,._\s]+$/;
const defVals = {
	NObject: null,
	NInteger: 0,
	NDouble: 0.0,
	NBoolean: false,
	NString: ""
};

class NPin {
	constructor(name, ...types) {
		this.pinid = ~~(Math.random() * 8388607) // generate random int as ID
		this.name = name;
		this.types = types;
		this.side; // false = in, true = out
		this.node;
		this.color;
		this.type;
		this.byRef = false;
		this.pinDiv;
		this.defaultVal = (!this.side && types.length == 1) ? types[0].construct() : null;
		this.pinfoDiv;
		this.links = {};
		this.linkNum = 0;
	}

	setTypes(silent, ...types) {
		const prev = {
			"types": this.types,
			"type": this.type,
			"multitype": this.multiTyped,
			"isExec": this.isExec,
			"multicon": this.multiConnective
		};

		this.isExec = types.includes(NExecution);
		if (types.length == 0) {
			types = [NObject];
		}

		this.multiTyped = types.length > 1;
		if (types.length == 1) {
			this.type = types[0];
			this.types = null;
			this.color = types[0].color;
		} else {
			if (this.isExec) {
				console.log("Can't create multi-typed executing pin!");
				return null;
			}
			this.type = null;
			this.types = types;
			this.color = avgHex(...types.map(x => x.color));
		}

		if(this.multiTyped){
			this.multiConnective = this.side;
		}else{
			this.multiConnective = this.side ? this.type.multiOutput : this.type.multiInput;
		}

		const now = {
			"types": this.types,
			"type": this.type,
			"multitype": this.multiTyped,
			"isExec": this.isExec,
			"multicon": this.multiConnective
		};
		if (!silent && (now != prev)) {
			for (const pin in this.links) {
				this.links[pin].linkedChangedType(this, prev, now);
			}
		}

		if (this.pinDiv) {
			this.updateColors();
		}

		return this;
	}

	setIsByRef(silent, r) {
		const prev = this.byRef;
		this.byRef = r;

		if (this.pinDiv) {
			if (r) {
				this.pinDiv.setAttribute("ref", true);
			} else {
				this.pinDiv.removeAttribute("ref");
			}
		}

		if (!silent && (r ^ prev)) {
			for (const pin in this.links) {
				this.links[pin].linkedChangedByRef(this, prev, r);
			}
		}

		return this;
	}

	setDefaultVal(v) {
		this.defaultVal = v;
		return this;
	}

	getValue() {
		return this.node.getValue(this);
	}

	execute() {
		this.node.execute(this);
	}

	// WARNING: must assume pin is linked to exactly 1 other pin
	getSingleLinked() {
		return Object.values(this.links)[0];
	}

	linkTo(otherPin) {
		let a = this;
		let b = otherPin;

		// make sure pins are compatible
		if (a.side) {
			if (!a.canPlugInto(b)) {
				return false;
			}
		} else {
			if (!b.canPlugInto(a)) {
				return false;
			}
		}

		if(a.pinid in b.links){
			console.log("link already exists!");
			return false;
		}

		// remove existing connections if needed
		if (!a.multiConnective) {
			a.unlinkAll();
		}
		if (!b.multiConnective) {
			b.unlinkAll();
		}

		// alert nodes
		a.node.pinLinked(a, b);
		b.node.pinLinked(b, a);

		a.links[b.pinid] = b;
		b.links[a.pinid] = a;
		a.linkNum++;
		b.linkNum++;

		this.node.board.links[a.pinid * b.pinid] = [a, b];
	}

	unlink(otherPin) {
		let a = this;
		let b = otherPin;

		if (b.pinid in a.links) {
			delete a.links[b.pinid];
			delete b.links[a.pinid];
			a.linkNum--;
			b.linkNum--;
			a.node.pinUnlinked(a, b);
			b.node.pinUnlinked(b, a);
			delete this.node.board.links[a.pinid * b.pinid];
		} else {
			console.log("Can't unlink pins " + a.name + " & " + b.name + " because they aren't linked!");
			return false;
		}
	}

	unlinkAll() {
		for (const pin of Object.values(this.links)) {
			this.unlink(pin);
		}
	}

	linkedChangedType(linked, from, to) {
		this.node.linkedPinChangedType(this, linked, from, to);
	}

	linkedChangedByRef(linked, from, to) {
		this.node.linkedPinChangedByRef(this, linked, from, to);
	}

	canPlugInto(otherPin) {
		if (this.side == otherPin.side) {
			return false;
		}

		if (!this.side) {
			console.log("canPlugInto called by an input pin!");
			return false;
		}


		if (this.node == otherPin.node) {
			return false;
		}

		if (otherPin.byRef) {
			if (!this.byRef) {
				return false;
			}
		}

		if (this.multiTyped) {
			if (otherPin.multiTyped) {
				for (const outType of this.types) {
					for (const inType of otherPin.types) {
						if (outType.isA(inType)) {
							return true;
						}
					}
				}
				return false;
			} else {
				for (const outType of this.types) {
					if (outType.isA(otherPin.type)) {
						return true;
					}
				}
				return false;
			}
		} else {
			if (otherPin.multiTyped) {
				for (const inType of otherPin.types) {
					if (this.type.isA(inType)) {
						return true;
					}
				}
				return false;
			} else {
				return this.type.isA(otherPin.type);
			}
		}
	}

	createPinDiv() {
		this.pinDiv = document.createElement("div");
		this.pinDiv.className = this.side ? "inpin pin" : "outpin pin";
		this.pinDiv.setAttribute("data-pinid", this.pinid);
		this.updateColors();
		if (this.byRef) {
			this.pinDiv.setAttribute("ref", this.nodeid);
		}
		return this.pinDiv;
	}

	updateColors() {
		if (this.multiTyped) {
			const colors = this.types.map(x => x.color);
			const end = colors.length - 1;
			const percent = (100.0 / colors.length);
			let args = colors[0] + ", " + colors[0] + " " + percent + "%";
			for (let i = 0; i < end; i++) {
				args += ", " + colors[i] + " " + percent * (i + 1) + "%, " + colors[i + 1] + " " + percent * (i + 1) + "%";
			}
			args += ", " + colors[end] + " " + percent * end + "%";
			this.pinDiv.style.background = "linear-gradient(" + args + ")";
			this.pinDiv.style.border = "2px solid " + this.color;
		} else {
			this.pinDiv.style.background = this.color;
			this.pinDiv.style.border = "2px solid " + darkenHex(this.color, 20);
		}
	}

	createPinfoDiv(name = this.name.replace(reTrailing, "")) {
		this.pinfoDiv = document.createElement("div");
		this.pinfoDiv.className = "nodepart pinfo " + (this.side ? "outpinfo" : "inpinfo");
		this.pinfoDiv.setAttribute("data-pinid", this.pinid);
		if (name) {
			const text = document.createElement("div");
			text.className = "text";
			text.innerHTML = name;
			text.style.color = darkenHex(this.color, 50);
			this.pinfoDiv.append(text);
		}
		return this.pinfoDiv;
	}

	contextMenu(event) {
		const pin = this;
		const brd = this.node.board;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";

		const header = document.createElement("header");
		header.innerHTML = "Pin " + (this.side ? "(output)" : "(input)");
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const miDetails = document.createElement("div");
		miDetails.className = "menuitem";
		miDetails.innerHTML = "Details"
		miDetails.onclick = function(e) {
			brd.applyMenu(pin.detailsMenu(event));
		}
		menu.append(miDetails);

		if (this.linkNum) {
			const miUnlinkAll = document.createElement("div");
			miUnlinkAll.className = "menuitem";
			miUnlinkAll.innerHTML = "Unlink All"
			miUnlinkAll.onclick = function(e) {
				pin.unlinkAll();
				brd.closeMenu();
			}
			menu.append(miUnlinkAll);


			for (const pinid in this.links) {
				const linked = this.links[pinid];

				const mi = document.createElement("div");
				mi.className = "menuitem";
				mi.innerHTML = "Unlink From " + linked.node.constructor.getName() + ":" + linked.name;
				mi.onclick = function(e) {
					pin.unlink(linked);
					brd.closeMenu();
				}
				menu.append(mi);
			}
		}

		return main;
	}

	detailsMenu(event) {
		const pin = this;
		const brd = this.node.board;

		const main = document.createElement("div");
		main.className = "ctxmenu";
		main.style.left = event.clientX + "px";
		main.style.top = event.clientY + "px";

		const header = document.createElement("header");
		header.innerHTML = "Pin Details";
		main.append(header);

		const menu = document.createElement("div");
		menu.className = "menu";
		main.append(menu);

		const miName = document.createElement("div");
		miName.className = "menuitem";
		miName.innerHTML = "<div class=mih>Name:</div> \"" + this.name + "\"";
		menu.append(miName);

		const miMType = document.createElement("div");
		miMType.className = "menuitem";
		miMType.innerHTML = "<div class=mih>Multityped:</div> " + (this.multiTyped ? "Yes" : "No");
		menu.append(miMType);

		const miRef = document.createElement("div");
		miRef.className = "menuitem";
		miRef.innerHTML = "<div class=mih>By Reference:</div> " + (this.byRef ? "Yes" : "No");
		menu.append(miRef);

		if (this.multiTyped) {
			const miTypes = document.createElement("div");
			miTypes.className = "menuitem";
			miTypes.innerHTML = "<div class=mih>Types:</div> " + this.types.map(x => x.name).join(", ");
			menu.append(miTypes);
		} else {
			const miType = document.createElement("div");
			miType.className = "menuitem";
			miType.innerHTML = "<div class=mih>Type:</div> " + this.type.name;
			menu.append(miType);
		}

		if (this.defaultVal) {
			const miDefVal = document.createElement("div");
			miDefVal.className = "menuitem";
			miDefVal.innerHTML = "<div class=mih>Default Value:</div> " + shallowStringify(this.defaultVal, 1, 0);
			menu.append(miDefVal);
		}

		const miID = document.createElement("div");
		miID.className = "menuitem";
		miID.innerHTML = "<div class=mih>Pin ID:</div> " + this.pinid;
		menu.append(miID);

		const miLinks = document.createElement("div");
		miLinks.className = "menuitem";
		miLinks.innerHTML = "<div class=mih>Links (" + this.linkNum + "): </div> " + Object.values(this.links).map(x => x.node.constructor.getName() + ":" + x.name).join(", ");
		menu.append(miLinks);

		return main;
	}
}

PinChange = {
	TYPE: 0,
	REF: 1
}