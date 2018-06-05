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
	}

	newBoard(name) {
		const brd = new NBoard(this, name);
		this.mainTabDiv.append(brd.createPaneDiv());
		this.mainTabListDiv.append(brd.createTabDiv());
		$(this.mainTabDiv).tabs("refresh");
		this.boards.push(brd);
		brd.fixSize();
		this.activeBoard = brd;
		return brd;
	}
}

$(function() {
	main = new Main();
	main.mainTabListDiv = document.getElementById("maintablist");
	main.mainTabDiv = document.getElementById("maintabs");

	// set active board on tab switch
	$(main.mainTabDiv).tabs({
		activate: function(event, ui){
			main.activeBoard = main.boards[ui.newTab.index()];
		}
	});

	let brdA = main.newBoard("TEST A");
	let brdB = main.newBoard("TEST B");
	let brdC = main.newBoard("TEST C");

	brdA.addNode(StringNode).position = new NPoint(50,50);
	brdA.addNode(SubstringNode).position = new NPoint(200,50);
	brdA.addNode(AdditionNode).position = new NPoint(200,50);

	document.onkeydown = function(event) {
		const divCaptures = event.target.hasAttribute('data-ovrdkeys');
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
						$(main.mainTabDiv).tabs("option", "active",$(main.mainTabDiv).tabs("option", "active")-1);
					}
					break;
				case 221: // next tab
					if (main.ctrlDown) {
						$(main.mainTabDiv).tabs("option", "active",$(main.mainTabDiv).tabs("option", "active")+1);
					}
					break;

			}

			if (main.activeBoard != null) {
				main.activeBoard.keyPressed(event);
			}
		}

		return main.metaDown || divCaptures;
	};

	document.onkeyup = function(event) {
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
		return main.metaDown || event.target.hasAttribute('data-ovrdkeys');
	};

	$(main.mainTabDiv).tabs("option", "active", 0);
});