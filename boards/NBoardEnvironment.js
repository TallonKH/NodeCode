// TODO 4DD X BUTTONS TO CLOS3 T4BS
// TODO 4DD CONT3NT TO TH3 R1GHT M3NU (NOD3 D3SCR1PT1ON, NON-1NPUT S3TT1NGS, 3TC)
const TAU = 2 * Math.PI;
class Main {
	constructor() {
		this.passedMetas = new Set([87, 84, 82, 81, 78, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
		this.outerSplit;
		this.mainTabListDiv;
		this.mainTabDiv;
		this.leftMenuDiv;
		this.rightMenuDiv;
		this.boards = [];
		this.activeBoard = null;
		this.shiftDown = false;
		this.altDown = false;
		this.ctrlDown = false;
		this.metaDown = false;

		this.presets = {
			"code": ["Code", "Misc", "Regex"],
			"regex": ["Regex", "Misc"],
			"shader": ["Shader", "Misc"],
			"debug": ["Code", "Regex", "Shader", "Misc", "Example"]
		};

		this.savedBoards = JSON.parse(localStorage.getItem("boards")) || {}; // board name : board id;

		this.maxPanDist = 25;
		this.lineClickDistance = 10;
		this.dragDistance = 10;
		this.panSpeed = 0.5;
		this.snapDistance = 10;
		this.moveDistance = this.snapDistance;
		this.maxExecIterations = 500;

		this.nodeTypeList = [
			StringNode, IntegerNode, DoubleNode, PrintNode,
			SubstringNode, AdditionNode, IncrementNode, CommentNode,
			BranchNode, LogicalAndNode, CustomPinMenuNode,
			STypeTestNode, SDisplayNode, SVector1Node, SVector2Node, SVector3Node,
			SVector4Node, STexCoordNode, SRoundNode, SFloorNode, SCeilNode, SFractNode,
			SComponentNode, SSubtractNode, SModuloNode, SExponentNode, SSineNode,
			SCosineNode, STangentNode, SMinNode, SMaxNode, SRadiansNode, SDegreesNode,
			SASineNode, SACosineNode, SATangentNode, SATangent2Node, SLnNode, SSqrtNode, SISqrtNode,
			SExp2Node, SEExpNode, SLogNode, SLog2Node, SSignNode, SAbsValNode, SNegateNode,
			SAdditionNode, SMultiplyNode, SDivideNode, SMakeVec2Node, SMakeVec3Node,
			SMakeVec4Node, SAppendNode, SOneMinusNode, SInverseNode, SNormalizeNode,
			SLengthNode, SPiNode, STauNode, SPosterizeNode, SMixNode, SStepNode, SSmoothStepNode,
			SRandNode, SBreakVec2Node, SBreakVec3Node, SBreakVec4Node, STimeNode, SRerouteNode,
			SClampNode, SDistanceNode, SDotProductNode, SCrossProductNode, SReflectNode, SRefractNode,
			SHSVNode, SRGBNode, SZeroNode, SOneNode, STwoNode, SSimplexNoiseNode, SP1D2Node,
			/*SMiniDisplayNode,*/ STextureInputNode, STextureSamplerNode, SWorleyNoiseNode,
			SContrastNode, STriangleWaveNode, SRotateUVNode, SRotateUVMidNode
		];
		this.nodeCategories = {};
		this.nodeTypeDict = {};
		for (const type of this.nodeTypeList) {
			this.nodeTypeDict[type.getName()] = type;
			const cat = this.nodeCategories[type.getCategory()];
			if (cat) {
				cat.push(type);
			} else {
				this.nodeCategories[type.getCategory()] = [type];
			}
		}

		this.fileList;
		this.fileListMap = {};
		this.newFileButton;
	}

	saveBoardToStorage(board) {
		const existing = this.savedBoards[board.name];
		if (!existing || existing == board.uid || confirm("A saved board already exists under this name. Replace?")) {
			localStorage.setItem("brd_" + board.name, JSON.stringify(board.exportBoard()));
			this.savedBoards[board.name] = board.uid;
			localStorage.setItem("boards", JSON.stringify(this.savedBoards));
			return true;
		}
		return false;
	}

	loadBoardFromStorage(name) {
		if (this.savedBoards[name]) {
			const data = JSON.parse(localStorage.getItem("brd_" + name));
			if (data) {
				const board = this.newBoard(data);
				board.redraw();
				return board;
			}
		}
		console.log("Board " + name + " not found in storage");
		return false;
	}

	unsave(brd) {
		brd.named = false;
		brd.setUnsaved();
		localStorage.removeItem("brd_" + brd.name);
		delete this.savedBoards[brd.name];
		console.log(this.savedBoards);
		localStorage.setItem("boards", JSON.stringify(this.savedBoards));
		this.rememberOpened();
	}

	newBoard(data) {
		const brd = new NBoard(this, data);
		this.mainTabDiv.append(brd.createPaneDiv());
		this.mainTabListDiv.append(brd.createTabDiv());
		$(this.mainTabDiv).tabs("refresh");
		this.boards.push(brd);
		setTimeout(function() {
			for (const nd in brd.nodes) {
				brd.nodes[nd].updatePosition();
			}
		}, 10);
		if (typeof data == "object") {
			brd.loadNodes(data);
		}

		brd.redraw();
		brd.fixSize();

		this.refreshFileList();
		this.rememberOpened();
		return brd;
	}

	closeBoard(board) {
		this.boards.splice(board.tabIndex, 1);
		for (let i = board.tabIndex; i < this.boards.length; i++) {
			const brd = this.boards[i];
			brd.tabIndex--;
			brd.tabId = "maintab-" + brd.tabIndex;
			brd.tabDivLink.setAttribute("href", "#" + brd.tabId);
			brd.paneDiv.id = brd.tabId;
		}
		if (this.activeBoard == board) {
			this.activeBoard = null;
		}
		const jtabs = $(this.mainTabDiv);
		const active = jtabs.tabs("option", "active");
		board.paneDiv.remove();
		board.tabDiv.remove();
		jtabs.tabs("destroy").tabs();
		if (!this.boards.length) {
			window.open('../homepage/main.html', "_self");
		}
		jtabs.tabs("option", "active", active);
		this.activeBoard = this.boards[Math.min(board.tabIndex, this.boards.length - 1)];
		this.refreshFileList();
		this.rememberOpened();
	}

	processCommand(cmd) {

	}

	setupLeftMenu() {
		const main = this;
		let item;

		{
			item = createCollapseDiv("Files");
			main.leftMenuDiv.append(item.container);

			const contents = item.collapsing;

			main.fileList = document.createElement("ul");
			main.fileList.className = "filelist";

			const newFileItem = createCollapseDiv("New");
			this.newFileButton = newFileItem.container;
			newFileItem.collapsing.className += " newfilelist";

			newFileItem.collapsing.append(this.createNewFileListItem("code"));
			newFileItem.collapsing.append(this.createNewFileListItem("regex"));
			newFileItem.collapsing.append(this.createNewFileListItem("shader"));
			newFileItem.collapsing.append(this.createNewFileListItem("debug"));
			this.refreshFileList();
			contents.append(main.fileList);
		}

		{
			item = createCollapseDiv("Console");
			main.leftMenuDiv.append(item.container);

			const contents = item.collapsing;
			main.consoleDiv = document.createElement("div");
			main.consoleDiv.className = "console";
			contents.append(main.consoleDiv);
			const inp = document.createElement("input");
			main.consoleInput = inp;
			inp.className = "consoleinput";
			inp.placeholder = "type here";
			inp.onkeydown = function(e) {
				switch (e.which) {
					case 13: // ENTER
						if (inp.value.length) {
							main.logt("> " + inp.value);
							main.processCommand(inp.value);
							inp.value = "";
						}
						return false;
					case 27: // ESC
						inp.blur();
						return false;
				}
				return true;
			}
			contents.append(main.consoleInput);
		}
	}

	logt(text, src = null) {
		const scrtopPre = this.consoleDiv.scrollHeight - this.consoleDiv.clientHeight;

		const d = document.createElement("div");
		d.className = "consoleitem";
		d.innerHTML = text;

		if (src) {
			d.setAttribute("dclickable", true);
			d.ondblclick = src;
		}

		this.consoleDiv.append(d);

		if (scrtopPre - this.consoleDiv.scrollTop < 20) {
			this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight - this.consoleDiv.clientHeight;
		}
	}

	refreshFileList() {
		const brdns = Object.keys(JSON.parse(localStorage.getItem("boards") || "{}"));
		const brdnset = new Set(brdns);
		this.newFileButton.remove();
		for (const brdn in this.fileListMap) {
			this.fileListMap[brdn].remove();
			if (!brdnset.has(brdn)) {
				delete this.fileListMap[brdn];
			}
		}

		brdns.sort();

		for (const brdn of brdns) {
			let item = this.fileListMap[brdn];

			if (!item) {
				item = this.createFileListItem(brdn);
				this.fileListMap[brdn] = item;
			}

			item.removeAttribute("open");

			for (const brd of this.boards) {
				if (brd.name == brdn) {
					item.setAttribute("open", true);
				}
			}

			this.fileList.append(item);
			this.fileList.append(this.newFileButton);
		}
	}

	createFileListItem(boardn) {
		const item = document.createElement("li");
		item.innerHTML = boardn;
		item.className = "filebutton";

		item.onclick = function(e) {
			for (const brd of main.boards) {
				if (brd.name == boardn) {
					return false;
				}
			}
			main.loadBoardFromStorage(boardn);
			return false;
		}
		return item;
	}

	createNewFileListItem(preset) {
		const item = document.createElement("li");
		item.innerHTML = preset;
		item.className = "filebutton";

		item.onclick = function(e) {
			localStorage.setItem("initialPreset", preset);
			main.newBoard("Untitled_" + preset).activeCategories = new Set(main.presets[preset]);
			return false;
		}
		return item;
	}

	inCurrentBoard(event) {
		const box = main.activeBoard.boardDiv.getBoundingClientRect();
		return (event.clientX < box.right && event.clientX > box.left && event.clientY > box.top && event.clientY < box.bottom);
	}

	rememberOpened() {
		localStorage.setItem("toOpen", JSON.stringify(this.boards.filter(x => x.named).map(x => x.name)));
	}
}

$(function() {
	main = new Main();
	main.mainTabListDiv = document.getElementById("maintablist");
	main.mainTabDiv = document.getElementById("maintabs");
	main.leftMenuDiv = document.getElementById("leftmenu");
	main.rightMenuDiv = document.getElementById("rightmenu");

	// splitpane
	main.outerSplit = Split(["#leftsplit", "#maintabs", "#rightsplit"], {
		sizes: [15, 70, 15],
		minSize: [15, 400, 15],
		gutterSize: 5,
		snapOffset: 5
	});

	let movingMainSplit = false;

	$("body>.gutter").mousedown(function(e) {
		movingMainSplit = true;
	});

	main.setupLeftMenu();
	// set active board on tab switch
	let startup = true;
	$(main.mainTabDiv).tabs({
		activate: function(event, ui) {
			const href = ui.newTab.context.href;
			let a = href.substring(href.indexOf("#maintab-") + 9);
			if (!startup) {
				localStorage.setItem("activeTab", a.toString());
			}
			main.activeBoard = main.boards[parseInt(a)];
			main.activeBoard.redraw();
			main.activeBoard.fixSize();
		}
	});

	$(window).on("resize", function(e) {
		main.activeBoard.fixSize();
	});

	window.onbeforeunload = function(e) {
		for (const board of main.boards) {
			if (!board.saved) {
				return true;
			}
		}
		return null;
	}

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

		if (main.metaDown && main.passedMetas.has(event.which)) {
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
					if (main.ctrlDown || main.metaDown) {
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
		if (main.inCurrentBoard(event)) {
			return main.activeBoard.mouseDown(event);
		}
	}
	window.onmouseup = function(event) {
		if (movingMainSplit) {
			movingMainSplit = false;
		} else {
			return main.activeBoard.mouseUp(event);
		}
	}
	window.onmousemove = function(event) {
		if (movingMainSplit) {
			main.activeBoard.fixSize();
		} else {
			return main.activeBoard.mouseMoved(event);
		}
	}

	window.addEventListener("mousewheel", function(event) {
		if (main.inCurrentBoard(event)) {
			return main.activeBoard.msWheel(event);
		}
		return true;
	}, {
		passive: false
	});

	const preset = localStorage.getItem("initialPreset");
	if (preset) {
		console.log("Loading preset: " + preset);
		main.newBoard("Untitled_" + preset).activeCategories = new Set(main.presets[preset]);
	}

	const toOpen = JSON.parse(localStorage.getItem("toOpen"));
	if (toOpen) {
		for (const name of toOpen) {
			console.log("Opening: " + name);
			main.loadBoardFromStorage(name);
		}
		localStorage.removeItem("initialPreset");
	}

	if (!main.boards.length) {
		window.open('../homepage/main.html', "_self");
	}

	$(main.mainTabDiv).tabs("option", "active", 0);

	let tabs = $(".tabs").tabs();
	tabs.find(".ui-tabs-nav").sortable({
		axis: "x",
		stop: function() {
			tabs.tabs("refresh");
		}
	});

	const activeTabIndex = localStorage.getItem("activeTab");
	if (activeTabIndex !== null) {
		$(main.mainTabDiv).tabs("option", "active", parseInt(activeTabIndex));
	}
	// window.onresize = fixAllCanvasSizes;
	const fopener = $("#fopener").get(0);
	const reader = new FileReader();
	fopener.onchange = function(event) {
		const fileList = fopener.files;
		const file = fileList["0"];
		if (file) {
			reader.readAsText(file);
		}
	}
	reader.onload = function(event) {
		const brd = main.newBoard(JSON.parse(reader.result));

		console.log("Done importing file!");
	}
	startup = false;
});