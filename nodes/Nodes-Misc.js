class CommentNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.noPinfo = true;
		this.addInPin(new NPin("_", NComment));
		this.addOutPin(new NPin("__", NComment));
		this.makeResizable();
		this.nodeDiv.className = this.nodeDiv.className + " comment";
		this.textArea = document.createElement("textarea");
		this.textArea.setAttribute("data-nodeid", this.nodeid);
		this.textArea.style.resize = "none";
		const tasty = this.textArea.style;
		const cd = this.centerDiv;

		this.centerDiv.append(this.textArea);
		return this.containerDiv;
	}

	static getName() {
		return "Comment";
	}

	static getInTypes() {
		return [NComment];
	}

	static getOutTypes() {
		return [NComment];
	}

	static getCategory() {
		return "Misc";
	}

	static getTags() {
		return ["//", "#", "/**/"];
	}
}