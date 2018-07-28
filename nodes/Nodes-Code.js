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
		this.inputDiv = NString.edit(this.val, this.board);
		this.inputDiv.className = "nodeval string";
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
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
		Object.assign(this.val, data.val);
		this.inputDiv.value = this.val.string;
	}

	static getName() {
		return "String";
	}

	static getTags() {
		return ["\"\"", "\'\'"];
	}

	static getCategory() {
		return "Code";
	}

	static getOutTypes() {
		return [NString];
	}
}

class IntegerNode extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NInteger.construct();
		this.inputDiv;
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Variable (Int)");
		this.addCenter();
		this.inputDiv = NInteger.edit(this.val, this.board);
		this.inputDiv.className = "nodeval integer";
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
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
		Object.assign(this.val, data.val);
		this.inputDiv.value = this.val.int;
	}

	static getName() {
		return "Integer";
	}

	static getCategory() {
		return "Code";
	}

	static getOutTypes() {
		return [NInteger];
	}
}

class DoubleNode extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NDouble.construct();
		this.inputVal;
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Variable (Double)");
		this.addCenter();
		this.inputDiv = NDouble.edit(this.val, this.board);
		this.inputDiv.className = "nodeval double";
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
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
		Object.assign(this.val, data.val);
		this.inputDiv.value = this.val.double;
	}

	static getName() {
		return "Double";
	}

	static getOutTypes() {
		return [NDouble];
	}

	static getCategory() {
		return "Code";
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
		this.addCenter();
		this.addHeader();
		this.addInPin(new NPin("Refresh", NExecution));
		this.addInPin(new NPin("Value", NObject));
		this.addOutPin(new NPin("__", NExecution));
		return this.containerDiv;
	}

	inputExecuted(pin) {
		this.execN("__");
	}

	static getName() {
		return "Display";
	}

	static getInTypes() {
		return [NExecution, NObject];
	}

	static getOutTypes() {
		return [NExecution];
	}

	static getCategory() {
		return "Code";
	}

	static getTags() {
		return ["output"];
	}
}

class PrintNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.addInPin(new NPin("_", NExecution));
		this.addInPin(new NPin("Value", NObject));
		this.addOutPin(new NPin("__", NExecution));
		return this.containerDiv;
	}

	inputExecuted(pin) {
		const val = this.inputN("Value");
		this.board.env.logt(JSON.stringify(val));
		this.execN("__");
	}

	static getName() {
		return "Print";
	}

	static getInTypes() {
		return [NExecution, NObject];
	}

	static getOutTypes() {
		return [NExecution];
	}

	static getCategory() {
		return "Code";
	}

	static getTags() {
		return ["output", "print", "log", "console", "sysout", "stdout", "debug"];
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

	static getInTypes() {
		return [NString, NInteger];
	}

	static getOutTypes() {
		return [NString];
	}

	static getCategory() {
		return "Code";
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
		this.addInPin(new NPin("__", NBoolean));
		this.addOutPin(new NPin("True", NExecution));
		this.addOutPin(new NPin("False", NExecution));
		return this.containerDiv;
	}

	inputExecuted(pin) {
		if (this.inputN("__").boolean) {
			this.execN("True");
		} else {
			this.execN("False");
		}
	}

	static getName() {
		return "Branch";
	}

	static getInTypes() {
		return [NExecution, NBoolean];
	}

	static getOutTypes() {
		return [NExecution];
	}

	static getCategory() {
		return "Code";
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
		this.addCenter("+");

		this.addNumInput(true);
		this.addNumInput(true);

		this.addOutPin(new NPin("Sum", NInteger, NDouble));
		return this.containerDiv;
	}

	makeNumEditor(pin) {
		const node = this;
		const brd = node.board;
		return function(nvar) {
			// const nvar = pin.defaultVal;
			const inp = document.createElement("input");
			inp.className = "pinval number";
			inp.type = "number";
			inp.value = nvar.double || nvar.int || 0;

			const changeNVal = function() {
				const val = parseFloat(inp.value) || 0;
				// !=
				if (parseFloat(inp.value) != double(nvar)) {
					if (node.intlock || val % 1 == 0) {
						const ival = Math.trunc(val);
						const shouldChange = nvar.double !== undefined
						brd.addAction(new ActChangeDefVal(brd, nvar, {
							"int": ival
						}, ["double"], function(v, redo) {
							if (shouldChange) {
								if (redo) {
									node.doublelocks.delete(pin);
								} else {
									node.doublelocks.add(pin);
								}
								if (node.doublelocks.size) {
									node.outpins["Sum"].setTypes(false, NDouble);
								} else {
									node.outpins["Sum"].setTypes(false, NInteger, NDouble);
								}
							}
							inp.value = double(v);
						}));
						delete nvar.double;
						nvar.int = ival;
						inp.value = nvar.int.toString();
						node.doublelocks.delete(pin)
					} else {
						const shouldChange = nvar.int !== undefined
						brd.addAction(new ActChangeDefVal(brd, nvar, {
							"double": val
						}, ["int"], function(v, redo) {
							if (shouldChange) {
								if (redo) {
									node.doublelocks.add(pin);
								} else {
									node.doublelocks.delete(pin);
								}
								if (node.doublelocks.size) {
									node.outpins["Sum"].setTypes(false, NDouble);
								} else {
									node.outpins["Sum"].setTypes(false, NInteger, NDouble);
								}
							}
							inp.value = double(v);
						}));
						delete nvar.int;
						nvar.double = val;
						node.doublelocks.add(pin);
					}

					if (node.doublelocks.size) {
						node.outpins["Sum"].setTypes(false, NDouble);
					} else {
						node.outpins["Sum"].setTypes(false, NInteger, NDouble);
					}
				}
			}

			inp.onfocusout = changeNVal;
			inp.onkeydown = function(e) {
				switch (e.which) {
					case 13: // ENTER
						changeNVal();
						inp.blur();
						break;
					case 27: // ESC
						inp.value = nvar.double;
						inp.blur();
						break;
				}
			}
			return inp;
		};
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
			if (this.doublelocks.delete(other)) {
				if (this.doublelocks.size == 0) {
					this.outpins["Sum"].setTypes(false, NInteger, NDouble);
				}
			}
		}
	}

	addNumInput(noAction = false) {
		let pin;
		if (this.intlock) {
			pin = new NPin(alphabet[this.inpinOrder.length], NInteger);
		} else {
			pin = new NPin(alphabet[this.inpinOrder.length], NInteger, NDouble);
		}
		pin.customEditor = this.makeNumEditor(pin);
		pin.defaultVal = {
			"int": 0
		};
		pin.defaultDefaultVal = {
			"int": 0
		};
		this.addInPin(pin);
		if (!noAction) {
			this.board.addAction(new ActAddPin(this.board, pin, this.inpinOrder.length - 1));
		}
		return pin;
	}

	makeContextMenu(pos) {
		const menu = super.makeContextMenu(pos);
		const node = this;
		const brd = this.board;
		if (node.inpinOrder.length < 26) {
			const op = new NCtxMenuOption("Add Input");
			op.action = function(p) {
				node.addNumInput();
				return false;
			}
			menu.addOption(op);
		}
		if (node.inpinOrder.length > 2) {
			const op = new NCtxMenuOption("Remove Input");
			op.action = function(p) {
				const pin = node.inpins[node.inpinOrder[node.inpinOrder.length - 1]];
				brd.addAction(new ActRemovePin(brd, pin, node.inpinOrder.length - 1));
				node.removeInPin(pin);
				return false;
			}
			menu.addOption(op);
		}

		return menu;
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
					this.doublelocks.add(other);
					this.intlock = false;
				}
			} else {
				if (other.type.isA(NDouble)) {
					if (!this.doublelocks.size) {
						this.outpins["Sum"].setTypes(false, NDouble);
					}
					this.doublelocks.add(other);
					this.intlock = false;
				}
			}
		}
	}

	returnValRequested(pin) {
		if (this.intlock || this.doublelocks.size == 0) {
			let sum = 0;
			for (const inn of this.inpinOrder) {
				const inp = this.inpins[inn];
				sum += this.getValue(inp).int;
			}
			return {
				"int": sum
			};
		} else {
			let sum = 0;
			for (const inn of this.inpinOrder) {
				const inp = this.inpins[inn];
				sum += double(this.getValue(inp));
			}
			return {
				"double": sum
			};
		}
	}

	saveExtra(data) {
		data.extraIns = this.inpinOrder.length - 2;
	}

	load(data, loadids) {
		for (let i = 2, l = data.extraIns + 2; i < l; i++) {
			this.addNumInput(true);
		}
		super.load(data, loadids);
	}

	allLinked() {
		for (const inn of this.inpinOrder) {
			if (!this.inpins[inn].linkNum) {
				return false;
			}
		}
		return true;
	}

	onAttemptedDropLink(other) {
		if (other.side) {

			if (this.allLinked()) {
				if (other.areOutTypesCompatible(NInteger, NDouble)) {
					const pin = this.addNumInput(true);
					return new ActAddPin(this.board, pin, this.inpinOrder.length - 1)
				} else {
					return false;
				}
			}else{
				return null;
			}
		} else {
			return null;
		}
	}

	static getName() {
		return "Addition";
	}

	static getInTypes() {
		return [NInteger, NDouble];
	}

	static getOutTypes() {
		return [NInteger, NDouble];
	}

	static getCategory() {
		return "Code";
	}

	static getTags() {
		return ["plus", "+", "sum"];
	}
}

class LogicalAndNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("&&");
		this.addInPin(new NPin("A", NBoolean));
		this.addInPin(new NPin("B", NBoolean));
		this.addOutPin(new NPin("_", NBoolean));
		return this.containerDiv;
	}

	makeContextMenu(pos) {
		const menu = super.makeContextMenu(pos);
		const node = this;
		const brd = this.board;
		if (node.inpinOrder.length < 26) {
			const op = new NCtxMenuOption("Add Input");
			op.action = function(e) {
				const pin = new NPin(alphabet[node.inpinOrder.length], NBoolean);
				node.addInPin(pin);
				brd.addAction(new ActAddPin(brd, pin, node.inpinOrder.length - 1));
				return false;
			}
			menu.addOption(op);
		}
		if (node.inpinOrder.length > 2) {
			const op = new NCtxMenuOption("Remove Input");
			op.action = function(e) {
				const pin = node.inpins[node.inpinOrder[node.inpinOrder.length - 1]];
				brd.addAction(new ActRemovePin(brd, pin, node.inpinOrder.length - 1));
				node.removeInPin(pin);
				return false;
			}
			menu.addOption(op);
		}

		return menu;
	}

	returnValRequested(pin) {
		for (const inn of this.inpinOrder) {
			if (!this.inputN(inn).boolean) {
				return {
					"nclass": "Boolean",
					"boolean": false
				};
			}
		}
		return {
			"nclass": "Boolean",
			"boolean": true
		};
	}

	saveExtra(data) {
		data.extraIns = this.inpinOrder.length - 2;
	}

	load(data, loadids) {
		for (let i = 2, l = data.extraIns + 2; i < l; i++) {
			this.addInPin(new NPin(alphabet[i], NBoolean));
		}
		super.load(data, loadids);
	}

	static getName() {
		return "And (Logical)";
	}

	static getInTypes() {
		return [NBoolean];
	}

	static getOutTypes() {
		return [NBoolean];
	}

	static getCategory() {
		return "Code";
	}

	static getTags() {
		return ["&&"];
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
		this.addInPin(new NPin("Increment by", NInteger, NDouble).setDefaultVal({
			"int": 1,
			"nclass": "Integer"
		}, true));
		this.addOutPin(new NPin("__", NExecution));
		return this.containerDiv;
	}

	static getName() {
		return "Increment";
	}

	static getInTypes() {
		return [NExecution, NInteger, NDouble];
	}

	static getOutTypes() {
		return [NExecution];
	}

	static getCategory() {
		return "Code";
	}

	static getTags() {
		return ["++", "+="];
	}
}