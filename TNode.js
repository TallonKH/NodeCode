// CLASSES
//	node			: 	node parent div
//	nodepart	:		a div within a node

// ATTRIBUTES
//	data-nodeid			:		holds id of a div's respective node
//	data-ovrdclick	:		if div should override click functionality (select/drag)
//	data-ovrdkeys		:		if div should override keyboard functionality

class TNode {
	constructor(board, displayName = "Unknode") {
		this.displayName = displayName;
		this.board = board;
		this.resizable = false;

		this.containerDiv = null;
		this.nodeDiv = null;
		this.headerDiv = null;
		this.inPinDiv = null;
		this.outPinDiv = null;

		this.selected = false;
		this.position = new Point(0,0);
		this.offset = new Point(0,0);
		this.displayPosition = new Point(0,0);

		this.nodeid = ~~(Math.random() * 4294967295) // generate random int as ID
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

	createNodeDiv(createHeader = true) {
		this.containerDiv = document.createElement("span");
		this.containerDiv.className = "container";
		this.nodeDiv = document.createElement("div");
		// this.nodeDiv.className = "draggable node ui-widget-content";
		this.nodeDiv.className = "node nodepart";
		this.nodeDiv.setAttribute("data-nodeid", this.nodeid);
		let ndjq = $(this.nodeDiv)

		if (createHeader) {
			this.headerDiv = document.createElement("header");
			this.headerDiv.className = "nodepart";
			this.headerDiv.setAttribute("data-nodeid", this.nodeid);
			this.headerDiv.innerHTML = this.displayName;
			this.nodeDiv.append(this.headerDiv);
		}

		this.containerDiv.append(this.nodeDiv);

		return this.containerDiv;
	}

	addInPin(type){
		if(this.inPinDiv == null){
			this.inPinDiv = document.createElement("div");
			this.inPinDiv.className = "inpins pins"
			this.inPinDiv.setAttribute("data-nodeid", this.nodeid);
			this.nodeDiv.append(this.inPinDiv);
		}

		const pin = new type(this);
	}

	addOutPin(type){
		if(this.outPinDiv){
			this.outPinDiv = document.createElement("div");
			this.outPinDiv.className = "outpins pins"
			this.outPinDiv.setAttribute("data-nodeid", this.nodeid);
			this.nodeDiv.append(this.outPinDiv);
		}

		const pin = new type(this);
	}

	move(delta){
		this.position = this.position.addp(delta);
		this.updatePosition();
	}

	setPosition(pos){
		this.position = pos;
		this.updatePosition()
	}

	updatePosition(){
		this.offset = new Point(this.containerDiv.offsetLeft, this.containerDiv.offsetTop);
		this.offset = new Point(this.containerDiv.getBoundingClientRect().left, this.containerDiv.getBoundingClientRect().top);
		this.displayPosition = this.position.subtractp(this.offset);
		this.nodeDiv.style.left = this.displayPosition.x + "px";
		this.nodeDiv.style.top = this.displayPosition.y + "px";
	}

	// returns if node is within points
	within(a,b){
		const min = this.displayPosition;
		const max = new Point(min.x + this.nodeDiv.clientWidth, min.y + this.nodeDiv.clientHeight);
		console.log(this.displayName);
		console.log(min);
		console.log(max);
		return (min.x >= a.x && max.x <= b.x && min.y >= a.y && max.y <= b.y);
	}
}

class StringNode extends TNode {
	constructor(board) {
		super(board, "String");
	}

	createNodeDiv() {
		super.createNodeDiv();

		return this.containerDiv;
	}
}

class CommentNode extends TNode {
	constructor(board) {
		super(board, "Comment");
	}

	createNodeDiv() {
		super.createNodeDiv(true);
		this.makeResizable();
		this.textArea = document.createElement("textarea");
		this.textArea.setAttribute("data-nodeid", this.nodeid);
		this.textArea.setAttribute("data-ovrdclick", "");
		this.textArea.setAttribute("data-ovrdkeys", "");
		this.textArea.style.resize = "none";
		this.nodeDiv.append(this.textArea);
		return this.containerDiv;
	}
}