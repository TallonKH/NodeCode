// TODO 4DD UNDO FUNCT1ON4L1TY TO 3D1T1NG V4LU3S

varTypes = {};
class NVarType {
	constructor(name, addValues, color, ...parents) {
		varTypes[name] = this;
		this.name = name;
		this.multiInput = false;
		this.multiOutput = true;
		this.addValues = addValues;
		this.color = color;
		this.parents = new Set(parents);
		this.edit = null;
		this.allParents = [];
		for (const parent of parents) {
			this.allParents.push(parent, ...parent.allParents);
		}
		this.allParents = new Set(this.allParents);

		const vt = this;
		this.construct = function(nvar = {}) {
			vt.addValues(nvar);
			for (const parent of vt.allParents) {
				parent.addValues(nvar);
			}
			nvar["nclass"] = this.name;
			return nvar;
		};
	}

	setMultiInput(b) {
		this.multiInput = b;
	}

	setMultiOutput(b) {
		this.multiOutput = b;
	}

	isChildOf(parent) {
		return this.allParents.has(parent);
	}

	isA(parent) {
		return this == parent || this.isChildOf(parent);
	}

	areAny(children) {
		for (const c of children) {
			if (c.isA(this)) {
				return true;
			}
		}
		return false;
	}
}
getValidInTypes = function(ins, outs) {
	const valid = new Set();
	for (const o of outs) {
		for (const i of ins) {
			if (o.isA(i)) {
				valid.add(i);
				break;
			}
		}
	}
	return Array.from(c);
}

getValidOutTypes = function(ins, outs) {
	const valid = new Set();
	for (const i of ins) {
		for (const o of outs) {
			if (o.isA(i)) {
				valid.add(o);
				break;
			}
		}
	}
	return Array.from(c);
}

double = function(v) {
	if(v.double !== undefined){
		return v.double;
	}

	if(v.int !== undefined){
		return v.int;
	}

	console.log(v.name + " is not a number!");
	return null;
}

boolean = function(v) {
	for (const key in v) {
		if (v[key]) {
			return true;
		}
	}
	return false;
}

const NObject = new NVarType("Object", function(nvar) {}, "#8c8c8c");
const NComment = new NVarType("Comment", function(nvar) {}, "#bababa");
NComment.setMultiInput(true);
const NExecution = new NVarType("Execution", function(nvar) {}, "#404040");
NExecution.setMultiInput(true);
NExecution.setMultiOutput(false);

const NInteger = new NVarType("Integer", function(nvar) {
	nvar.int = 0;
}, "#64d4ed", NObject);
NInteger.edit = function(nvar) {
	const inp = document.createElement("input");
	inp.className = "pinval integer";
	inp.type = "number";
	inp.value = nvar.int;
	inp.step = "1";
	inp.onfocusout = function(e) {
		nvar.int = parseInt(inp.value) || 0;
	}
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 13: // ENTER
				nvar.int = parseInt(inp.value) || 0;
				inp.blur();
				break;
			case 27: // ESC
				inp.value = nvar.int;
				inp.blur();
				break;
		}
	}
	return inp;
};
NInteger.changeVal = function(inp, nval) {
	inp.value = nval.int;
}

const NDouble = new NVarType("Double", function(nvar) {
	nvar.double = 0.0;
}, "#7bed3e", NObject);
NDouble.edit = function(nvar) {
	const inp = document.createElement("input");
	inp.className = "pinval double";
	inp.type = "number";
	inp.value = nvar.double;
	inp.onfocusout = function(e) {
		nvar.double = parseFloat(inp.value) || 0.0;
	}
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 13: // ENTER
				nvar.double = parseFloat(inp.value) || 0.0;
				inp.blur();
				break;
			case 27: // ESC
				inp.value = nvar.double;
				inp.blur();
				break;
		}
	}
	return inp;
};
NDouble.changeVal = function(inp, nval) {
	inp.value = nval.double;
}

const NBoolean = new NVarType("Boolean", function(nvar) {
	nvar.boolean = false;
}, "#ed2121", NObject);
NBoolean.edit = function(nvar) {
	const cnt = document.createElement("div");
	cnt.className = "checkbox boolean container";
	const id = (~~(Math.random() * 8388607)).toString();

	const inp = document.createElement("input");
	inp.className = "checkbox boolean";
	inp.id = id;
	inp.type = "checkbox";
	if (nvar.boolean) {
		inp.checked = true;
	}
	cnt.append(inp);

	const lbl = document.createElement("label");
	lbl.className = "checkbox boolean";
	lbl.htmlFor = id;
	cnt.append(lbl);

	inp.oninput = function(e) {
		console.log(inp.checked);
		nvar.boolean = inp.checked;
	}

	return cnt;
};
NBoolean.changeVal = function(inp, nval) {
	$(inp).find("input").get(0).checked = nval.boolean;
}

const NString = new NVarType("String", function(nvar) {
	nvar.string = "";
}, "#e963c0", NObject);
NString.edit = function(nvar) {
	const inp = document.createElement("input");
	inp.className = "pinval string";
	inp.type = "text";
	inp.value = nvar.string;
	inp.onfocusout = function(e) {
		nvar.string = inp.value;
	}
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 13: // ENTER
				nvar.string = inp.value;
				inp.blur();
				break;
			case 27: // ESC
				inp.value = nvar.string;
				inp.blur();
				break;
		}
	}
	return inp;
};
NString.changeVal = function(inp, nval) {
	inp.value = nval.string;
}