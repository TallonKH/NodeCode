class CustomPinMenuNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("Custom Pin Menu");
		this.setCenterFontSize("20px");
		const pin = new NPin("A", NComment);
		this.addInPin(pin);
		pin.makeContextMenu = this.piNCtxMenuFunc(pin);
		return this.containerDiv;
	}

	piNCtxMenuFunc(pin) {
		return function(event) {
			const menu = NPin.prototype.makeContextMenu.bind(pin)(event);

			let op;

			op = new NCtxMenuOption("Custom Menu Option");
			op.action = function(e) {
				console.log("This is a custom option!");
			}
			menu.addOption(op);

			return menu;
		}
	}

	static getName() {
		return "- Custom Pin Menu -";
	}

	static getInTypes() {
		return [NComment];
	}

	static getCategory() {
		return "Example";
	}
}