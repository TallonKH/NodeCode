class STypeTestNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("|||");
		this.addHeader("Vector Types");
		this.addInPin(new NPin("Vec 1 In", NVector1));
		this.addInPin(new NPin("Vec 2 In", NVector2));
		this.addInPin(new NPin("Vec 3 In", NVector3));

		this.addOutPin(new NPin("Vec 1 Out", NVector1));
		this.addOutPin(new NPin("Vec 2 Out", NVector2));
		this.addOutPin(new NPin("Vec 3 Out", NVector3));

		return this.containerDiv;
	}

	static getName() {
		return "S_Types";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["plus", "+", "sum"];
	}
}

class SAdditionNode extends NNode {
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
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	static getName() {
		return "S_Addition";
	}

	static getInTypes() {
		return [NInteger, NDouble];
	}

	static getOutTypes() {
		return [NInteger, NDouble];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["plus", "+", "sum"];
	}
}