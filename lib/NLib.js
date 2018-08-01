const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const numbers = new Set(["0","1","2","3","4","5","6","7","8","9"]);

allEqual = function(...ls) {
	const a = ls[0];
	for (const b of ls) {
		if (a != b) {
			return false;
		}
	}
	return true;
}

divPos = function(div) {
	const rect = div.getBoundingClientRect();
	return new NPoint(rect.left, rect.top);
}

divCenter = function(div) {
	const rect = div.getBoundingClientRect();
	return new NPoint((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
}

avgHex = function(...colors) {
	let avgr = 0;
	let avgg = 0;
	let avgb = 0;
	for (const color of colors) {
		avgr += parseInt(color.substring(1, 3), 16);
		avgg += parseInt(color.substring(3, 5), 16);
		avgb += parseInt(color.substring(5, 7), 16);
	}
	avgr = Math.max(Math.trunc(avgr / colors.length - 20), 0).toString(16);
	avgg = Math.max(Math.trunc(avgg / colors.length - 20), 0).toString(16);
	avgb = Math.max(Math.trunc(avgb / colors.length - 20), 0).toString(16);
	avgr = ("00" + avgr).substr(-2, 2);
	avgg = ("00" + avgg).substr(-2, 2);
	avgb = ("00" + avgb).substr(-2, 2);
	return "#" + avgr + avgg + avgb;
}

darkenHex = function(color, amt) {
	let r = parseInt(color.substring(1, 3), 16);
	let g = parseInt(color.substring(3, 5), 16);
	let b = parseInt(color.substring(5, 7), 16);
	r = Math.max(Math.trunc(r) - amt, 0).toString(16);
	g = Math.max(Math.trunc(g) - amt, 0).toString(16);
	b = Math.max(Math.trunc(b) - amt, 0).toString(16);
	r = ("00" + r).substr(-2, 2);
	g = ("00" + g).substr(-2, 2);
	b = ("00" + b).substr(-2, 2);
	return "#" + r + g + b;
}

pointOnBezier = function(p1, p2, p3, p4, t) {
	const omt = 1 - t;
	const omt2 = omt * omt;
	const t2 = t * t;

	const coeff1 = omt2 * omt;
	const coeff2 = 3 * t * omt2;
	const coeff3 = 3 * t2 * omt;
	const coeff4 = t2 * t;

	const curveX = p1.x * coeff1 + p2.x * coeff2 + p3.x * coeff3 + p4.x * coeff4;
	const curveY = p1.y * coeff1 + p2.y * coeff2 + p3.y * coeff3 + p4.y * coeff4;
	return new NPoint(curveX, curveY);
}

shallowStringify = function(obj, maxDepth, depth) {
	const type = typeof obj;
	switch (type) {
		case "string":
			return obj;
		case "number":
			return obj.toString();
		default:
			if (depth < maxDepth) {
				return "{" +
					Object.keys(obj).map(
						key => (
							shallowStringify(key, maxDepth, depth + 1) + ":" + shallowStringify(obj[key], maxDepth, depth + 1)
						)
					).join(", ") + "}";
			} else {
				return type;
			}
	}
}

idRepl = function(ids, actual) {
	if (actual.toString() in ids) {
		return ids[actual];
	}
	const replace = ~~(Math.random() * 8388607);
	ids[actual] = replace;
	return replace;
}

scrambleIDs = function(data) {
	const nodeids = {};
	const pinids = {};
	const nodes = data.nodes;
	for (const node of nodes) {
		node.id = idRepl(nodeids, node.id);
		for (let i = 0, l = node.ipids.length; i < l; i++) {
			node.ipids[i] = idRepl(pinids, node.ipids[i]);
		}
		for (let i = 0, l = node.opids.length; i < l; i++) {
			node.opids[i] = idRepl(pinids, node.opids[i]);
		}
	}
	const links = data.links;
	for (const link of links) {
		link[0] = idRepl(pinids, link[0]);
		link[1] = idRepl(pinids, link[1]);
	}
	return data;
}

// Thanks to stackoverflow user 4815056 for this function
function getOS() {
	var userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
		os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'Mac';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'Windows';
	} else if (/Android/.test(userAgent)) {
		os = 'Android';
	} else if (!os && /Linux/.test(platform)) {
		os = 'Linux';
	}

	return os;
}

function clearObj(obj) {
	for (const key in obj) {
		delete obj[key];
	}
}

function downloadFile(filename, text) {
	const link = document.createElement('a');
	link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	link.setAttribute('download', filename);

	link.style.display = 'none';
	document.body.appendChild(link);

	link.click();

	link.remove();
}

function currentTimeMillis() {
	return (new Date()).getTime();
}

function fstr(num){
	const s = num.toString();
	if(num % 1 == 0){
		return s + ".0";
	}
	return s;
}

function makeSelectInput(...options){
	const selectd = document.createElement("select");
	selectd.ops = [];
	for(const i in options){
		const optiond = document.createElement("option");
		const name = options[i];
		optiond.value = i.toString();
		optiond.innerHTML = name;
		selectd.append(optiond);
		selectd.ops.push(optiond);
	}
	return selectd
}