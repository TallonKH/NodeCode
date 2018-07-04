$(function() {
	const boardList = JSON.parse(localStorage.getItem("boards"));
	const boardGrid = $("#boardgrid").get(0);

	const tileList = $("#newlist").get(0);

	const newBoard_code = document.createElement("li");
	newBoard_code.className = "ui-state-default tile new";
	newBoard_code.innerHTML = "Code";
	newBoard_code.style.backgroundColor = "#23c92f";
	newBoard_code.style.color = "#bdffbf";
	newBoard_code.style.borderColor = "#0a8822";
	newBoard_code.onclick = function(e){
		window.open('../boards/boardenv.html?preset=code');
	}
	tileList.append(newBoard_code);

	const newBoard_regex = document.createElement("li");
	newBoard_regex.className = "ui-state-default tile new";
	newBoard_regex.innerHTML = "Regex (n/a)";
	newBoard_regex.style.backgroundColor = "#fac438";
	newBoard_regex.style.color = "#faffa2";
	newBoard_regex.style.borderColor = "#e89e20";
	newBoard_regex.onclick = function(e){
		window.open('../boards/boardenv.html?preset=regex');
	}
	tileList.append(newBoard_regex);

	const newBoard_shader = document.createElement("li");
	newBoard_shader.className = "ui-state-default tile new";
	newBoard_shader.innerHTML = "Shader (n/a)";
	newBoard_shader.style.backgroundColor = "#9338fa";
	newBoard_shader.style.color = "#d3ccff";
	newBoard_shader.style.borderColor = "#5c0a88";
	newBoard_shader.onclick = function(e){
		window.open('../boards/boardenv.html?preset=shader');
	}
	tileList.append(newBoard_shader);

	for (const boardn in boardList) {
		const li = document.createElement("li");
		li.className = "ui-state-default tile";
		li.innerHTML = boardn;
		boardGrid.append(li);
		li.onclick = function(e){
			window.open('../boards/boardenv.html?open=' + JSON.stringify([boardn]));
		}
	}
});