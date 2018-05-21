$(function() {
	{
		let tabs = $(".tabs").tabs();
		tabs.find(".ui-tabs-nav").sortable({
			axis: "x",
			stop: function() {
				tabs.tabs("refresh");
			}
		});
	}
	// JQuery Draggable
	$(".draggable").draggable({
		containment: "parent",
		scroll: false
	});

	window.onresize = fixAllCanvasSizes;
});