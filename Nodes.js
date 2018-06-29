// TODO 1MPL3M3NT S4V3/LO4D M3THODS FOR 4LL NOD3 TYP3S

class StringNode extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NString.construct();
		this.inputDiv;
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addHeader("Variable (String)");

		this.addCenter();
		this.inputDiv = document.createElement("input");
		this.inputDiv.className = "nodeval string";
		this.inputDiv.value = this.val.string;
		const node = this;
		const inp = this.inputDiv;
		inp.onkeydown = function(e) {
			switch (e.which) {
				case 13: // ENTER
					node.val.string = inp.value;
					inp.blur();
					break;
				case 27: // ESC
					inp.value = node.val.string;
					inp.blur();
					break;
			}
		}
		inp.onblur = function(e){
			node.val.string = inp.value;
		}
		this.centerDiv.append(this.inputDiv);

		this.addOutPin(new NPin("Value", NString).setIsByRef(false, true));
		return this.containerDiv;
	}

	returnValRequested(pin) {
		return this.val;
	}

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		this.val = data.val;
		this.inputDiv.value = this.val.string;
	}

	static getName() {
		return "String";
	}

	static getTags() {
		return ["\"\"", "\'\'"];
	}
}

class IntegerNode extends NNode {
	constructor(data = null) {
		super(data);
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

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		this.val = data.val;
	}

	static getName() {
		return "Integer";
	}
}

class DoubleNode extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NDouble.construct();
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

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		this.val = data.val;
	}

	static getName() {
		return "Double";
	}

	static getTags() {
		return ["float"];
	}
}

class DisplayNode extends NNode {
	constructor(data = null) {
		super(data);
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
	constructor(data = null) {
		super(data);
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
class BranchNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.addInPin(new NPin("_", NExecution));
		this.addInPin(new NPin("Condition", NBoolean));
		this.addOutPin(new NPin("True", NExecution));
		this.addOutPin(new NPin("False", NExecution));
		return this.containerDiv;
	}

	inputExecuted(pin) {
		if(this.inputN("Condition").boolean){
			this.execN("True");
		}else{
			this.execN("False");
		}
	}

	static getName() {
		return "Branch";
	}

	static getTags() {
		return ["if", "else"];
	}
}

class AdditionNode extends NNode {
	constructor(data = null) {
		super(data);
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
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter("+=");
		this.addInPin(new NPin("_", NExecution));
		this.addInPin(new NPin("Variable", NInteger, NDouble).setIsByRef(true, true));
		this.addInPin(new NPin("Increment by", NInteger, NDouble).setDefaultVal(1, true));
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
	constructor(data = null) {
		super(data);
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