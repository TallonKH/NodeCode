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
		this.bodyDiv = null;
		this.centerDiv = null;
		this.headerDiv = null;
		this.inPinDiv = null;
		this.inPinfoDiv = null;
		this.outPinDiv = null;
		this.outPinfoDiv = null;

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

	addHeader(text = this.displayName){
		this.headerDiv = document.createElement("header");
		this.headerDiv.className = "nodepart";
		this.headerDiv.setAttribute("data-nodeid", this.nodeid);
		this.headerDiv.innerHTML = this.displayName;
		this.nodeDiv.append(this.headerDiv);
	}

	addCenter(text = null){
		this.centerDiv = document.createElement("div");
		this.centerDiv.className = "nodepart center";
		this.centerDiv.setAttribute("data-nodeid", this.nodeid);
		if(text){
			const txt = document.createElement("div");
			txt.className = "nodepart text";
			txt.setAttribute("data-nodeid", this.nodeid);
			txt.innerHTML = text;
			this.centerDiv.append(txt);
		}
		this.bodyDiv.append(this.centerDiv);
	}

	addInPin(type){
		if(this.inPinDiv == null){
			this.inPinDiv = document.createElement("div");
			this.inPinDiv.className = "inpins pins"
			this.inPinDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinDiv);

			this.inPinfoDiv = document.createElement("div");
			this.inPinfoDiv.className = "inpinfo pinfo"
			this.inPinfoDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinfoDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}

		const pin = new type(this);
	}

	addOutPin(type){
		if(this.outPinDiv == null){
			this.outPinDiv = document.createElement("div");
			this.outPinDiv.className = "outpins pins"
			this.outPinDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinDiv);

			this.outPinfoDiv = document.createElement("div");
			this.outPinfoDiv.className = "outpinfo pinfo"
			this.outPinfoDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinfoDiv);

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
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
		// this.addHeader();
		this.addCenter("“”");
		this.addOutPin(Pin);
		return this.containerDiv;
	}
}

class AdditionNode extends TNode {
	constructor(board) {
		super(board, "Add");
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("+");
		this.addOutPin(Pin);
		this.addInPin(Pin);
		this.addInPin(Pin);
		return this.containerDiv;
	}
}

class CommentNode extends TNode {
	constructor(board) {
		super(board, "Comment");
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
		this.centerDiv.append(this.textArea);
		return this.containerDiv;
	}
}