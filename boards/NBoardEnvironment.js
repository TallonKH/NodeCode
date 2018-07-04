const TAU = 2 * Math.PI;
class Main {
	constructor() {
		this.passedMetas = new Set([87, 84, 82, 81, 78, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
		this.mainTabListDiv;
		this.mainTabDiv;
		this.boards = [];
		this.boardCount = 0;
		this.activeBoard = null;
		this.shiftDown = false;
		this.altDown = false;
		this.ctrlDown = false;
		this.metaDown = false;

		this.presets = {"code":["Code", "Misc", "Regex"], "regex":["Regex", "Misc"], "shader":["Shader","Misc"]};

		this.savedBoards = JSON.parse(localStorage.getItem("boards")) || {}; // board name : board id
		console.log(this.savedBoards);

		this.maxPanDist = 25;
		this.lineClickDistance = 10;
		this.dragDistance = 15;
		this.panSpeed = 0.5;
		this.maxExecIterations = 500;

		this.nodeTypeList = [
			StringNode, IntegerNode, DoubleNode, DisplayNode, SubstringNode, AdditionNode, IncrementNode, CommentNode, BranchNode
		];
		this.nodeCategories = {};
		this.nodeTypeDict = {};
		for (const type of this.nodeTypeList) {
			this.nodeTypeDict[type.getName()] = type;
			const cat = this.nodeCategories[type.getCategory()];
			if(cat){
				cat.push(type);
			}else{
				this.nodeCategories[type.getCategory()] = [type];
			}
		}
		console.log(this.nodeCategories);
	}

	saveBoardToStorage(board){
		const existing = this.savedBoards[board.name];
		if(!existing || existing == board.uid || confirm("A saved board already exists under this name. Replace?")){
			localStorage.setItem("brd_" + board.name, JSON.stringify(board.exportBoard()));
			this.savedBoards[board.name] = board.uid;
			localStorage.setItem("boards", JSON.stringify(this.savedBoards));
			return true;
		}
		return false;
	}

	loadBoardFromStorage(name){
		if(this.savedBoards[name]){
			const data = JSON.parse(localStorage.getItem("brd_" + name));
			if(data){
				return this.newBoard(data);
			}
		}
		console.log("Board " + name + " not found in storage");
		return false;
	}

	unsave(brd){
		localStorage.removeItem("brd_" + brd.name);
		delete this.savedBoards[brd.name];
		console.log(this.savedBoards);
		localStorage.setItem("boards", JSON.stringify(this.savedBoards));
	}

	newBoard(data) {
		const brd = new NBoard(this, data);
		this.mainTabDiv.append(brd.createPaneDiv());
		this.mainTabListDiv.append(brd.createTabDiv());
		$(this.mainTabDiv).tabs("refresh");
		this.boards.push(brd);
		setTimeout(function(){
			for(const nd in brd.nodes){
				brd.nodes[nd].updatePosition();
			}
		},10);
		this.boardCount++;
		if(typeof data == "object"){
			brd.loadNodes(data);
		}
		return brd;
	}
}

$(function() {
	main = new Main();
	main.mainTabListDiv = document.getElementById("maintablist");
	main.mainTabDiv = document.getElementById("maintabs");

	// set active board on tab switch
	$(main.mainTabDiv).tabs({
		activate: function(event, ui) {
			main.activeBoard = main.boards[ui.newTab.index()];
			main.activeBoard.redraw();
			main.activeBoard.fixSize();
		}
	});

	$(window).on("resize", function(e) {
		main.activeBoard.fixSize();
	});

	window.onkeydown = function(event) {
		const divCaptures = event.target.hasAttribute("data-ovrdkeys") || event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA";
		switch (event.key) {
			case 'Shift':
				main.shiftDown = true;
				break;
			case 'Control':
				main.ctrlDown = true;
				break;
			case 'Meta':
				main.metaDown = true;
				break;
			case 'Alt':
				main.altDown = true;
				break;
		}

		if(main.metaDown && main.passedMetas.has(event.which)){
			return true;
		}

		if ((!divCaptures)) {
			// ALT changes event.key on osx, so event.which must be used
			switch (event.which) {
				case 49: // switch inner tabs
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:
					if (main.ctrlDown) {
						$(main.mainTabDiv).tabs("option", "active", event.which - 49);
					}
					break;
				case 219: // prev tab
					if (main.ctrlDown) {
						$(main.mainTabDiv).tabs("option", "active", $(main.mainTabDiv).tabs("option", "active") - 1);
					}
					break;
				case 221: // next tab
					if (main.ctrlDown) {
						$(main.mainTabDiv).tabs("option", "active", $(main.mainTabDiv).tabs("option", "active") + 1);
					}
					break;
				case 73: // I
					if(main.ctrlDown || main.metaDown){
						$("#fopener").trigger("click");
					}
					break;
			}

			if (main.activeBoard != null) {
				main.activeBoard.keyPressed(event);
			}
		}

		return divCaptures;
	};

	window.onkeyup = function(event) {
		switch (event.key) {
			case 'Shift':
				{
					main.shiftDown = false;
				}
				break;
			case 'Control':
				{
					main.ctrlDown = false;
				}
				break;
			case 'Meta':
				{
					main.metaDown = false;
				}
				break;
			case 'Alt':
				{
					main.altDown = false;
				}
				break;
		}
		if (main.activeBoard != null) {
			main.activeBoard.keyReleased(event);
		}
		return event.target.hasAttribute('data-ovrdkeys') || event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA";
	};

	window.onmousedown = function(event) {
		return main.activeBoard.mouseDown(event);
	}
	window.onmouseup = function(event) {
		return main.activeBoard.mouseUp(event);
	}
	window.onmousemove = function(event) {
		return main.activeBoard.mouseMoved(event);
	}
	window.onmousewheel = function(event) {
		return main.activeBoard.mouseWheel(event);
	}

	const url = new URL(window.location.href);
	const toOpen = JSON.parse(url.searchParams.get("open"));
	if(toOpen){
		console.log("Opening: " + toOpen);
		for(const name of toOpen){
			main.loadBoardFromStorage(name);
		}
	}

	const preset = url.searchParams.get("preset");
	if(preset){
		console.log("Loading preset: " + preset);
		main.newBoard("Untitled").activeCategories = new Set(main.presets[preset]);
	}

	$(main.mainTabDiv).tabs("option", "active", 0);

	{
		let tabs = $(".tabs").tabs();
		tabs.find(".ui-tabs-nav").sortable({
			axis: "x",
			stop: function() {
				tabs.tabs("refresh");
			}
		});
	}
	// window.onresize = fixAllCanvasSizes;
	const fopener = $("#fopener").get(0);
	const reader = new FileReader();
	fopener.onchange = function(event) {
		const fileList = fopener.files;
		const file = fileList["0"];
		if(file){
			reader.readAsText(file);
		}
	}
	reader.onload = function(event){
		const data = JSON.parse(reader.result);
		const brd = main.newBoard(data);

		console.log("Done importing file!");
	}
});