const TAU = 2 * Math.PI;
class Main {
	constructor() {
		this.mainTabListDiv;
		this.mainTabDiv;
		this.boards = [];
		this.boardCount = 0;
		this.activeBoard = null;
		this.shiftDown = false;
		this.altDown = false;
		this.ctrlDown = false;
		this.metaDown = false;

		this.maxPanDist = 25;
		this.lineClickDistance = 10;
		this.dragDistance = 15;
		this.panSpeed = 0.5;
		this.maxExecIterations = 500;
	}

	newBoard(name) {
		const brd = new NBoard(this, name);
		this.mainTabDiv.append(brd.createPaneDiv());
		this.mainTabListDiv.append(brd.createTabDiv());
		$(this.mainTabDiv).tabs("refresh");
		this.boards.push(brd);
		this.activeBoard = brd;
		setTimeout(function(){
			for(const nd in brd.nodes){
				brd.nodes[nd].updatePosition();
			}
		},10);
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

	let brdA = main.newBoard("TEST A");
	brdA.loadNodes(JSON.parse(`{"nodes":[{"type":"Integer","id":3928882,"ipids":[],"opids":[2376533],"x":-4.84,"y":231.13,"val":{"int":0,"nclass":"Integer"}},{"type":"Increment","id":8330303,"ipids":[1888827,4583925,2227094],"opids":[7075075],"x":431.55,"y":98.48,"links":{"1":[2376533]},"defV":{"0":{"nclass":"Execution"},"1":null,"2":1}},{"type":"Display","id":670913,"ipids":[7752371,2682148],"opids":[8054297],"x":306.05,"y":218.66,"defV":{"0":{"nclass":"Execution"},"1":{"nclass":"Object"}}},{"type":"Display","id":8096065,"ipids":[1227824,5151503],"opids":[3111933],"x":688.07,"y":224.25,"links":{"0":[7075075,8054297],"1":[1070182]},"defV":{"0":{"nclass":"Execution"},"1":{"nclass":"Object"}}},{"type":"Substring","id":4465537,"ipids":[2167182,1805343,343820],"opids":[7613588],"x":620.08,"y":397.66,"links":{"0":[1070182],"2":[2376533]},"defV":{"0":{"string":"","nclass":"String"},"1":{"int":0,"nclass":"Integer"},"2":{"int":0,"nclass":"Integer"}}},{"type":"Substring","id":2679121,"ipids":[6232867,2411073,6945864],"opids":[1070182],"x":293.67,"y":334.81,"links":{"1":[2376533]},"defV":{"0":{"string":"spagett","nclass":"String"},"1":{"int":"1","nclass":"Integer"},"2":{"int":"1","nclass":"Integer"}}}]}`));
	window.onkeydown = function(event) {
		const divCaptures = event.target.hasAttribute("data-ovrdkeys") || event.target.nodeName == "INPUT";
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

		if ((!divCaptures) && (!main.metaDown)) {
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

			}

			if (main.activeBoard != null) {
				main.activeBoard.keyPressed(event);
			}
		}

		return main.metaDown || divCaptures;
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
		if (!main.metaDown && main.activeBoard != null) {
			main.activeBoard.keyReleased(event);
		}
		return main.metaDown || event.target.hasAttribute('data-ovrdkeys') || event.target.nodeName == "INPUT";
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

	$(main.mainTabDiv).tabs("option", "active", 0);
});