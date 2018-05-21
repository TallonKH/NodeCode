class TNode {
	constructor(canvas, displayName = "Unknode") {
		this.displayName = displayName;
		this.canvas = canvas;
		this.resizable = false;
		// this.position = new Point(0,0);
		this.nodeDiv = null;
		this.headerDiv = null;

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
			this.nodeDiv.className = this.nodeDiv.className + ' resizable'
		}
	}

	createNodeDiv(createHeader = true) {
		this.nodeDiv = document.createElement('div');
		this.nodeDiv.className = "draggable node ui-widget-content";
		let ndjq = $(this.nodeDiv)
		ndjq.draggable({
			containment: "parent",
			scroll: false
		});

		if (createHeader) {
			this.headerDiv = document.createElement('header');
			this.headerDiv.innerHTML = this.displayName;
			this.nodeDiv.append(this.headerDiv);
		}


		return this.nodeDiv;
	}
}

class StringNode extends TNode {
	constructor(canvas) {
		super(canvas, "String");
	}

	createNodeDiv() {
		super.createNodeDiv();

		return this.nodeDiv;
	}
}

class CommentNode extends TNode {
	constructor(canvas) {
		super(canvas, "Comment");
	}

	createNodeDiv() {
		super.createNodeDiv(true);
		this.makeResizable();
		this.textArea = document.createElement('textarea');
		this.textArea.style.resize = 'none';
		this.nodeDiv.append(this.textArea);
		return this.nodeDiv;
	}
}