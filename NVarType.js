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
		this.construct = function(nvar) {
			vt.addValues(nvar);
			for (const parent of vt.allParents) {
				parent.addValues(nvar);
			}
		};
	}

	isChildOf(parent) {
		return this.allParents.has(parent);
	}

	isA(parent) {
		return this == parent || this.isChildOf(parent);
	}
}
const NObject = new NVarType("Object", function(nvar){}, "#afafaf");
const NExecution = new NVarType("Execution", function(nvar){}, "#404040");
const NInteger = new NVarType("Integer", function(nvar){nvar.int = 0;}, "#64d4ed", NObject);
const NDouble = new NVarType("Double", function(nvar){nvar.double = 0.0;}, "#7bed3e", NObject);
const NBoolean = new NVarType("Boolean", function(nvar){nvar.boolean = false;}, "#ed2121", NObject);
const NString = new NVarType("String", function(nvar){nvar.string = "";}, "#e963c0", NObject);