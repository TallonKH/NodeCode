let mainTabListDiv;
let mainTabDiv;
let canvases = [];
let canvasCount = 0;
$(function() {
	mainTabListDiv = document.getElementById("maintablist");
	mainTabDiv = document.getElementById("maintabs");
	let cvA = newTCanvas("TEST A");
	let cvB = newTCanvas("TEST B");
	let cvC = newTCanvas("TEST C");

	cvA.addNode(StringNode);
	cvA.addNode(CommentNode);
});

function newTCanvas(name){
	const cv = new TCanvas(name);
	mainTabDiv.append(cv.createPaneDiv());
	mainTabListDiv.append(cv.createTabDiv());
	$(".tabs").tabs("refresh");
	canvases.push(cv);
	cv.fixSize();
	return cv;
}