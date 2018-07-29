//TODO F1X ONFOCUSOUT NOT DO1NG 4NYTH1NG

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
NInteger.edit = function(nvar, brd) {
	const inp = document.createElement("input");
	inp.className = "pinval integer";
	inp.type = "number";
	inp.value = nvar.int;
	inp.step = "1";

	const changeNVal = function(){
		const val = parseInt(inp.value) || 0;
		if(val != nvar.int){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"int":val}, null, v => inp.value = v.int));
			nvar.int = val;
		}
	}

	inp.onfocusout = changeNVal;
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNVal();
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
NDouble.edit = function(nvar, brd) {
	const inp = document.createElement("input");
	inp.className = "pinval double";
	inp.type = "number";
	inp.value = nvar.double;

	const changeNVal = function(){
		const val = parseFloat(inp.value) || 0.0;
		if(val != nvar.double){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"double":val}, null, v => inp.value = v.double));
			nvar.double = val;
		}
	}

	inp.onfocusout = changeNVal();
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNVal();
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
NBoolean.edit = function(nvar, brd) {
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

	const changeNVal = function(){
		const val = inp.checked;
		if(val != nvar.boolean){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"boolean":val}, null, v => inp.checked = v.boolean));
			nvar.boolean = val;
		}
	}

	inp.oninput = function(e) {
		changeNVal();
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
NString.edit = function(nvar, brd) {
	const inp = document.createElement("input");
	inp.className = "pinval string";
	inp.type = "text";
	inp.value = nvar.string;

	const changeNVal = function(){
		const val = inp.value;
		if(val != nvar.string){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"string":val}, null, v => inp.value = v.string));
			nvar.string = val;
		}
	}

	inp.onfocusout = changeNVal;
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNVal();
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

const NVector1 = new NVarType("Vec1", function(nvar) {
	nvar.float = 0.0;
}, "#fc6d6d", NObject);
NVector1.edit = function(nvar, brd) {
	const inp = document.createElement("input");
	inp.className = "pinval vec1";
	inp.type = "number";
	inp.value = nvar.float;

	const changeNVal = function(){
		const val = parseFloat(inp.value) || 0.0;
		if(val != nvar.float){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"float":val}, null, v => inp.value = v.float));
			nvar.float = val;
		}
	}

	inp.onfocusout = changeNVal();
	inp.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNVal();
				inp.blur();
				break;
			case 27: // ESC
				inp.value = nvar.float;
				inp.blur();
				break;
		}
	}
	return inp;
};
NVector1.changeVal = function(inp, nval) {
	inp.value = nval.float;
}

const NVector2 = new NVarType("Vec2", function(nvar) {
	nvar.x = 0.0;
	nvar.y = 0.0;
}, "#99eb7c", NObject);
NVector2.edit = function(nvar, brd) {
	const wrapper = document.createElement("div");
	wrapper.className = "vec2";

	const inp1 = document.createElement("input");
	inp1.className = "pinval vec2 vec2x";
	inp1.type = "number";
	inp1.value = nvar.x;
	wrapper.append(inp1);

	const inp2 = document.createElement("input");
	inp2.className = "pinval vec2 vec2y";
	inp2.type = "number";
	inp2.value = nvar.y;
	wrapper.append(inp2);

	const changeNValX = function(){
		const val = parseFloat(inp1.value) || 0.0;
		if(val != nvar.x){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"x":val}, null, v => inp1.value = v.x));
			nvar.x = val;
		}
	}

	const changeNValY = function(){
		const val = parseFloat(inp2.value) || 0.0;
		if(val != nvar.y){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"y":val}, null, v => inp2.value = v.y));
			nvar.y = val;
		}
	}

	inp1.onfocusout = changeNValX();
	inp1.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNValX();
				inp1.blur();
				break;
			case 27: // ESC
				inp1.value = nvar.x;
				inp1.blur();
				break;
		}
	}

	inp2.onfocusout = changeNValY();
	inp2.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNValY();
				inp2.blur();
				break;
			case 27: // ESC
				inp2.value = nvar.y;
				inp2.blur();
				break;
		}
	}
	return wrapper;
};
NVector2.changeVal = function(inp, nval) {
	$(inp).find(".vec2x").get(0).value = nval.x;
	$(inp).find(".vec2y").get(0).value = nval.y;
}

const NVector3 = new NVarType("Vec3", function(nvar) {
	nvar.x = 0.0;
	nvar.y = 0.0;
	nvar.z = 0.0;
}, "#6f7df2", NObject);
NVector3.edit = function(nvar, brd) {
	const wrapper = document.createElement("div");
	wrapper.className = "vec3";

	const inp1 = document.createElement("input");
	inp1.className = "pinval vec3 vec3x";
	inp1.type = "number";
	inp1.value = nvar.x;
	wrapper.append(inp1);

	const inp2 = document.createElement("input");
	inp2.className = "pinval vec3 vec3y";
	inp2.type = "number";
	inp2.value = nvar.y;
	wrapper.append(inp2);

	const inp3 = document.createElement("input");
	inp3.className = "pinval vec3 vec3z";
	inp3.type = "number";
	inp3.value = nvar.z;
	wrapper.append(inp3);

	const changeNValX = function(){
		const val = parseFloat(inp1.value) || 0.0;
		if(val != nvar.x){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"x":val}, null, v => inp1.value = v.x));
			nvar.x = val;
		}
	}

	const changeNValY = function(){
		const val = parseFloat(inp2.value) || 0.0;
		if(val != nvar.y){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"y":val}, null, v => inp2.value = v.y));
			nvar.y = val;
		}
	}

	const changeNValZ = function(){
		const val = parseFloat(inp3.value) || 0.0;
		if(val != nvar.z){
			brd.addAction(new ActChangeDefVal(brd, nvar, {"z":val}, null, v => inp3.value = v.z));
			nvar.z = val;
		}
	}

	inp1.onfocusout = changeNValX();
	inp1.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNValX();
				inp1.blur();
				break;
			case 27: // ESC
				inp1.value = nvar.x;
				inp1.blur();
				break;
		}
	}

	inp2.onfocusout = changeNValY();
	inp2.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNValY();
				inp2.blur();
				break;
			case 27: // ESC
				inp2.value = nvar.y;
				inp2.blur();
				break;
		}
	}

	inp3.onfocusout = changeNValZ();
	inp3.onkeydown = function(e) {
		switch (e.which) {
			case 9: // TAB
			case 13: // ENTER
				changeNValZ();
				inp3.blur();
				break;
			case 27: // ESC
				inp3.value = nvar.z;
				inp3.blur();
				break;
		}
	}
	return wrapper;
};
NVector3.changeVal = function(inp, nval) {
	$(inp).find(".vec3x").get(0).value = nval.x;
	$(inp).find(".vec3y").get(0).value = nval.y;
	$(inp).find(".vec3z").get(0).value = nval.z;
}