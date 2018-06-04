class Var {
	constructor(type) {
		this.type = type;
		type.construct(this);
	}
}