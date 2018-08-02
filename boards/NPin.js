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
		this.pinid; // generate random int as ID
		this.name = name;
		this.types = types;
		this.side; // false = in, true = out
		this.node;
		this.color;
		this.type;
		this.byRef = false;
		this.pinDiv;
		this.defaultVal = (!this.side && types.length == 1) ? types[0].construct() : {};
		this.defaultDefaultVal = Object.assign({}, this.defaultVal);
		this.customEditor;
		this.pinfoDiv;
		this.editDiv;
		this.links = {}; // pinid : pin
		this.linkNum = 0;
		this.setUp = false;
	}

	getTypes() {
		return this.multiTyped ? this.types : [this.type];
	}

	toString() {
		return this.pinid.toString();
	}

	setTypes(silent, ...types) {
		if(this.setUp){
			console.log(types);
			console.log(this.getTypes());
			if (types.sort().join("") == this.getTypes().sort().join("")) {
				return this;
			}
		}

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

		if (this.multiTyped) {
			this.multiConnective = this.side;
		} else {
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

	setDefaultVal(v, defdef = null) {
		Object.assign(this.defaultVal, v);
		if (defdef) { // should also set the default default value?
			Object.assign(this.defaultDefaultVal, v);
		}
		if (this.editDiv) {
			this.type.changeVal(this.editDiv, v);
		}
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

	linkTo(otherPin, silent = false) {
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

		if (a.pinid in b.links) {
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

		a.links[b.pinid] = b;
		b.links[a.pinid] = a;
		a.linkNum++;
		b.linkNum++;
		this.node.board.links[a.pinid + b.pinid] = [a, b];

		// alert nodes
		if (!silent) {
			a.node.pinLinked(a, b);
			b.node.pinLinked(b, a);
		}

		this.node.board.redraw();

		return true;
	}

	unlink(otherPin, silent = false) {
		let a = this;
		let b = otherPin;

		if (b.pinid in a.links) {
			delete a.links[b.pinid];
			delete b.links[a.pinid];
			a.linkNum--;
			b.linkNum--;
			delete this.node.board.links[a.pinid + b.pinid];
			if (!silent) {
				a.node.pinUnlinked(a, b);
				b.node.pinUnlinked(b, a);
			}
		} else {
			console.log("Can't unlink pins " + a.name + " & " + b.name + " because they aren't linked!");
			return false;
		}
		this.node.board.redraw();
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

	getReturnType() {
		return this.node.getReturnType(this);
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

	areOutTypesCompatible(...inTypes) {
		if (this.multiTyped) {
			for (const type of this.types) {
				for (const inType of inTypes) {
					if (type.isA(inType)) {
						return true;
					}
				}
			}
		} else {
			for (const inType of inTypes) {
				if (this.type.isA(inType)) {
					return true;
				}
			}
		}
		return false;
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

	makeContextMenu(pos) {
		const pin = this;
		const brd = this.node.board;
		const menu = new NCtxMenu(this.node.board, pos);
		menu.setHeader("Pin " + (this.side ? "(output)" : "(input)"));

		let op;

		op = new NCtxMenuOption("Details");
		op.action = function(p) {
			brd.applyMenu(pin.makeDetailsMenu(pos));
			return true;
		}
		menu.addOption(op);

		if (this.linkNum) {
			op = new NCtxMenuOption("Unlink All");
			op.action = function(p) {
				brd.addAction(new ActUnlinkPin(brd, pin));
				pin.unlinkAll();
			}
			menu.addOption(op);

			for (const pinid in this.links) {
				const linked = this.links[pinid];
				op = new NCtxMenuOption("Unlink From " + linked.node.constructor.getName() + ":" + linked.name + " (" + linked.pinid + ")");
				op.action = function(p) {
					brd.addAction(new ActRemoveLink(brd, pin, linked));
					pin.unlink(linked);
				}
				menu.addOption(op);
			}
		}

		return menu;
	}

	makeDetailsMenu(pos) {
		const pin = this;
		const brd = this.node.board;
		const menu = new NCtxMenu(this.node.board, pos);
		menu.setHeader("Pin Details");

		menu.addOption(new NCtxMenuOption("<div class=mih>Name:</div> \"" + this.name + "\""));
		menu.addOption(new NCtxMenuOption("<div class=mih>Multityped:</div> " + (this.multiTyped ? "Yes" : "No")));
		menu.addOption(new NCtxMenuOption("<div class=mih>By Reference:</div> " + (this.byRef ? "Yes" : "No")));

		if (this.multiTyped) {
			menu.addOption(new NCtxMenuOption("<div class=mih>Types:</div> " + this.types.map(x => x.name).join(", ")));
		} else {
			menu.addOption(new NCtxMenuOption("<div class=mih>Type:</div> " + this.type.name));
		}

		if (this.defaultVal) {
			menu.addOption(new NCtxMenuOption("<div class=mih>Default Value:</div> " + shallowStringify(this.defaultVal, 1, 0)));
			menu.addOption(new NCtxMenuOption("<div class=mih>Default Default Value:</div> " + shallowStringify(this.defaultDefaultVal, 1, 0)));
		}

		menu.addOption(new NCtxMenuOption("<div class=mih>Pin ID:</div> " + this.pinid));
		menu.addOption(new NCtxMenuOption("<div class=mih>Links (" + this.linkNum + "): </div> " + Object.values(this.links).map(x => x.node.constructor.getName() + ":" + x.name).join(", ")));

		return menu;
	}
}

PinChange = {
	TYPE: 0,
	REF: 1
}