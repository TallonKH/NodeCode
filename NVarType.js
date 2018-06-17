class NVarType {
	constructor(name, addValues, color, ...parents) {
		this.name = name;
		this.addValues = addValues;
		this.color = color;
		this.parents = new Set(parents);

		this.allParents = []
		for (const parent of parents) {
			this.allParents.push(parent, ...parent.allParents);
		}
		this.allParents = new Set(this.allParents);

		const vt = this;
		this.construct = function(nvar={}) {
			vt.addValues(nvar);
			for (const parent of vt.allParents) {
				parent.addValues(nvar);
			}
			nvar["nclass"] = this;
			return nvar;
		};
	}

	isChildOf(parent) {
		return this.allParents.has(parent);
	}

	isA(parent) {
		return this == parent || this.isChildOf(parent);
	}

	areAny(children){
		for(const c of children){
			if(c.isA(this)){
				return true;
			}
		}
		return false;
	}
}
getValidInTypes = function(ins, outs) {
	const valid = new Set();
	for(const o of outs){
		for(const i of ins){
			if(o.isA(i)){
				valid.add(i);
				break;
			}
		}
	}
	return Array.from(c);
}

getValidOutTypes = function(ins, outs) {
	const valid = new Set();
	for(const i of ins){
		for(const o of outs){
			if(o.isA(i)){
				valid.add(o);
				break;
			}
		}
	}
	return Array.from(c);
}

double = function(v){
	if(v.nclass.isA(NDouble)){
		return v.double;
	}
	if(v.nclass.isA(NInteger)){
		return v.int;
	}
	console.log(v.name + " is NaN!");
	return null;
}

boolean = function(v){
	for(const key in v){
		if(v[key]){
			return true;
		}
	}
	return false;
}

const NObject = new NVarType("Object", function(nvar){}, "#8c8c8c");
const NExecution = new NVarType("Execution", function(nvar){}, "#404040");
const NInteger = new NVarType("Integer", function(nvar){nvar.int = 0;}, "#64d4ed", NObject);
const NDouble = new NVarType("Double", function(nvar){nvar.double = 0.0;}, "#7bed3e", NObject);
const NBoolean = new NVarType("Boolean", function(nvar){nvar.boolean = false;}, "#ed2121", NObject);
const NString = new NVarType("String", function(nvar){nvar.string = "";}, "#e963c0", NObject);