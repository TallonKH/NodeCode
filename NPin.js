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
		this.defaultVal = (types.length == 1) ? types[0].construct() : null;
		this.pinfoDiv;
		this.links = {};
		this.linkNum = 0;
	}

	setTypes(silent, ...types) {
		const prev = {"types":this.types, "type":this.type, "multitype":this.multiTyped, "isExec":this.isExec, "multicon":this.multiConnective};

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

		this.multiConnective = this.side ^ this.isExec;

		const now = {"types":this.types, "type":this.type, "multitype":this.multiTyped, "isExec":this.isExec, "multicon":this.multiConnective};
		if(!silent && (now != prev)){
			for(const pin in this.links){
				this.links[pin].linkedChangedType(this, prev, now);
			}
		}

		if(this.pinDiv){
			this.updateColors();
		}

		return this;
	}

	setIsByRef(silent,r) {
		const prev = this.byRef;
		this.byRef = r;

		if (this.pinDiv) {
			if (r) {
				this.pinDiv.setAttribute("ref", true);
			} else {
				this.pinDiv.removeAttribute("ref");
			}
		}

		if(!silent && (r ^ prev)){
			for(const pin in this.links){
				this.links[pin].linkedChangedByRef(this, prev, r);
			}
		}

		return this;
	}

	setDefaultVal(v) {
		this.defaultVal = v;
		return this;
	}

	getValue(){
		return this.node.getValue(this);
	}

	execute(){
		this.node.execute(this);
	}

	// WARNING: must assume pin is linked to exactly 1 other pin
	getSingleLinked(){
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
			a.node.pinUnlinked(a,b);
			b.node.pinUnlinked(b,a);
			delete this.node.board.links[a.pinid * b.pinid];
		} else {
			console.log("Can't unlink pins " + a.name + " & " + b.name + " because they aren't linked!");
			return false;
		}
	}

	unlinkAll() {
		for (const id in this.links) {
			this.unlink(this.links[id]);
		}
	}

	linkedChangedType(linked, from, to){
		this.node.linkedPinChangedType(this, linked, from, to);
	}

	linkedChangedByRef(linked, from, to){
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

	updateColors(){
		if (this.multiTyped) {
			const colors = this.types.map(x => x.color);
			const end = colors.length - 1;
			const percent = (100.0 / colors.length);
			let args = colors[0] + ", " + colors[0] + " " + percent + "%";
			for (let i = 0; i < end; i++) {
				args += ", " + colors[i] + " " + percent*(i+1) + "%, " + colors[i + 1] + " " + percent*(i+1) + "%";
			}
			args += ", " + colors[end] + " " + percent * end + "%";
			this.pinDiv.style.background = "linear-gradient(" + args + ")";
			this.pinDiv.style.border = "2px solid " + this.color;
		} else {
			this.pinDiv.style.background = this.color;
			this.pinDiv.style.border = "2px solid " + darkenHex(this.color,20);
		}
	}

	createPinfoDiv(name = this.name.replace(reTrailing, "")) {
		this.pinfoDiv = document.createElement("div");
		this.pinfoDiv.className = "pinfo " + (this.side ? "outpinfo" : "inpinfo");
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
}

PinChange = {
	TYPE : 0,
	REF : 1
}