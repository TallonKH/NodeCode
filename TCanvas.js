class TCanvas {
	constructor(name) {
		canvasCount += 1;
		this.name = name;
		this.id = "maintab-" + canvasCount;
		this.zoomCounter = 0;
		this.zoomAmount = 0;
		this.viewportPos = new Point(0,0);

		this.tabDiv = null;
		this.paneDiv = null;
		this.canvasDiv = null;

		this.nodes = {};
		this.nodesPendingCreate = {};
		this.nodesPendingDelete = {};
	}



	changeZoom(change, center){
		const prevZoom = this.zoomAmount;
		this.zoomCounter -= change;
		this.zoomCounter = Math.max(Math.min(zoomCounter, 1000), -400);
		this.zoomAmount = 1 + this.zoomCounter/500;
		diff = (this.zoomAmount - prevZoom);
		this.viewportPos = this.viewportPos.addp(center.addp(this.viewportPos).divide1(prevZoom).multiply1(diff))
	}

	fixSize() {
		const h = window.innerHeight - 90;
		const w = window.innerWidth - 52;
		console.log(w, h);

		//TODO M4K3 TH1S DO SOM3TH1NG
		this.paneDiv.width = w;
		this.paneDiv.height = h;
	}

	createTabDiv() {
		if(this.tabDiv != null){
			return null;
		}

		canvasCount += 1;

		this.tabDiv = document.createElement("li");
		this.tabDiv.className = "tab";

		const link = document.createElement("a");
		link.innerHTML = this.name;
		link.setAttribute("href",  "#" + this.id);

		this.tabDiv.append(link);
		return this.tabDiv;
	}

	createPaneDiv(){
		if(this.paneDiv != null){
			return null;
		}

		this.paneDiv = document.createElement("div");
		this.paneDiv.className = "tabpane";
		this.paneDiv.id = this.id;
		let cv = this;
		this.paneDiv.addEventListener("mousewheel", function(event) {
			console.log(cv.name);
			if (event.ctrlKey) {
				// changeZoom(event.deltaY, windowMousePos);
			} else {
				// viewportPos = viewportPos.add2(event.deltaX, event.deltaY);
			}
			event.preventDefault();
			return false;
		}, false);

		this.canvasDiv = document.createElement("div");
		this.canvasDiv.className = "tcanvas";
		this.paneDiv.append(this.canvasDiv);

		return this.paneDiv;
	}

	addNode(type){
		const node = new type(this);
		this.canvasDiv.append(node.createNodeDiv());
		return node;
	}
}

function fixAllCanvasSizes(){
	for(cv of canvases){
		cv.fixSize();
	}
}