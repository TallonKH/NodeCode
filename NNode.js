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
		this.outPinsDiv = null;
		this.outPinfosDiv = null;

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
		this.containerDiv = document.createElement("span");
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
			this.inPinfosDiv.className = "inpinfos pinfos"
			this.inPinfosDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinfosDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.inPinsDiv.append(pin.createPinDiv());
		this.inPinfosDiv.append(pin.createPinfoDiv());
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
			this.outPinfosDiv.className = "outpinfos pinfos"
			this.outPinfosDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinfosDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.outPinsDiv.append(pin.createPinDiv());
		this.outPinfosDiv.append(pin.createPinfoDiv());
	}

	move(delta) {
		this.position = this.position.addp(delta);
		this.updatePosition();
	}

	updateDims() {
		//HEIGHT
		// pins
		const hp = Math.max(this.inpinOrder.length, this.outpinOrder.length) * 20;
		// center
		if (this.centerDiv) {
			var hc = this.centerDiv.scrollHeight;
			for (const child of this.centerDiv.children) {
				hc = Math.max(hc, child.scrollHeight);
			}
		}
		// header
		let h = Math.max(hp, hc);
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
		// pinfo
		if (this.inPinfosDiv) {
			for (const div of this.inPinfosDiv.children) {
				w = Math.max(w, div.scrollWidth);
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

	static getName() {
		return "Unknode";
	}
}

class StringNode extends NNode {
	constructor() {
		super();
		this.val = NString.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addHeader("Variable (String)");
		this.addCenter("“”");
		this.addOutPin(new NPin("Value", NString).setIsByRef(false, true));
		return this.containerDiv;
	}

	returnValRequested(pin) {
		return this.val;
	}

	static getName() {
		return "String";
	}

	static getTags() {
		return ["\"\"", "\'\'"];
	}
}

class IntegerNode extends NNode {
	constructor() {
		super();
		this.val = NInteger.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Variable (Int)");
		this.addCenter("0");
		this.addOutPin(new NPin("Value", NInteger).setIsByRef(false, true));
		return this.containerDiv;
	}

	returnValRequested(pin) {
		return this.val;
	}

	static getName() {
		return "Integer";
	}
}

class DoubleNode extends NNode {
	constructor() {
		super();
		this.val = NInteger.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Variable (Double)");
		this.addCenter("0.0");
		this.addOutPin(new NPin("Value", NDouble).setIsByRef(false, true));
		return this.containerDiv;
	}

	returnValRequested(pin) {
		return this.val;
	}

	static getName() {
		return "Double";
	}

	static getTags() {
		return ["float"];
	}
}

class DisplayNode extends NNode {
	constructor() {
		super();
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("");
		this.addHeader();
		this.addInPin(new NPin("_", NExecution));
		this.addInPin(new NPin("Value", NObject));
		this.addOutPin(new NPin("__", NExecution));
		return this.containerDiv;
	}

	inputExecuted(pin) {
		console.log(this.inputN("Value"));
		this.execN("__");
	}

	static getName() {
		return "Display";
	}

	static getTags() {
		return ["print", "log", "output", "sysout", "stdout"];
	}
}

class SubstringNode extends NNode {
	constructor() {
		super("Substring");
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.addInPin(new NPin("String", NString));
		this.addInPin(new NPin("Start Index", NInteger));
		this.addInPin(new NPin("End Index", NInteger));
		this.addOutPin(new NPin("Substring", NString));
		return this.containerDiv;
	}

	returnValRequested(pin) {
		return {
			"string": this.inputN("String").string.substring(this.inputN("Start Index").int, this.inputN("End Index").int)
		};
	}

	static getName() {
		return "Substring";
	}
}

class AdditionNode extends NNode {
	constructor() {
		super();
		this.intlock = false;
		this.doublelocks = new Set();
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("+");
		this.addInPin(new NPin("A", NInteger, NDouble));
		this.addInPin(new NPin("B", NInteger, NDouble));
		this.addOutPin(new NPin("Sum", NInteger, NDouble));
		return this.containerDiv;
	}

	linkedPinChangedType(self, linked, from, to) {
		this.pinUnlinked(self, linked);
		this.pinLinked(self, linked);
	}

	pinUnlinked(self, other) {
		if (self.side) {
			if (this.intlock) {
				this.intlock = false;
				for (const inn in this.inpins) {
					this.inpins[inn].setTypes(false, NInteger, NDouble);
				}
			}
		} else {
			if (this.doublelocks.delete(self)) {
				if (this.doublelocks.size == 0) {
					this.outpins["Sum"].setTypes(false, NInteger, NDouble);
				}
			}
		}
	}

	pinLinked(self, other) {
		if (self.side) {
			if (other.multiTyped) {
				var isInt = !NDouble.areAny(other.types);
			} else {
				var isInt = other.type.isA(NInteger)
			}
			if (isInt) {
				this.intlock = true;
				for (const inn in this.inpins) {
					this.inpins[inn].setTypes(false, NInteger);
				}
			}
		} else {
			if (other.multiTyped) {
				if (!NInteger.areAny(other.types)) {
					this.outpins["Sum"].setTypes(false, NDouble);
					this.doublelocks.add(self);
					this.intlock = false;
				}
			} else {
				if (other.type.isA(NDouble) && this.outpins["Sum"].type != NDouble) {
					this.outpins["Sum"].setTypes(false, NDouble);
					this.doublelocks.add(self);
					this.intlock = false;
				}
			}
		}
	}

	returnValRequested(pin) {
		console.log("ADD");
		console.log(this.intlock);
		console.log(this.doublelocks);
		if (this.intlock || this.doublelocks.size == 0) {
			let sum = 0;
			for (const inp of this.inpinOrder) {
				if (inp.linkNum) {
					sum += this.getValue(inp).int;
				}
			}
			return {
				"int": sum
			};
		} else {
			let sum = 0;
			for (const inp of this.inpinOrder) {
				if (inp.linkNum) {
					sum += double(this.getValue(inp));
				}
			}
			return {
				"double": sum
			};
		}
	}

	static getName() {
		return "Addition";
	}

	static getTags() {
		return ["plus", "+", "sum"];
	}
}

class IncrementNode extends NNode {
	constructor() {
		super();
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("+=");
		this.addInPin(new NPin("_", NExecution));
		this.addInPin(new NPin("Variable", NInteger, NDouble).setIsByRef(true, true));
		this.addInPin(new NPin("Increment by", NInteger, NDouble).setDefaultVal(1));
		this.addOutPin(new NPin("__", NExecution));
		return this.containerDiv;
	}

	static getName() {
		return "Increment";
	}

	static getTags() {
		return ["++", "+="];
	}
}

class CommentNode extends NNode {
	constructor() {
		super();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.makeResizable();
		this.textArea = document.createElement("textarea");
		this.textArea.setAttribute("data-nodeid", this.nodeid);
		this.textArea.setAttribute("data-ovrdclick", "");
		this.textArea.setAttribute("data-ovrdkeys", "");
		this.textArea.style.resize = "none";
		const tasty = this.textArea.style;
		const cd = this.centerDiv;
		$(this.nodeDiv).on("resize", function(e, ui) {
			let w = getComputedStyle(cd).width;
			w = parseInt(w.substring(0, w.length - 2));
			let h = getComputedStyle(cd).height;
			h = parseInt(h.substring(0, h.length - 2));
			tasty.width = w - 15 + "px";
			tasty.height = h - 15 + "px";
		})

		this.centerDiv.append(this.textArea);
		return this.containerDiv;
	}

	static getName() {
		return "Comment";
	}

	static getTags() {
		return ["//", "#", "/*"];
	}
}