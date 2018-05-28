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
	// window.onresize = fixAllCanvasSizes;
});