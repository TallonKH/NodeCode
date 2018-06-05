class NPoint {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
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

	min(a, b){
		return new NPoint(Math.min(a.x,b.x), Math.min(a.y,b.y));
	}

	max(a, b){
		return new NPoint(Math.max(a.x,b.x), Math.max(a.y,b.y));
	}
}

divPos = function(div){
	const rect = div.getBoundingClientRect();
	return new NPoint(rect.left, rect.top);
}

divCenter = function(div){
	const rect = div.getBoundingClientRect();
	return new NPoint((rect.left + rect.right)/2, (rect.top + rect.bottom)/2);
}

avgHex = function(...colors){
	let avgr = 0;
	let avgg = 0;
	let avgb = 0;
	for (const color of colors){
		avgr += parseInt(color.substring(1,3),16);
		avgg += parseInt(color.substring(3,5),16);
		avgb += parseInt(color.substring(5,7),16);
	}
	avgr = Math.max(Math.trunc(avgr/colors.length - 20), 0).toString(16);
	avgg = Math.max(Math.trunc(avgg/colors.length - 20), 0).toString(16);
	avgb = Math.max(Math.trunc(avgb/colors.length - 20), 0).toString(16);
	return "#" + avgr + avgg + avgb;
}

darkenHex = function(color, amt){
		let r = parseInt(color.substring(1,3),16);
		let g = parseInt(color.substring(3,5),16);
		let b = parseInt(color.substring(5,7),16);
	r = Math.max(Math.trunc(r)-amt, 0).toString(16);
	g = Math.max(Math.trunc(g)-amt, 0).toString(16);
	b = Math.max(Math.trunc(b)-amt, 0).toString(16);
	return "#" + r + g + b;
}