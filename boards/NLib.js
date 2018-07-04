class NPoint {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return "(" + this.x + ", " + this.y + ")";
	}

	addp(other) {
		return new NPoint(this.x + other.x, this.y + other.y);
	}

	subtractp(other) {
		return new NPoint(this.x - other.x, this.y - other.y);
	}

	multiplyp(other) {
		return new NPoint(this.x * other.x, this.y * other.y);
	}

	dividep(other) {
		return new NPoint(this.x / other.x, this.y / other.y);
	}

	add1(other) {
		return new NPoint(this.x + other, this.y + other);
	}

	subtract1(other) {
		return new NPoint(this.x - other, this.y - other);
	}

	multiply1(other) {
		return new NPoint(this.x * other, this.y * other);
	}

	divide1(other) {
		return new NPoint(this.x / other, this.y / other);
	}

	add2(x, y) {
		return new NPoint(this.x + x, this.y + y);
	}

	subtract2(x, y) {
		return new NPoint(this.x - x, this.y - y);
	}

	multiply2(x, y) {
		return new NPoint(this.x * x, this.y * y);
	}

	divide2(x, y) {
		return new NPoint(this.x / x, this.y / y);
	}

	floor() {
		return new NPoint(Math.floor(this.x), Math.floor(this.y));
	}

	addComponents() {
		return this.x + this.y;
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt(this.lengthSquared());
	}

	round(n) {
		const factor = Math.pow(10, n);
		return new NPoint(Math.round(this.x * factor) / factor, Math.round(this.y * factor) / factor);
	}

	static same(...pts) {
		const x = pts[0].x;
		const y = pts[0].y;
		for (let i = 1, l = pts.length; i < l; i++) {
			const pt = pts[i];
			if (x != pt.x || y != pt.y) {
				return false;
			}
		}
		return true;
	}

	static min(...pts) {
		return new NPoint(Math.min(...pts.map(pt => pt.x)), Math.min(...pts.map(pt => pt.y)));
	}

	static max(...pts) {
		return new NPoint(Math.max(...pts.map(pt => pt.x)), Math.max(...pts.map(pt => pt.y)));
	}

	static crossProduct(a, b) {
		return a.x * b.y - a.y * b.x;
	}

	static segIntersect(a1, a2, b1, b2) {
		const dxa = (a2.x - a1.x);
		const dxb = (b2.x - b1.x);

		if (dxa == 0 && dxb == 0) {
			return false;
		}

		const minA = NPoint.min(a1, a2);
		const maxA = NPoint.max(a1, a2);
		const minB = NPoint.min(b1, b2);
		const maxB = NPoint.max(b1, b2);

		if (dxa == 0) {
			if (minB.x > a1.x || maxB.x < a1.x) {
				return false;
			}
			const mb = (b2.y - b1.y) / dxb;
			const bb = b1.y - (mb * b1.x);
			const interY = (mb * a1.x) + bb
			return interY >= minA.y && interY <= maxA.y && interY >= minB.y && interY <= maxB.y;
		} else if (dxb == 0) {
			if (minA.x > b1.x || maxA.x < b1.x) {
				return false;
			}
			const ma = (a2.y - a1.y) / dxa;
			const ba = a1.y - (ma * a1.x);
			const interY = (ma * b1.x) + ba
			return interY >= minA.y && interY <= maxA.y && interY >= minB.y && interY <= maxB.y;
		} else {
			const ma = (a2.y - a1.y) / dxa;
			const ba = a1.y - (ma * a1.x);

			const mb = (b2.y - b1.y) / dxb;
			const bb = b1.y - (mb * b1.x);

			if (ma == mb) {
				return false;
			}

			const interX = (bb - ba) / (ma - mb);
			const interY = (ma * interX) + ba;
			return interX >= minA.x && interX <= maxA.x && interY >= minA.y && interY <= maxA.y && interX >= minB.x && interX <= maxB.x && interY >= minB.y && interY <= maxB.y;
		}
	}
}

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

function downloadFile(filename, text) {
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  link.setAttribute('download', filename);

  link.style.display = 'none';
  document.body.appendChild(link);

  link.click();

  link.remove();
}

function currentTimeMillis(){
	return (new Date()).getTime();
}