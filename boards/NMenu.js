class NMenu {
	constructor(board, event) {
		this.event = event;
		this.board = board;
		this.searchable = true;
		this.containerDiv;
		this.searchDiv;
		this.headerDiv;
		this.listDiv;
		this.headerString;
		this.options = {}; // div : option
		this.optionList = []; // options in order

		this.selectedIndex = 0;
		this.matchCount = 0;
		this.searchTerm = "";
		this.matchedList = [];
	}

	onClosed(){}

	setHeader(str){
		this.headerString = str;
	}

	makeSearchable(b){
		this.searchable = b;
	}

	createDiv(){
		const menu = this;
		const sd = this.searchDiv;

		this.containerDiv = document.createElement("div");
		this.containerDiv.className = "ctxmenu";
		this.containerDiv.style.left = this.event.clientX + "px";
		this.containerDiv.style.top = this.event.clientY + "px";

		if(this.headerString){
			this.headerDiv = document.createElement("header");
			this.headerDiv.innerHTML = this.headerString;
			this.containerDiv.append(this.headerDiv);
		}

		if(this.searchable){
			this.searchDiv = document.createElement("input");
			this.searchDiv.type = "text";
			this.searchDiv.className = "menusearch";
			this.containerDiv.append(this.searchDiv);

			this.searchDiv.onkeydown = function(e) {
				switch (e.which) {
					case 13: // ENTER
						if (menu.matchCount) {
							if(menu.matchedList[menu.selectedIndex].action(menu.event) != true){
								menu.board.closeMenu();
							}
						}
						return false;
					case 27: // ESC
						menu.board.closeMenu();
						return false;
				}
				if (menu.matchCount) {
					switch (e.which) {
						case 38: // up arrow
							menu.matchedList[menu.selectedIndex].deselect();
							menu.selectedIndex--;
							if (menu.selectedIndex == -1) {
								menu.selectedIndex = menu.matchCount - 1;
							}
							menu.matchedList[menu.selectedIndex].select();
							return false;
						case 40: // down arrow
							menu.matchedList[menu.selectedIndex].deselect();
							menu.selectedIndex++;
							if (menu.selectedIndex == menu.matchCount) {
								menu.selectedIndex = 0;
							}
							menu.matchedList[menu.selectedIndex].select();
							return false;
					}
				}
				return true;
			}
		}

		menu.searchDiv.oninput = function(e) {
			// clear menu
			for (const op of menu.matchedList) {
				op.mainDiv.remove();
			}
			menu.matchedList = [];

			const valid = [
				[],
				[],
				[],
				[]
			];

			menu.searchTerm = menu.searchDiv.value.toLowerCase().replace(/ /g, "");

			if (menu.searchTerm.length == 0) { // no search
				// add all nodes back
				for (const op of menu.optionList) {
					menu.listDiv.append(op.mainDiv);
				}
				menu.matchedList = menu.optionList.slice();
				menu.matchCount = menu.matchedList.length;
			} else { // search term exists
				menu.matchCount = 0;
				for (const op of menu.optionList) {
					const name = op.searchName;
					if (name.startsWith(menu.searchTerm)) {
						if (name.length == menu.searchTerm.length) { // exact name match
							valid[0].push(op);
						} else { // prefix name match
							valid[2].push(op);
						}
					} else {
						for (const tag of op.tags) {
							if (tag.startsWith(menu.searchTerm)) {
								if (tag.length == menu.searchTerm.length) { // exact tag match
									valid[1].push(op);
								} else { // prefix tag match
									valid[3].push(op);
								}
								break; // breaks out of tags loop, not option loop
							}
						}
					}
				}
				for (const lst of valid) {
					for (const op of lst) {
						menu.matchCount++;
						menu.matchedList.push(op);
						menu.containerDiv.append(op.mainDiv);
					}
				}
			}
			// reset selected to the first
			for (const op of menu.matchedList) {
				op.deselect();
			}
			if (menu.matchCount) {
				menu.selectedIndex = 0;
				menu.matchedList[menu.selectedIndex].select();
			}
		}

		this.listDiv = document.createElement("div");
		this.listDiv.className = "menu";
		this.containerDiv.append(this.listDiv);

		for(const option of this.optionList){
			const div = option.createDiv();
			this.listDiv.append(div);
			this.options[div] = option;
			this.matchedList.push(option);
		}
		this.matchCount = this.optionList.length;

		if(this.optionList.length){
			this.optionList[0].select();
		}

		return this.containerDiv;
	}

	addOption(option){
		option.menu = this;
		this.optionList.push(option);
	}
}

class NMenuOption {
	constructor(name) {
		this.name = name;
		this.searchName = name.toLowerCase().replace(' ', "");
		this.action = Function.prototype;
		this.tags = [];
		this.mainDiv;
		this.menu;
	}

	setTags(...tags){
		this.tags = tags;
	}

	select(){
		this.mainDiv.setAttribute("selected", true);
	}

	deselect(){
		this.mainDiv.removeAttribute("selected");
	}

	createDiv(){
		const op = this;
		this.mainDiv = document.createElement("div");
		this.mainDiv.className = "menuitem";
		this.mainDiv.innerHTML = this.name;
		this.mainDiv.onclick = function(e) {
			if(op.action(e) != true){
				op.menu.board.closeMenu();
			}
		}
		return this.mainDiv;
	}
}