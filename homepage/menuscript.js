$(function() {
	const boardList = JSON.parse(localStorage.getItem("boards"));
	const boardGrid = $("#boardgrid").get(0);

	const tileList = $("#newlist").get(0);

	if(localStorage.getItem("toOpen")){
		const reopen = document.createElement("li");
		reopen.className = "ui-state-default tile new";
		reopen.innerHTML = "Re-open";
		reopen.style.backgroundColor = "#b9b9b9";
		reopen.style.color = "#545454";
		reopen.style.borderColor = "#3b3b3b";
		reopen.onclick = function(e) {
			window.open("../boards/boardenv.html", "_self");
		}
		document.getElementById("sec1").append(reopen);
	}

	const newBoard_code = document.createElement("li");
	newBoard_code.className = "ui-state-default tile new";
	newBoard_code.innerHTML = "Code";
	newBoard_code.style.backgroundColor = "#23c92f";
	newBoard_code.style.color = "#bdffbf";
	newBoard_code.style.borderColor = "#0a8822";
	newBoard_code.onclick = function(e) {
		localStorage.setItem("initialPreset", "code");
		window.open("../boards/boardenv.html", "_self");
	}
	tileList.append(newBoard_code);

	const newBoard_regex = document.createElement("li");
	newBoard_regex.className = "ui-state-default tile new";
	newBoard_regex.innerHTML = "Regex (n/a)";
	newBoard_regex.style.backgroundColor = "#fac438";
	newBoard_regex.style.color = "#faffa2";
	newBoard_regex.style.borderColor = "#e89e20";
	newBoard_regex.onclick = function(e) {
		localStorage.setItem("initialPreset", "regex");
		window.open("../boards/boardenv.html", "_self");
	}
	tileList.append(newBoard_regex);

	const newBoard_shader = document.createElement("li");
	newBoard_shader.className = "ui-state-default tile new";
	newBoard_shader.innerHTML = "Shader";
	newBoard_shader.style.backgroundColor = "#9338fa";
	newBoard_shader.style.color = "#d3ccff";
	newBoard_shader.style.borderColor = "#5c0a88";
	newBoard_shader.onclick = function(e) {
		localStorage.setItem("initialPreset", "shader");
		window.open("../boards/boardenv.html", "_self");
	}
	tileList.append(newBoard_shader);

	const newBoard_debug = document.createElement("li");
	newBoard_debug.className = "ui-state-default tile new";
	newBoard_debug.innerHTML = "Debug (unstable!)";
	newBoard_debug.style.backgroundColor = "#fa3838";
	newBoard_debug.style.color = "#fad896";
	newBoard_debug.style.borderColor = "#880a0a";
	newBoard_debug.onclick = function(e) {
		localStorage.setItem("initialPreset", "debug");
		window.open("../boards/boardenv.html", "_self");
	}
	tileList.append(newBoard_debug);

	for (const boardn in boardList) {
		const li = document.createElement("li");
		li.className = "ui-state-default tile";
		li.innerHTML = boardn;
		boardGrid.append(li);
		li.onclick = function(e) {
			localStorage.setItem("toOpen", JSON.stringify([boardn]));
			window.open("../boards/boardenv.html", "_self");
		}
	}
});