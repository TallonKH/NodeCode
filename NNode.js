// CLASSES
//	node			: 	node parent div
//	nodepart	:		a div within a node

// ATTRIBUTES
//	data-nodeid			:		holds id of a div's respective node
//	data-ovrdclick	:		if div should override click functionality (select/drag)
//	data-ovrdkeys		:		if div should override keyboard functionality

class NNode {
	constructor(board, displayName = "Unknode") {
		this.displayName = displayName;
		this.board = board;
		this.resizable = false;

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
		this.position = new NPoint(0,0);
		this.offset = new NPoint(0,0);
		this.displayPosition = new NPoint(0,0);

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

	addInPin(pin){
		if(this.inpins[pin.name]){
			console.log("A inpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		pin.node == this;
		pin.side = true;
		this.inpins[pin.name] = pin;
		if(this.inPinsDiv == null){
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

	addOutPin(pin){
		if(this.outpins[pin.name]){
			console.log("An outpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		pin.node = this;
		pin.side = false;
		this.outpins[pin.name] = pin;
		if(this.outPinsDiv == null){
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

	move(delta){
		this.position = this.position.addp(delta);
		this.updatePosition();
	}

	setPosition(pos){
		this.position = pos;
		this.updatePosition()
	}

	updatePosition(){
		this.offset = new NPoint(this.containerDiv.offsetLeft, this.containerDiv.offsetTop);
		// this.offset = new NPoint(this.containerDiv.getBoundingClientRect().left, this.containerDiv.getBoundingClientRect().top);
		this.displayPosition = this.position.subtractp(this.offset);
		this.nodeDiv.style.left = this.displayPosition.x + "px";
		this.nodeDiv.style.top = this.displayPosition.y + "px";
		this.board.redraw();
	}

	// returns if node is within points
	within(a,b){
		const min = this.displayPosition;
		const max = new NPoint(min.x + this.nodeDiv.clientWidth, min.y + this.nodeDiv.clientHeight);
		return (min.x >= a.x && max.x <= b.x && min.y >= a.y && max.y <= b.y);
	}
}

class StringNode extends NNode {
	constructor(board) {
		super(board, "String");
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("“”");
		this.addOutPin(new NPin("Value", false, NString));
		return this.containerDiv;
	}
}

class SubstringNode extends NNode {
	constructor(board) {
		super(board, "Substring");
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader();
		this.addCenter();
		this.addInPin(new NPin("String", false, NString));
		this.addInPin(new NPin("Start Index", false, NInteger));
		this.addInPin(new NPin("End Index", false, NInteger));
		this.addOutPin(new NPin("Substring", false, NString));
		return this.containerDiv;
	}
}

class AdditionNode extends NNode {
	constructor(board) {
		super(board, "Add");
	}

	createNodeDiv() {
		super.createNodeDiv();
		// this.addHeader();
		this.addCenter("+");
		this.addInPin(new NPin("A", false, NInteger, NDouble));
		this.addInPin(new NPin("B", false, NInteger, NDouble));
		this.addOutPin(new NPin("Sum", false, NInteger, NDouble));
		return this.containerDiv;
	}
}

class CommentNode extends NNode {
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
		const tasty = this.textArea.style;
		const cd = this.centerDiv;
		$(this.nodeDiv).on("resize", function(e, ui){
			let w = getComputedStyle(cd).width;
			w = parseInt(w.substring(0,w.length-2));
			let h = getComputedStyle(cd).height;
			h = parseInt(h.substring(0,h.length-2));
			tasty.width = w - 15 + "px";
			tasty.height = h - 15 + "px";
		})

		this.centerDiv.append(this.textArea);
		return this.containerDiv;
	}
}