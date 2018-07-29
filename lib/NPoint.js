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

	round(n = 0) {
		if (n) {
			const factor = Math.pow(10, n);
			return new NPoint(Math.round(this.x * factor) / factor, Math.round(this.y * factor) / factor);
		} else {
			return new NPoint(Math.round(this.x), Math.round(this.y));
		}
	}

	copy() {
		return new NPoint(this.x, this.y);
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