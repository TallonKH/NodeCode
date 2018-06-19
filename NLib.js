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

	static min(...pts) {
		return new NPoint(Math.min(...pts.map(pt => pt.x)), Math.min(...pts.map(pt => pt.y)));
	}

	static max(...pts) {
		return new NPoint(Math.max(...pts.map(pt => pt.x)), Math.max(...pts.map(pt => pt.y)));
	}
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
	return "#" + avgr + avgg + avgb;
}

darkenHex = function(color, amt) {
	let r = parseInt(color.substring(1, 3), 16);
	let g = parseInt(color.substring(3, 5), 16);
	let b = parseInt(color.substring(5, 7), 16);
	r = Math.max(Math.trunc(r) - amt, 0).toString(16);
	g = Math.max(Math.trunc(g) - amt, 0).toString(16);
	b = Math.max(Math.trunc(b) - amt, 0).toString(16);
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

slopeOnBezier = function(p1, p2, p3, p4, t) {
	const omt = 1 - t;
	const omt2 = omt * omt;
	const t2 = t * t;

	const coeff1 = -3 * omt2;
	const coeff2 = -6 * omt * t;
	const coeff3 = -3 * omt2;
	const coeff4 = -3 * t2;

	const derivX = coeff1 * p1.x + coeff2 * p2.x + coeff3 * p3.x + coeff4 * p4.x;
	const derivY = coeff1 * p1.y + coeff2 * p2.y + coeff3 * p3.y + coeff4 * p4.y;
	return new NPoint(derivX, derivY);
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