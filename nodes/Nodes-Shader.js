class STypeTestNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("|||");
		this.addHeader("Vector Types");
		this.addInPin(new NPin("Vec 1 In", NVector1));
		this.addInPin(new NPin("Vec 2 In", NVector2));
		this.addInPin(new NPin("Vec 3 In", NVector3));
		this.addInPin(new NPin("Vec 4 In", NVector4));
		this.addInPin(new NPin("Vec 1,2 In", NVector1, NVector2));
		this.addInPin(new NPin("Vec 1,3 In", NVector1, NVector3));
		this.addInPin(new NPin("Vec 1,4 In", NVector1, NVector4));
		this.addInPin(new NPin("Vec 2,3 In", NVector2, NVector3));
		this.addInPin(new NPin("Vec 2,4 In", NVector2, NVector4));
		this.addInPin(new NPin("Vec 3,4 In", NVector3, NVector4));
		this.addInPin(new NPin("Vec 1,2,3 In", NVector1, NVector2, NVector3));
		this.addInPin(new NPin("Vec 1,2,4 In", NVector1, NVector2, NVector4));
		this.addInPin(new NPin("Vec 1,3,4 In", NVector1, NVector3, NVector4));
		this.addInPin(new NPin("Vec 2,3,4 In", NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Vec 1,2,3,4 In", NVector1, NVector2, NVector3, NVector4));

		this.addOutPin(new NPin("Vec 1 Out", NVector1));
		this.addOutPin(new NPin("Vec 2 Out", NVector2));
		this.addOutPin(new NPin("Vec 3 Out", NVector3));
		this.addOutPin(new NPin("Vec 4 Out", NVector4));
		this.addOutPin(new NPin("Vec 1,2 Out", NVector1, NVector2));
		this.addOutPin(new NPin("Vec 1,3 Out", NVector1, NVector3));
		this.addOutPin(new NPin("Vec 1,4 Out", NVector1, NVector4));
		this.addOutPin(new NPin("Vec 2,3 Out", NVector2, NVector3));
		this.addOutPin(new NPin("Vec 2,4 Out", NVector2, NVector4));
		this.addOutPin(new NPin("Vec 3,4 Out", NVector3, NVector4));
		this.addOutPin(new NPin("Vec 1,2,3 Out", NVector1, NVector2, NVector3));
		this.addOutPin(new NPin("Vec 1,2,4 Out", NVector1, NVector2, NVector4));
		this.addOutPin(new NPin("Vec 1,3,4 Out", NVector1, NVector3, NVector4));
		this.addOutPin(new NPin("Vec 2,3,4 Out", NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Vec 1,2,3,4 Out", NVector1, NVector2, NVector3, NVector4));

		return this.containerDiv;
	}

	static getName() {
		return "S_Types";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}
}

class SVector1Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector1.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter();
		this.customWidth = 120;
		this.customHeight = 55;
		this.inputDiv = NVector1.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec1";
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
		this.autoFocusedInput = this.inputDiv;
		this.addOutPin(new NPin("Value", NVector1));
		return this.containerDiv;
	}

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		Object.assign(this.val, data.val);
		this.inputDiv.value = this.val.float;
	}

	scompile(pin, varType, data, depth) {
		return NVector1.scompile(this.val);
	}

	static getName() {
		return "S_Vector1";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["1", "1d", "v1", "vec1", "vector1", "double", "int", "float1", "constant", "number"];
	}
}

class SVector2Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector2.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter();
		this.customHeight = 55;
		this.inputDiv = NVector2.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec2";
		this.centerDiv.append(this.inputDiv);
		this.autoFocusedInput = $(this.inputDiv).find(".vec2x").get(0);
		this.noPinfo = true;
		this.addOutPin(new NPin("Value", NVector2));
		return this.containerDiv;
	}

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		Object.assign(this.val, data.val);
		NVector2.changeVal(this.inputDiv, this.val);
	}

	scompile(pin, varType, data, depth) {
		return NVector2.scompile(this.val);
	}

	static getName() {
		return "S_Vector2";
	}

	static getOutTypes() {
		return [NVector2];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["2", "2d", "v2", "vec2", "vector2", "float2"];
	}
}

class SVector3Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector3.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter();
		this.customHeight = 55;
		this.inputDiv = NVector3.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec3";
		this.centerDiv.append(this.inputDiv);
		this.autoFocusedInput = $(this.inputDiv).find(".vec3x").get(0);
		this.noPinfo = true;
		this.addOutPin(new NPin("Value", NVector3));
		return this.containerDiv;
	}

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		Object.assign(this.val, data.val);
		NVector3.changeVal(this.inputDiv, this.val);
	}

	scompile(pin, varType, data, depth) {
		return NVector3.scompile(this.val);
	}

	static getName() {
		return "S_Vector3";
	}

	static getOutTypes() {
		return [NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["3", "3d", "v3", "vec3", "vector3", "float3", "color", "colour"];
	}
}

class SVector4Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector4.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.customHeight = 55;
		this.addCenter();
		this.inputDiv = NVector4.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec4";
		this.autoFocusedInput = $(this.inputDiv).find(".vec4x").get(0);
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
		this.addOutPin(new NPin("Value", NVector4));
		return this.containerDiv;
	}

	saveExtra(data) {
		data.val = this.val;
	}

	load(data, loadids) {
		super.load(data, loadids);
		Object.assign(this.val, data.val);
		NVector4.changeVal(this.inputDiv, this.val);
	}

	scompile(pin, varType, data, depth) {
		return NVector4.scompile(this.val);
	}

	static getName() {
		return "S_Vector4";
	}

	static getOutTypes() {
		return [NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["4", "4d", "vec4", "float4", "color", "colour"];
	}
}

class SmartVecNode1 extends NNode {
	constructor(data = null) {
		super(data);
	}

	linkedPinChangedType(self, linked, from, to) {
		self.unlink(linked, true);
		this.updateTypes();
		self.linkTo(linked);
	}

	pinLinked(self, other) {
		this.updateTypes();
	}

	pinUnlinked(self, other) {
		this.updateTypes();
	}

	updateTypes() {
		const inp = this.inpins[this.inpinOrder[0]];
		const inpl = inp.linkNum ? inp.getSingleLinked() : null;

		const outp = this.outpins[this.outpinOrder[0]];
		const outpl = outp.linkNum ? Object.values(outp.links) : null;

		let inTypes;
		let outTypes;

		if (inpl === null && outpl === null) {
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (inpl === null) {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only output is connected, outTypes can be anything
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (outpl === null) {
			// if only input is connected, inTypes can be anything
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			// narrow outTypes down to types that can be cast from the input types
			outTypes = getVecChildrenU(inpl.getTypes());
		} else {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			// THERE"S NO SUCH THING AS TOO MANY ARROW FUNCTIONS
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// narrow outTypes down to types that can be cast from the input types
			outTypes = getVecChildrenU(inpl.getTypes());
		}

		const iprev = inp.getTypes();
		if (iprev.sort().join(",") !== inTypes.sort().join(",")) {
			inp.setTypes(false, ...inTypes);
		}

		const oprev = outp.getTypes();
		if (oprev.sort().join(",") !== outTypes.sort().join(",")) {
			outp.setTypes(false, ...outTypes);
		}
	}

	getReturnType(outpin) {
		const inp = this.inpins[this.inpinOrder[0]];
		if (inp.linkNum) {
			const out = inp.getSingleLinked()
			return out.getReturnType();
		} else {
			return null;
		}
	}
}

class SmartVecNode2 extends NNode {
	constructor(data = null) {
		super(data);
	}

	linkedPinChangedType(self, linked, from, to) {
		self.unlink(linked, true);
		this.updateTypes();
		self.linkTo(linked);
	}

	pinLinked(self, other) {
		this.updateTypes();
	}

	pinUnlinked(self, other) {
		this.updateTypes();
	}

	updateTypes() {
		const inp1 = this.inpins[this.inpinOrder[0]];
		const inp2 = this.inpins[this.inpinOrder[1]];

		let inpl = [];
		if (inp1.linkNum) {
			inpl.push(inp1.getSingleLinked());
		}
		if (inp2.linkNum) {
			inpl.push(inp2.getSingleLinked());
		}
		if (!inpl.length) {
			inpl = null;
		}

		const outp = this.outpins[this.outpinOrder[0]];
		const outpl = outp.linkNum ? Object.values(outp.links) : null;

		let inTypes;
		let outTypes;

		if (inpl === null && outpl === null) {
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (inpl === null) {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only output is connected, outTypes can be anything
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (outpl === null) {
			// narrow outTypes down to types that can be cast from the input types
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only input is connected, limit inTypes to types that can be cast from acceptable out types
			inTypes = getVecParentsU(outTypes);
		} else {
			// combo of prev 2 statements
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			const t = getVecParentsU(outTypes);
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0)).filter(x => t.indexOf(x) >= 0);
		}

		const iprev = inp1.getTypes();
		if (iprev.sort().join(",") !== inTypes.sort().join(",")) {
			inp1.setTypes(false, ...inTypes);
			inp2.setTypes(false, ...inTypes);
		}

		const oprev = outp.getTypes();
		if (oprev.sort().join(",") !== outTypes.sort().join(",")) {
			outp.setTypes(false, ...outTypes);
		}
	}

	getReturnType(outpin) {
		return getHighestOrderVec([this.inpins[this.inpinOrder[0]].getReturnType(), this.inpins[this.inpinOrder[1]].getReturnType()]);
	}
}

class SmartVecNode3 extends NNode {
	constructor(data = null) {
		super(data);
	}

	linkedPinChangedType(self, linked, from, to) {
		self.unlink(linked, true);
		this.updateTypes();
		self.linkTo(linked);
	}

	pinLinked(self, other) {
		this.updateTypes();
	}

	pinUnlinked(self, other) {
		this.updateTypes();
	}

	updateTypes() {
		const inp1 = this.inpins[this.inpinOrder[0]];
		const inp2 = this.inpins[this.inpinOrder[1]];
		const inp3 = this.inpins[this.inpinOrder[2]];

		let inpl = [];
		if (inp1.linkNum) {
			inpl.push(inp1.getSingleLinked());
		}
		if (inp2.linkNum) {
			inpl.push(inp2.getSingleLinked());
		}
		if (inp3.linkNum) {
			inpl.push(inp3.getSingleLinked());
		}
		if (!inpl.length) {
			inpl = null;
		}

		const outp = this.outpins[this.outpinOrder[0]];
		const outpl = outp.linkNum ? Object.values(outp.links) : null;

		let inTypes;
		let outTypes;

		if (inpl === null && outpl === null) {
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (inpl === null) {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only output is connected, outTypes can be anything
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (outpl === null) {
			// narrow outTypes down to types that can be cast from the input types
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only input is connected, limit inTypes to types that can be cast from acceptable out types
			inTypes = getVecParentsU(outTypes);
		} else {
			// combo of prev 2 statements
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			const t = getVecParentsU(outTypes);
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0)).filter(x => t.indexOf(x) >= 0);
		}

		const iprev = inp1.getTypes();
		if (iprev.sort().join(",") !== inTypes.sort().join(",")) {
			inp1.setTypes(false, ...inTypes);
			inp2.setTypes(false, ...inTypes);
			inp3.setTypes(false, ...inTypes);
		}

		const oprev = outp.getTypes();
		if (oprev.sort().join(",") !== outTypes.sort().join(",")) {
			outp.setTypes(false, ...outTypes);
		}
	}

	getReturnType(outpin) {
		return getHighestOrderVec([
			this.inpins[this.inpinOrder[0]].getReturnType(),
			this.inpins[this.inpinOrder[1]].getReturnType(),
			this.inpins[this.inpinOrder[2]].getReturnType()
		]);
	}
}

class SmartVecNodeN extends NNode {
	constructor(data = null) {
		super(data);
		this.inTypes = [NVector1, NVector2, NVector3, NVector4];
	}

	linkedPinChangedType(self, linked, from, to) {
		self.unlink(linked, true);
		this.updateTypes();
		self.linkTo(linked);
	}

	pinLinked(self, other) {
		this.updateTypes();
	}

	pinUnlinked(self, other) {
		this.updateTypes();
	}

	updateTypes() {
		let inpl = [];
		for (const pinn of this.inpinOrder) {
			const ipin = this.inpins[pinn];

			if (ipin.linkNum) {
				inpl.push(ipin.getSingleLinked());
			}
		}
		if (!inpl.length) {
			inpl = null;
		}

		const outp = this.outpins[this.outpinOrder[0]];
		const outpl = outp.linkNum ? Object.values(outp.links) : null;

		let inTypes;
		let outTypes;

		if (inpl === null && outpl === null) {
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (inpl === null) {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only output is connected, outTypes can be anything
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (outpl === null) {
			// narrow outTypes down to types that can be cast from the input types
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			// if only input is connected, limit inTypes to types that can be cast from acceptable out types
			inTypes = getVecParentsU(outTypes);
		} else {
			// combo of prev 2 statements
			outTypes = inpl.map(x => getVecChildrenU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0));
			const t = getVecParentsU(outTypes);
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a, b) => a.filter(x => b.indexOf(x) >= 0)).filter(x => t.indexOf(x) >= 0);
		}

		this.inTypes = inTypes;

		for (const pinn of this.inpinOrder) {
			const ipin = this.inpins[pinn];
			const prev = ipin.getTypes();
			if (prev.sort().join(",") !== inTypes.sort().join(",")) {
				ipin.setTypes(false, ...inTypes);
			}
		}
		const prev = outp.getTypes();
		if (prev.sort().join(",") !== outTypes.sort().join(",")) {
			outp.setTypes(false, ...outTypes);
		}
	}

	load(data, loadids) {
		for (let i = 2, l = data.extraIns + 2; i < l; i++) {
			this.addInPin(new NPin(alphabet[this.inpinOrder.length], NVector1, NVector2, NVector3, NVector4));
		}
		super.load(data, loadids);
	}

	saveExtra(data) {
		data.extraIns = this.inpinOrder.length - 2;
	}

	makeContextMenu(pos) {
		const menu = super.makeContextMenu(pos);
		const node = this;
		const brd = this.board;
		if (node.inpinOrder.length < 26) {
			const op = new NCtxMenuOption("Add Input");
			op.action = function(e) {
				const pin = new NPin(alphabet[node.inpinOrder.length], ...node.inTypes);
				node.addInPin(pin);
				brd.addAction(new ActAddPin(brd, pin, node.inpinOrder.length - 1));
				return false;
			}
			menu.addOption(op);
		}
		if (node.inpinOrder.length > 2) {
			const op = new NCtxMenuOption("Remove Input");
			op.action = function(e) {
				const pin = node.inpins[node.inpinOrder[node.inpinOrder.length - 1]];
				brd.addAction(new ActRemovePin(brd, pin, node.inpinOrder.length - 1));
				node.removeInPin(pin);
				node.updateTypes(null);
				return false;
			}
			menu.addOption(op);
		}

		return menu;
	}

	getReturnType(outpin) {
		return getHighestOrderVec(this.inpinOrder.map(n => this.inpins[n].getReturnType()));
	}
}

class SDisplayNode extends NNode {
	constructor(data = null) {
		super(data);
		this.canvas;
		this.gl;
	}

	createNodeDiv() {
		super.createNodeDiv();

		this.customWidth = 300;
		this.customHeight = 300;
		this.addCenter();
		this.noPinfo = true;
		const node = this;

		this.canvas = document.createElement("canvas");
		this.canvas.width = 269;
		this.canvas.height = 269;
		this.canvas.style.margin = "2px";
		this.canvas.className = "displaynode";
		this.centerDiv.append(this.canvas);
		this.canvas.onclick = function(e) {
			node.recompileCanvas();
		}

		this.addHeader("Shader Display");
		this.headerDiv.style.borderBottom = "1px solid #444444"
		this.addInPin(new NPin("Color", NVector1, NVector2, NVector3, NVector4));
		this.nodeDiv.className += " displaynode";
		this.inPinsDiv.style.borderRight = "1px solid #444444";
		return this.containerDiv;
	}

	recompileCanvas() {
		if (this.glp) {
			this.glp.delete();
			delete this.board.activeGLContexts[this.pinid]
		}
		// const res = this.inpins["Resolution"].defaultVal;
		// this.canvas.width = res.x;
		// this.canvas.height = res.y;
		const inpin = this.inpins["Color"];
		if (inpin.linkNum) {
			const link = inpin.getSingleLinked();
			const fullCompile = this.fullSCompile(inpin);
			this.glp = setupWebGLRectangle(this.canvas, fullCompile.text);
			const glp = this.glp;
			const gl = this.glp.context;
			const uniforms = {};

			for (const unfn in fullCompile.uniforms) {
				const unf = fullCompile.uniforms[unfn];
				uniforms[unfn] = Object.assign({}, unf);
				const location = gl.getUniformLocation(this.glp.program, unf.name);
				uniforms[unfn].location = location;

				if (unf.type == "sampler2D") {
					loadTexture(gl, unf.src, unf.texIndex, location, function(){
						fullCompile.pendingItems--;
						if(fullCompile.pendingItems == 0){
							glp.redraw();
						}
						return null;
					});
				}
			}
			// if nothing left to load, draw immediately
			if(!fullCompile.pendingItems){
				glp.redraw();
			}

			this.board.activeGLContexts[this.nodeid] = Object.assign({
				"uniforms": uniforms
			}, this.glp);
		}
	}

	removed() {
		if (this.glp) {
			this.glp.delete();
			delete this.board.activeGLContexts[this.nodeid];
		}
	}

	static getName() {
		return "S_Display";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["output", "preview", "display"];
	}

	makeContextMenu(pos) {
		const menu = super.makeContextMenu(pos);
		const node = this;
		const brd = this.board;

		const op = new NCtxMenuOption("Save Rendered Image");
		op.action = function(e) {
			exportTexture(node.fullSCompile(node.inpins["Color"]));
			return false;
		}
		menu.addOption(op);

		return menu;
	}
}

class SMiniDisplayNode extends NNode {
	constructor(data = null) {
		super(data);
		this.canvas;
		this.gl;
	}

	createNodeDiv() {
		super.createNodeDiv();

		this.customWidth = 150;
		this.customHeight = 150;
		this.addCenter();
		this.noPinfo = true;
		const node = this;

		this.canvas = document.createElement("canvas");
		this.canvas.width = 119;
		this.canvas.height = 119;
		this.canvas.style.margin = "2px";
		this.canvas.className = "displaynode";
		this.centerDiv.append(this.canvas);
		this.canvas.onclick = function(e) {
			node.recompileCanvas();
		}

		this.addHeader("Shader Display (Small)");
		this.headerDiv.style.borderBottom = "1px solid #444444"
		this.addInPin(new NPin("Color", NVector1, NVector2, NVector3, NVector4));
		this.nodeDiv.className += " displaynode";
		this.inPinsDiv.style.borderRight = "1px solid #444444";
		return this.containerDiv;
	}

	recompileCanvas() {
		if (this.glp) {
			this.glp.delete();
			delete this.board.activeGLContexts[this.pinid]
		}
		// const res = this.inpins["Resolution"].defaultVal;
		// this.canvas.width = res.x;
		// this.canvas.height = res.y;
		const inpin = this.inpins["Color"];
		if (inpin.linkNum) {
			const link = inpin.getSingleLinked();
			const fullCompile = this.fullSCompile(inpin);
			this.glp = setupWebGLRectangle(this.canvas, fullCompile.text);
			const glp = this.glp;
			const gl = this.glp.context;
			const uniforms = {};

			for (const unfn in fullCompile.uniforms) {
				const unf = fullCompile.uniforms[unfn];
				uniforms[unfn] = Object.assign({}, unf);
				const location = gl.getUniformLocation(this.glp.program, unf.name);
				uniforms[unfn].location = location;

				if (unf.type == "sampler2D") {
					loadTexture(gl, unf.src, unf.texIndex, location, function(){
						fullCompile.pendingItems--;
						if(fullCompile.pendingItems == 0){
							glp.redraw();
						}
						return null;
					});
				}
			}
			// if nothing left to load, draw immediately
			if(!fullCompile.pendingItems){
				glp.redraw();
			}

			this.board.activeGLContexts[this.nodeid] = Object.assign({
				"uniforms": uniforms
			}, this.glp);
		}
	}

	removed() {
		if (this.gl) {
			this.gl.delete();
			delete this.board.activeGLContexts[this.nodeid];
		}
	}

	static getName() {
		return "S_Display (Small)";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["output", "preview", "display", "mini", "small"];
	}
}

class STexturedNode extends NNode {
	load(data, loadids) {
		console.log(data.imgSrc);
		super.load(data, loadids);
	}

	saveExtra(data) {
		if (this.file) {
			data.imgSrc = this.file;
		}
	}

	static getName() {
		return "S_Texture";
	}

	static getInTypes() {
		return [NVector2];
	}

	static getOutTypes() {
		return [NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["texture", "file", "image"];
	}
}

class STextureNode extends NNode {
	constructor(data = null) {
		super(data);
		this.canvas;
		this.finput;
		this.file;
	}

	createNodeDiv() {
		super.createNodeDiv();

		this.customWidth = 175;
		this.customHeight = 150;
		this.addCenter();
		this.noPinfo = true;
		const node = this;

		this.canvas = document.createElement("img");
		this.canvas.width = 119;
		this.canvas.height = 119;
		this.canvas.style.margin = "2px";
		this.canvas.className = "displaynode";
		this.centerDiv.append(this.canvas);

		this.canvas.onclick = function(e) {
			node.finput.click(e);
		}

		this.finput = document.createElement("input");
		this.finput.type = "file";
		this.finput.accept = ".png,.jpeg,.jpg"
		this.finput.onchange = function(e) {
			node.inputChanged(node.finput.files);
		}

		this.addHeader("Texture");
		this.headerDiv.style.borderBottom = "1px solid #444444"
		this.addInPin(new NPin("UVs", NVector2));
		this.addOutPin(new NPin("Color", NVector4));
		this.nodeDiv.className += " displaynode";
		this.inPinsDiv.style.borderRight = "1px solid #444444";
		this.outPinsDiv.style.borderLeft = "1px solid #444444";
		return this.containerDiv;
	}

	inputChanged(files) {
		if (files.length) {
			const node = this;
			this.file = this.finput.files[0];
			this.canvas.file = this.file;

			const reader = new FileReader();
			reader.onload = (function(aImg) {
				return function(e) {
					aImg.src = e.target.result;
					node.fileUrl = e.target.result;
				};
			})(this.canvas);
			reader.readAsDataURL(this.file); // this is captured by the onload function
		} else {
			this.file = null;
			this.fileUrl = null;
		}
	}

	scompile(pin, varType, data, depth) {
		let texIndex = 0;
		let name = "texture0";
		while (data.uniforms[name] != null) {
			texIndex++;
			name = "texture" + texIndex.toString();
		}

		let uname = "u_texture" + texIndex.toString();
		data.pendingItems = (data.pendingItems || 0) + 1
		data.uniforms[name] = {
			"type": "sampler2D",
			"name": uname,
			"src": this.fileUrl,
			"texIndex": texIndex
		}

		return "texture2D(" + uname + ", " + this.getSCompile(this.inpins["UVs"], NVector2, data, depth) + ")";
	}

	load(data, loadids) {
		super.load(data, loadids);
	}

	saveExtra(data) {
		if (this.file) {
			data.imgSrc = this.file;
		}
	}

	static getName() {
		return "S_Texture";
	}

	static getInTypes() {
		return [NVector2];
	}

	static getOutTypes() {
		return [NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["texture", "file", "image"];
	}
}

class SComponentNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();

		this.noPinfo = true;
		this.customWidth = 210;
		this.customHeight = 75;
		this.addCenter();

		const node = this;
		const inp = new NPin("in", NVector4, NVector3, NVector2, NVector1);
		const outp = new NPin("out", NVector1);
		this.addInPin(inp);
		this.addOutPin(outp);

		this.switchboard = document.createElement("div");
		this.switchboard.className = "nodeval compselect";
		this.switchboard.style.marginTop = "12px";
		this.centerDiv.append(this.switchboard);

		const switches = [];
		this.switches = switches;
		for (let i = 0; i < 4; i++) {
			let sw;
			if (i == 0) {
				sw = makeSelectInput("x", "y", "z", "w");
				sw.adjustedVal = 1;
				sw.prevAVal = 1;
			} else {
				sw = makeSelectInput("_", "x", "y", "z", "w");
				sw.adjustedVal = 0;
				sw.prevAVal = 0;
			}
			sw.value = "0";
			sw.prevVal = "0";
			if (i > 1) {
				sw.disabled = true;
			}
			switches.push(sw);
			this.switchboard.append(sw);

			sw.onchange = function(e, silent = undefined) {
				sw.adjustedVal = (i == 0) ? (parseInt(sw.value) + 1) : parseInt(sw.value);
				if (!silent) {
					node.board.addAction(new ActChangeCompNode(this.board, node, sw, sw.prevVal, sw.value));
				}
				if (sw.adjustedVal == 0 && sw.prevAVal != 0) {
					for (let i2 = i + 1; i2 < 4; i2++) {
						const other = switches[i2];
						other.disabled = true;
						other.value = "0";
						other.adjustedVal = 0;
					}

					outp.setTypes(false, varTypes["Vec" + i.toString()]);
					for (const linkid in outp.links) {
						const otherp = outp.links[linkid];
						if (!outp.canPlugInto(otherp)) {
							outp.unlink(otherp);
						}
					}
					node.board.redraw();
				} else {
					if (sw.prevAVal == 0) {
						let i2 = i + 1;
						for (; i2 < 4; i2++) {
							const other = switches[i2];
							other.disabled = false;
							other.value = other.prevAVal.toString();
							other.adjustedVal = other.prevAVal;
							if (other.value == "0") {
								break;
							}
						}
						outp.setTypes(false, varTypes["Vec" + i2.toString()]);
						for (const linkid in outp.links) {
							const otherp = outp.links[linkid];
							if (!outp.canPlugInto(otherp)) {
								outp.unlink(otherp);
							}
						}
						node.board.redraw();
					}
				}

				if (sw.adjustedVal != sw.prevAVal) {
					inp.setTypes(false, ...[NVector4, NVector3, NVector2, NVector1].slice(0, 5 - Math.max(...switches.map(x => x.adjustedVal))));

					if (inp.linkNum) {
						const otherp = inp.getSingleLinked();
						if (!otherp.canPlugInto(inp)) {
							inp.unlink(otherp);
							node.board.redraw();
						}
					}
				}
				sw.prevAVal = sw.adjustedVal;
				sw.prevVal = sw.value;
			}
		}

		return this.containerDiv;
	}

	saveExtra(data) {
		data.options = this.switches.map(x => x.value);
		data.prevOpts = this.switches.map(x => x.prevAVal);
	}

	load(data, loadids) {
		let makedis;
		let v = 3;
		for (const i in data.options) {
			const sw = this.switches[i];
			sw.value = data.options[i];
			sw.prevAVal = data.prevOpts[i];
			sw.adjustedVal = parseInt(sw.value);
			if (i == 0) {
				sw.adjustedVal++;
			}

			sw.disabled = makedis;

			if (!makedis && sw.adjustedVal == 0) {
				v = i - 1;
				makedis = true;
			}
		}

		this.inpins["in"].setTypes(false, ...[NVector4, NVector3, NVector2, NVector1].slice(0, 5 - Math.max(...this.switches.map(x => x.adjustedVal))));
		this.outpins["out"].setTypes(false, [NVector1, NVector2, NVector3, NVector4][v]);

		super.load(data, loadids);
	}

	scompile(pin, varType, data, depth) {
		return this.getSCompile(this.inpins["in"], null, data, depth) + "." + this.switches.map(s => [null, "x", "y", "z", "w"][s.adjustedVal]).filter(x => x).join("");
	}

	static getName() {
		return "S_Components";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["component", "mask", ".x", ".y", ".z", ".a", ".xy", ".xyz", "."];
	}
}

class SBreakVec2Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Break Vec2");
		this.addCenter();
		this.neverVar = true;
		this.addInPin(new NPin("vec2", NVector2));
		this.addOutPin(new NPin("x", NVector1));
		this.addOutPin(new NPin("y", NVector1));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const ix = this.outpins["x"];
		const iy = this.outpins["y"];
		const shouldVar = ix.linkNum + iy.linkNum > 1;
		const v = this.getSCompile(this.inpins["vec2"], null, data, depth, shouldVar);
		if (pin === ix) {
			return v + ".x";
		} else {
			return v + ".y";
		}
	}

	static getName() {
		return "S_BreakVec2";
	}

	static getInTypes() {
		return [NVector2];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["break", ".x", ".y", "split", "break2"];
	}
}

class SBreakVec3Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Break Vec3");
		this.addCenter();
		this.neverVar = true;
		this.addInPin(new NPin("vec3", NVector3));
		this.addOutPin(new NPin("x", NVector1));
		this.addOutPin(new NPin("y", NVector1));
		this.addOutPin(new NPin("z", NVector1));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const ix = this.outpins["x"];
		const iy = this.outpins["y"];
		const iz = this.outpins["z"];
		const shouldVar = ix.linkNum + iy.linkNum + iz.linkNum > 1;
		const v = this.getSCompile(this.inpins["vec3"], null, data, depth, shouldVar);
		if (pin === ix) {
			return v + ".x";
		} else if (pin === iy) {
			return v + ".y";
		} else {
			return v + ".z";
		}
	}

	static getName() {
		return "S_BreakVec3";
	}

	static getInTypes() {
		return [NVector3];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["break", ".x", ".y", ".z", "split", "break3"];
	}
}

class SBreakVec4Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Break Vec4");
		this.addCenter();
		this.neverVar = true;
		this.addInPin(new NPin("vec4", NVector4));
		this.addOutPin(new NPin("x", NVector1));
		this.addOutPin(new NPin("y", NVector1));
		this.addOutPin(new NPin("z", NVector1));
		this.addOutPin(new NPin("w", NVector1));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const ix = this.outpins["x"];
		const iy = this.outpins["y"];
		const iz = this.outpins["z"];
		const iw = this.outpins["w"];
		const shouldVar = ix.linkNum + iy.linkNum + iz.linkNum + iw.linkNum > 1;
		const v = this.getSCompile(this.inpins["vec4"], null, data, depth, shouldVar);
		if (pin === ix) {
			return v + ".x";
		} else if (pin === iy) {
			return v + ".y";
		} else if (pin === iz) {
			return v + ".z";
		} else {
			return v + ".w";
		}
	}

	static getName() {
		return "S_BreakVec4";
	}

	static getInTypes() {
		return [NVector4];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["break", ".x", ".y", ".z", ".w", "split", "split vec4"];
	}
}

class SMakeVec2Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Make Vec2");
		this.addCenter();

		this.addInPin(new NPin("x", NVector1));
		this.addInPin(new NPin("y", NVector1));
		this.addOutPin(new NPin("(x,y)", NVector2));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "vec2(" +
			this.getSCompile(this.inpins["x"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["y"], null, data, depth) + ")";
	}

	static getName() {
		return "S_MakeVec2";
	}

	static getInTypes() {
		return [NVector1];
	}

	static getOutTypes() {
		return [NVector2];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["vector2", "vec2", "make", "xy", "construct", "make2"];
	}
}

class SAccumulatorNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Accumulate");
		this.addCenter();

		this.addInPin(new NPin("iteration count", NVector1));
		this.addInPin(new NPin("next value", NVector1));
		this.addOutPin(new NPin("current iteration", NVector2));
		this.addOutPin(new NPin("prev value", NVector2));
		this.addOutPin(new NPin("final output", NVector2));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
	}

	static getName() {
		return "S_Accumulate";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["for", "loop", "accumulate", "accumulator"];
	}
}

class SHSVNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("RGB to HSV");
		this.addCenter();
		this.customWidth = 200;
		this.customHeight = 75;
		this.addInPin(new NPin("RGB", NVector3));
		this.addOutPin(new NPin("HSV", NVector3));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.functions["hsv"] = {
			"code": rgb2Hsv
		};
		return "hsv(" + this.getSCompile(this.inpins["RGB"], NVector3, data, depth) + ")";
	}

	static getName() {
		return "S_HSV";
	}

	static getInTypes() {
		return [NVector3];
	}

	static getOutTypes() {
		return [NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["hsv", "hsb", "hue", "saturation", "value"];
	}

	getOutputVarName(pin) {
		return "color";
	}
}

class SRGBNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("HSV to RGB");
		this.addCenter();
		this.customWidth = 200;
		this.customHeight = 75;
		this.addInPin(new NPin("HSV", NVector3));
		this.addOutPin(new NPin("RGB", NVector3));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.functions["rgb"] = {
			"code": hsvToRgb
		};
		return "rgb(" + this.getSCompile(this.inpins["HSV"], NVector3, data, depth) + ")";
	}

	static getName() {
		return "S_RGB";
	}

	static getInTypes() {
		return [NVector3];
	}

	static getOutTypes() {
		return [NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["rgb", "red", "green", "blue"];
	}

	getOutputVarName(pin) {
		return "color";
	}
}

class SMakeVec3Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Make Vec3");
		this.addCenter();

		this.addInPin(new NPin("x", NVector1));
		this.addInPin(new NPin("y", NVector1));
		this.addInPin(new NPin("z", NVector1));
		this.addOutPin(new NPin("(x,y,z)", NVector3));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "vec3(" +
			this.getSCompile(this.inpins["x"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["y"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["z"], null, data, depth) + ")";
	}

	static getName() {
		return "S_MakeVec3";
	}

	static getInTypes() {
		return [NVector1];
	}

	static getOutTypes() {
		return [NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["vector3", "vec3", "make", "xyz", "construct", "make3"];
	}
}

class SMakeVec4Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Make Vec4");
		this.addCenter();

		this.addInPin(new NPin("x", NVector1));
		this.addInPin(new NPin("y", NVector1));
		this.addInPin(new NPin("z", NVector1));
		this.addInPin(new NPin("w", NVector1));
		this.addOutPin(new NPin("(x,y,z,w)", NVector4));

		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "vec4(" +
			this.getSCompile(this.inpins["x"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["y"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["z"], null, data, depth) + ", " +
			this.getSCompile(this.inpins["w"], null, data, depth) + ")";
	}

	static getName() {
		return "S_MakeVec4";
	}

	static getInTypes() {
		return [NVector1];
	}

	static getOutTypes() {
		return [NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["vector4", "vec4", "make", "xyzw", "construct", "make4"];
	}
}

class STexCoordNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Texture Coordinate");
		this.addCenter();
		this.neverVar = true;
		this.noPinfo = true;
		this.addOutPin(new NPin("_", NVector2));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.varying["fragTexCoord"] = {
			"name": "fragTexCoord",
			"type": "vec2"
		};
		return "fragTexCoord";
	}

	static getName() {
		return "S_Texture Coordinate";
	}

	static getOutTypes() {
		return [NVector2];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["texture coordinate", "texcoord", "uv"];
	}
}

class STimeNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Time");
		this.addCenter();
		this.customWidth = 75;
		this.neverVar = true;
		this.noPinfo = true;
		this.addOutPin(new NPin("_", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.uniforms["time"] = {
			"type": "float",
			"name": "time"
		}
		return "time";
	}

	static getName() {
		return "S_Time";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["time", "uniform"];
	}
}

class SPiNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("π");
		this.customWidth = 75;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addOutPin(new NPin("pi", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "3.1415926536";
	}

	static getName() {
		return "S_Pi";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["3.1415926536", "pi", "π"];
	}
}

class SZeroNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("0");
		this.customWidth = 75;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addOutPin(new NPin("zero", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "0.0";
	}

	static getName() {
		return "S_Zero";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["0", "00", "zero"];
	}
}

class SOneNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("1");
		this.customWidth = 75;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addOutPin(new NPin("one", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "1.0";
	}

	static getName() {
		return "S_One";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["1", "11", "one"];
	}
}

class STwoNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("2");
		this.customWidth = 75;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addOutPin(new NPin("two", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "2.0";
	}

	static getName() {
		return "S_Two";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["2", "22", "two"];
	}
}

class STauNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("τ");
		this.customWidth = 75;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addOutPin(new NPin("tau", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "6.2831853072";
	}

	static getName() {
		return "S_Tau";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["6.2831853072", "tau", "τ", "2pi", "2π"];
	}
}

class SRandNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Random Float");
		this.addCenter("⚅");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2));
		this.addOutPin(new NPin("rand", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const inp = this.inpins["in"];
		switch (inp.getReturnType().vecOrder) {
			case 1:
				data.functions["rand1"] = {
					"code": rand1
				};
				return "rand1(" + this.getSCompile(inp, NVector1, data, depth) + ")";
			case 2:
				data.functions["rand2"] = {
					"code": rand2
				};
				return "rand2(" + this.getSCompile(inp, NVector2, data, depth) + ")";
			case 3:
				break;
			case 4:
				break;
		}
	}

	static getName() {
		return "S_Random";
	}

	static getInTypes() {
		return [NVector1, NVector2];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["?", "rand", "random", "hash"];
	}

	getOutputVarName(pin) {
		return "rnd";
	}
}

class SSimplexNoiseNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Simplex Noise");
		this.addCenter();
		this.customWidth = 150;
		this.customHeight = 75;
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("noise", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const inp = this.inpins["in"];
		switch (inp.getReturnType().vecOrder) {
			case 1:
			case 2:
				data.functions["permute3"] = {
					"code": permute3
				};
				data.functions["snoise2"] = {
					"code": snoise2,
					"prereqs": ["permute3"]
				};
				return "snoise2(" + this.getSCompile(inp, NVector2, data, depth) + ")";
			case 3:
				data.functions["taylorInvSqrt4"] = {
					"code": taylorInvSqrt4
				};
				data.functions["permute4"] = {
					"code": permute4
				};
				data.functions["snoise3"] = {
					"code": snoise3,
					"prereqs": ["permute4", "taylorInvSqrt4"]
				};
				return "snoise3(" + this.getSCompile(inp, NVector3, data, depth) + ")";
			case 4:
				data.functions["permute1"] = {
					"code": permute1
				};
				data.functions["permute4"] = {
					"code": permute4
				};
				data.functions["grad4"] = {
					"code": grad4
				};
				data.functions["taylorInvSqrt1"] = {
					"code": taylorInvSqrt1
				};
				data.functions["taylorInvSqrt4"] = {
					"code": taylorInvSqrt4
				};
				data.functions["snoise4"] = {
					"code": snoise4,
					"prereqs": ["grad4", "permute1", "permute4", "taylorInvSqrt1", "taylorInvSqrt4"]
				};
				return "snoise4(" + this.getSCompile(inp, NVector4, data, depth) + ")";
		}
	}

	static getName() {
		return "S_SimplexNoise";
	}

	static getInTypes() {
		return [NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["simplex", "noise", "perlin", "gradient"];
	}

	getOutputVarName(pin) {
		return "noice";
	}
}

class SWorleyNoiseNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Worley Noise");
		this.addCenter();
		this.customWidth = 150;
		this.customHeight = 75;
		this.noPinfo = true;
		this.addInPin(new NPin("coord", NVector2));
		this.addInPin(new NPin("jitter", NVector1));
		this.addOutPin(new NPin("noise", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const inp = this.inpins["coord"];
		switch (inp.getReturnType().vecOrder) {
			case 1:
			case 2:
				data.functions["wpermute2"] = {
					"code": wpermute2
				};
				data.functions["wdist"] = {
					"code": wdist
				};
				data.functions["worley2"] = {
					"code": worley2,
					"prereqs": ["wpermute2", "wdist"]
				};
				return "worley2(" + this.getSCompile(inp, NVector2, data, depth) + ", " +
					this.getSCompile(this.inpins["jitter"], NVector1, data, depth) + ", false)";
			case 3:
			case 4:
		}
	}

	static getName() {
		return "S_WorleyNoise";
	}

	static getInTypes() {
		return [NVector2];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["worley", "voronoi"];
	}

	getOutputVarName(pin) {
		return "noice";
	}
}

class SNoise1Node extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("1D Noise");
		this.addCenter();
		this.customWidth = 150;
		this.customHeight = 50;
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1));
		this.addOutPin(new NPin("rand", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.functions["rand1"] = {
			"code": rand1
		};
		data.functions["noise1"] = {
			"code": noise1,
			"prereqs": ["rand1"]
		}
		return "noise1(" + this.getSCompile(inp, NVector1, data, depth) + ")"
	}

	static getName() {
		return "S_1D Noise";
	}

	static getInTypes() {
		return [NVector1];
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["noise"];
	}

	getOutputVarName(pin) {
		return "noice";
	}
}

class SLengthNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("|v|");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("_", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "length(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Length";
	}

	static getOutTypes() {
		return [NVector1];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["||", "length", "len", "magnitude", "size", "scale", "abs"];
	}
}

class SRoundNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Round");
		this.addCenter("⌊ ⌉");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.centerText.style.transform = "translate(0px,-5px)";

		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "floor(" + this.getSCompile(this.inpins["in"], null, data, depth) + " + 0.5)";
	}

	static getName() {
		return "S_Round";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["round"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "round";
	}
}

class SCeilNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Ceil");
		this.addCenter("⌈ ⌉");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.centerText.style.transform = "translate(0px,-5px)";

		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "ceil(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Ceil";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["ceiling"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "ceil";
	}
}

class SP1D2Node extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("(n+1)/2");
		this.customWidth = 150;
		this.centerText.style.fontSize = "20px";
		this.centerText.style.transform = "translate(0px,-5px)";

		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(1.0 + " + this.getSCompile(this.inpins["in"], null, data, depth) + ") * 0.5";
	}

	static getName() {
		return "S_PlusOneDividedByTwo";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["+1/2", "constant bias scale", "10"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "var";
	}
}

class SFloorNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Floor");
		this.addCenter("⌊ ⌋");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.centerText.style.transform = "translate(0px,-5px)";

		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "floor(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Floor";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["floor"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "floor";
	}
}

class SFractNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("%1");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "fract(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Fract";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["fraction", "%1"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "fract";
	}
}

class SSineNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("sin");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "sin(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Sine";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["sin", "sine", "trig", "wave"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "sine";
	}
}

class STriangleWaveNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Triangle Wave");
		this.addCenter("╱╲╱");
		this.customWidth = 150;
		this.centerText.style.fontSize = "20px";
		this.noPinfo = false;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(1.0 - 4.0 * abs(0.5 - fract(0.5 * " + this.getSCompile(this.inpins["in"], null, data, depth) + " + 0.25)))";
	}

	static getName() {
		return "S_TriangleWave";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["wave", "triangle"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "wave";
	}
}

class SCosineNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("cos");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "cos(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Cosine";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["cos", "cosine", "trig", "wave"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "cosine";
	}
}

class STangentNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("tan");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "tan(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Tangent";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["tan", "tangent", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "tangent";
	}
}

class SASineNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("asin");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("θ (radians)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "asin(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_ASine";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["asin", "asine", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "asine";
	}
}

class SACosineNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("acos");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("θ (radians)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "acos(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_ACosine";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["acos", "acosine", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "acosine";
	}
}

class SATangentNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("atan");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = false;
		this.addInPin(new NPin("y/x", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("θ (radians)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "atan(" + this.getSCompile(this.inpins["y/x"], null, data, depth) + ")";
	}

	static getName() {
		return "S_ATangent";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["atan", "atangent", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "atangent";
	}
}

class SATangent2Node extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("atan2");
		this.addCenter();
		this.customWidth = 150;
		this.addInPin(new NPin("y", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("x", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("θ (radians)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["x"].getReturnType(), this.inpins["y"].getReturnType()]);
		return "atan(" + this.getSCompile(this.inpins["y"], order, data, depth) + ", " + this.getSCompile(this.inpins["x"], order, data, depth) + ")";
	}

	static getName() {
		return "S_ATangent2";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["atan2", "atangent2", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "stp";
	}
}

class SRadiansNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("θ<sup>R<sup>");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in (degrees)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out (radians)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "radians(" + this.getSCompile(this.inpins["in (degrees)"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Radians";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["rads", "radians", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "rads";
	}
}

class SDegreesNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("θ°");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out (degrees)", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "degrees(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Degrees";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["degrees", "°", "trig"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "rads";
	}
}

class SLnNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("ln");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "log(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Ln";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["loge", "ln", "natural", "euler's"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "log";
	}
}

class SSignNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("+/-");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "sign(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Sign";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["sign", "+-"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "sgn";
	}
}

class SAbsValNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("| - |");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "abs(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_AbsVal";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["||", "abs", "absolute", "absval"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "absv";
	}
}

class SCrossProductNode extends NNode {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Cross Product");
		this.addCenter("⨯");
		this.customWidth = 200;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector3));
		this.addInPin(new NPin("B", NVector3));
		this.addOutPin(new NPin("A⨯B", NVector3));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "cross(" + this.getSCompile(this.inpins["A"], NVector3, data, depth) + ", " + this.getSCompile(this.inpins["B"], NVector3, data, depth) + ")";
	}

	static getName() {
		return "S_CrossProduct";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["x", "cross product"];
	}

	static getInTypes() {
		return [NVector3];
	}

	static getOutTypes() {
		return [NVector3];
	}

	getOutputVarName(pin) {
		return "crosp";
	}
}

class SRotateUVNode extends NNode {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Rotate");
		this.addCenter("⟳");
		this.customWidth = 200;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("UVs", NVector2));
		this.addInPin(new NPin("θ (rads)", NVector1));
		this.addOutPin(new NPin("Rotated UV", NVector2));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.functions["rotateUV"] = {
			"code": rotateUV
		};
		return "rotateUV(" + this.getSCompile(this.inpins["UVs"], NVector2, data, depth) + ", " + this.getSCompile(this.inpins["θ (rads)"], NVector1, data, depth) + ")";
	}

	static getName() {
		return "S_RotateUV";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["rotate", "transform", "spin"];
	}

	static getInTypes() {
		return [NVector2, NVector1];
	}

	static getOutTypes() {
		return [NVector2];
	}

	getOutputVarName(pin) {
		return "crosp";
	}
}

class SRotateUVMidNode extends NNode {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Rotate Around");
		this.addCenter("⟳");
		this.customWidth = 200;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("UVs", NVector2));
		this.addInPin(new NPin("θ (rads)", NVector1));
		this.addInPin(new NPin("Center", NVector2));
		this.addOutPin(new NPin("Rotated UV", NVector2));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		data.functions["rotateUVMid"] = {
			"code": rotateUVMid
		};
		return "rotateUVMid(" + this.getSCompile(this.inpins["UVs"], NVector2, data, depth) + ", " + this.getSCompile(this.inpins["θ (rads)"], NVector1, data, depth) + "," + this.getSCompile(this.inpins["Center"], NVector2, data, depth) + ")";
	}

	static getName() {
		return "S_RotateUV (axis)";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["rotate", "transform", "spin", "axis", "around", "center"];
	}

	static getInTypes() {
		return [NVector2, NVector1];
	}

	static getOutTypes() {
		return [NVector2];
	}

	getOutputVarName(pin) {
		return "crosp";
	}
}

class SNegateNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("(-1)");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "-" + this.getSCompile(this.inpins["in"], null, data, depth);
	}

	static getName() {
		return "S_Negate";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["-", "negate", "*-1"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "neg";
	}
}

class SNormalizeNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("v̂");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "-" + this.getSCompile(this.inpins["in"], null, data, depth);
	}

	static getName() {
		return "S_Normalize";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["normalize"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "unitv";
	}
}

class SOneMinusNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("1-");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(1.0 - " + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_OneMinus";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["1-", "one minus"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "opp";
	}
}

class SInverseNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("1/");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "1.0 / " + this.getSCompile(this.inpins["in"], null, data, depth);
	}

	static getName() {
		return "S_Inverse";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["1/", "one minus", "^-1"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "inv";
	}
}

class SLog2Node extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("log<sub>2<sub>");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "log2(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Log₂";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["log2"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "log";
	}
}

class SRerouteNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter();
		this.customWidth = 75;
		this.noPinfo = true;
		this.neverVar = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return this.getSCompile(this.inpins["in"], null, data, depth, true);
	}

	static getName() {
		return "S_Reroute";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["reroute", "redirect"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "log";
	}
}

class SEExpNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("e<sup>n<sup>");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "exp(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_eⁿ";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["e^n", "natural", "euler's"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "log";
	}
}

class SSqrtNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("√");
		this.customWidth = 150;
		this.centerText.style.transform = "translate(0px,7.5px)";
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "sqrt(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Sqrt";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["sqrt", "root", "square root"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "root";
	}
}

class SISqrtNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("1/√");
		this.customWidth = 150;
		this.centerText.style.transform = "translate(0px,7.5px)";
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "inversesqrt(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Inverse Sqrt";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["inverse sqrt", "inverse root", "inverse square root"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "root";
	}
}

class SExp2Node extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("2<sup>n<sup>");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "exp2(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Exp2";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["exp2", "2^n"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "twop";
	}
}

class SMixNode extends SmartVecNode3 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Mix");
		this.addCenter("~");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("~", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("mixed", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["A"].getReturnType(), this.inpins["B"].getReturnType(), this.inpins["~"].getReturnType()]);
		return "mix(" +
			this.getSCompile(this.inpins["A"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["B"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["~"], order, data, depth) + ")";
	}

	static getName() {
		return "S_Mix";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["mix", "lerp", "interpolate", "linear interpolate"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "diff";
	}
}

class SClampNode extends SmartVecNode3 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Clamp");
		this.addCenter("[ , ]");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("Val", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Min", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Max", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Clamped", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["Val"].getReturnType(), this.inpins["Min"].getReturnType(), this.inpins["Max"].getReturnType()]);
		return "clamp(" +
			this.getSCompile(this.inpins["Val"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["Min"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["Max"], order, data, depth) + ")";
	}

	static getName() {
		return "S_Clamp";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["clamp", "constrain", "restrict", "minmax"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "diff";
	}
}

class SStepNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Step");
		this.addCenter();
		this.customWidth = 150;
		this.addInPin(new NPin("Edge", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Val", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["Edge"].getReturnType(), this.inpins["Val"].getReturnType()]);
		return "step(" + this.getSCompile(this.inpins["Edge"], order, data, depth) + ", " + this.getSCompile(this.inpins["Val"], order, data, depth) + ")";
	}

	static getName() {
		return "S_Step";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["step", "compare"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "stp";
	}
}

class SReflectNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Reflect");
		this.addCenter("𐌊");
		this.centerText.style.fontSize = "40px";
		this.centerText.style.transform = "rotate(-90deg)";
		this.customWidth = 150;
		this.addInPin(new NPin("Vec", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Normal", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Reflected", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["Vec"].getReturnType(), this.inpins["Normal"].getReturnType()]);
		return "reflect(" + this.getSCompile(this.inpins["Vec"], order, data, depth) + ", " + this.getSCompile(this.inpins["Normal"], order, data, depth) + ")";
	}

	static getName() {
		return "S_Reflect";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["reflect", "bounce"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "stp";
	}
}

class SRefractNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Refract");
		this.addCenter("𐌙");
		this.centerText.style.fontSize = "40px";
		this.centerText.style.transform = "rotate(-90deg)";
		this.customWidth = 150;
		this.addInPin(new NPin("Vec", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Normal", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Ratio of IORs", NVector1));
		this.addOutPin(new NPin("Refracted", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["Vec"].getReturnType(), this.inpins["Normal"].getReturnType()]);
		return "refract(" +
			this.getSCompile(this.inpins["Vec"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["Normal"], order, data, depth) +
			this.getSCompile(this.inpins["Ratio of IORs"], NVector1, data, depth) + ")";
	}

	static getName() {
		return "S_Refract";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["refract"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "stp";
	}
}

class SSmoothStepNode extends SmartVecNode3 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Smoothstep");
		this.addCenter("~");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("Edge 1", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Edge 2", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Val", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("stepped", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["Edge 1"].getReturnType(), this.inpins["Edge 2"].getReturnType(), this.inpins["Val"].getReturnType()]);
		return "smoothstep(" +
			this.getSCompile(this.inpins["Edge 1"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["Edge 2"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["Val"], order, data, depth) + ")";
	}

	static getName() {
		return "S_Smoothstep";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["smoothstep", "herp", "interpolate", "hermite", "polynomial"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "sstp";
	}
}

class SSubtractNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("-");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("A-B", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(" + this.getSCompile(this.inpins["A"], null, data, depth) + " - " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Subtract";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["subtract", "minus", "-", "difference"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "diff";
	}
}

class SContrastNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter();
		this.addHeader("Contrast");
		this.customWidth = 150;
		this.addInPin(new NPin("Value", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Contrast", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("_", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "((" + this.getSCompile(this.inpins["Value"], null, data, depth) + " - 0.5) *" + this.getSCompile(this.inpins["Contrast"], null, data, depth) + "+ 0.5)";
	}

	static getName() {
		return "S_Contrast";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["contrast"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "diff";
	}
}

class SDivideNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("/");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("A/B", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(" + this.getSCompile(this.inpins["A"], null, data, depth) + " / " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Divide";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["divided by", "division", "/", "dividend", "divisor", "quotient"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "quotient";
	}
}

class SModuloNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("%");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("A%B", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec([this.inpins["A"].getReturnType(), this.inpins["B"].getReturnType()]);
		return "mod(" + this.getSCompile(this.inpins["A"], order, data, depth) + ", " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Modulo";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["modulo", "%", "remainder"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "remainder";
	}
}

class SmartVecNode2F extends NNode {
	constructor(data = null) {
		super(data);
	}

	linkedPinChangedType(self, linked, from, to) {
		if (!self.side) {
			self.unlink(linked, true);
			this.updateTypes();
			self.linkTo(linked);
		}
	}

	pinLinked(self, other) {
		if (!self.side) {
			this.updateTypes();
		}
	}

	pinUnlinked(self, other) {
		if (!self.side) {
			this.updateTypes();
		}
	}

	updateTypes() {
		let types = [NVector1, NVector2, NVector3, NVector4];
		const a = this.inpins[this.inpinOrder[0]];
		const b = this.inpins[this.inpinOrder[1]];
		if (a.linkNum) {
			types = types.filter(t => a.getSingleLinked().getTypes().indexOf(t) >= 0);
		}
		if (b.linkNum) {
			types = types.filter(t => b.getSingleLinked().getTypes().indexOf(t) >= 0);
		}
		a.setTypes(false, ...types);
		b.setTypes(false, ...types);
	}

	getReturnType(outpin) {
		return NVector1;
	}
}

class SDistanceNode extends SmartVecNode2F {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Distance");
		this.addCenter("|A-B|");
		this.centerText.style.fontSize = "40px";
		this.customWidth = 150;
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Distance", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "distance(" + this.getSCompile(this.inpins["A"], null, data, depth) + ", " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Distance";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["distance"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1];
	}

	getOutputVarName(pin) {
		return "dist";
	}
}

class SDotProductNode extends SmartVecNode2F {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Dot Product");
		this.addCenter("•");
		this.centerText.style.fontSize = "40px";
		this.customWidth = 150;
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("A•B", NVector1));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "dot(" + this.getSCompile(this.inpins["A"], null, data, depth) + ", " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Dot";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["•", "dot", "dot product"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1];
	}

	getOutputVarName(pin) {
		return "dist";
	}
}

class SExponentNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("^");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("n", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("A^B", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "pow(" + this.getSCompile(this.inpins["A"], null, data, depth) + ", " + this.getSCompile(this.inpins["n"], this.inpins["A"].getReturnType(), data, depth) + ")";
	}

	static getName() {
		return "S_Exponent";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["power", "^", "exponent"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "exp";
	}
}

class SPosterizeNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Posterize");
		this.addCenter();
		this.customWidth = 150;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("layers", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("_", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const layers = this.getSCompile(this.inpins["layers"], null, data, depth, true);

		return "floor(" + this.getSCompile(this.inpins["in"], null, data, depth) + " * " + layers + ") / " + layers;
	}

	static getName() {
		return "S_Posterize";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["posterize"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "post";
	}
}

class SLogNode extends SmartVecNode2 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("log");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("Base", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("log", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "log2(" + this.getSCompile(this.inpins["A"], null, data, depth) + ") / log2(" + this.getSCompile(this.inpins["Base"], null, data, depth) + ")";
	}

	static getName() {
		return "S_Logarithm";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["log", "logarithm"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "log";
	}
}

class SAdditionNode extends SmartVecNodeN {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("+");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Sum", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(" + this.inpinOrder.map(n => this.getSCompile(this.inpins[n], null, data, depth)).join(" + ") + ")";
	}

	static getName() {
		return "S_Add";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["addition", "plus", "sum", "+", "||", "or"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "sum";
	}
}

class SMultiplyNode extends SmartVecNodeN {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("x");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Product", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "(" + this.inpinOrder.map(n => this.getSCompile(this.inpins[n], null, data, depth)).join(" * ") + ")";
	}

	static getName() {
		return "S_Multiply";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["multiply", "multiplication", "product", "*", "x", "&&", "and"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "prod";
	}
}

class SMinNode extends SmartVecNodeN {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("min");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Smallest", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec(this.inpinOrder.map(n => this.inpins[n].getReturnType()));
		let out = "min(" + this.getSCompile(this.inpins["A"], order, data, depth) + ", " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
		for (let i = 2, l = this.inpinOrder.length; i < l; i++) {
			const ipin = this.inpins[this.inpinOrder[i]];
			out = "min(" + out + ", " + this.getSCompile(ipin, null, data, depth) + ")";
		}
		return out;
	}

	static getName() {
		return "S_Min";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["min", "minimum", "smallest", "lowest"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "smallest";
	}
}

class SMaxNode extends SmartVecNodeN {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("max");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.addInPin(new NPin("A", NVector1, NVector2, NVector3, NVector4));
		this.addInPin(new NPin("B", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("Largest", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		const order = getHighestOrderVec(this.inpinOrder.map(n => this.inpins[n].getReturnType()));
		let out = "max(" + this.getSCompile(this.inpins["A"], order, data, depth) + ", " + this.getSCompile(this.inpins["B"], null, data, depth) + ")";
		for (let i = 2, l = this.inpinOrder.length; i < l; i++) {
			const ipin = this.inpins[this.inpinOrder[i]];
			out = "max(" + out + ", " + this.getSCompile(ipin, null, data, depth) + ")";
		}
		return out;
	}

	static getName() {
		return "S_Max";
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["max", "maximum", "largest", "highest"];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	getOutputVarName(pin) {
		return "largest";
	}
}

// TODO 4DD V41R14BL3 P1N COUNT B4CK
class SAppendNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("⇒");
		this.centerText.style.transform = "translate(0px, -14px)"
		this.customWidth = 150;
		this.noPinfo = true;
		this.addHeader("Append");
		this.in1 = new NPin("A", NVector1, NVector2, NVector3);
		this.in2 = new NPin("B", NVector1, NVector2, NVector3);
		this.in3 = new NPin("C", NVector1, NVector2);
		this.in4 = new NPin("D", NVector1);
		this.addInPin(this.in1);
		this.addInPin(this.in2);
		this.addInPin(this.in3);
		this.addInPin(this.in4);
		this.removePin(this.in3);
		this.removePin(this.in4);
		this.outp = new NPin("out", NVector2, NVector3, NVector4);
		this.addOutPin(this.outp);

		this.prevInTypes = {};
		this.prevOutTypes;

		return this.containerDiv;
	}

	linkedPinChangedType(self, linked, from, to) {
		this.updateTypes(self);
	}

	pinLinked(self, other) {
		this.updateTypes(self);
	}

	pinUnlinked(self, other) {
		const links = {};
		for (const pin of this.pinlist) {
			links[pin.pinid] = Object.values(pin.links);
			pin.unlinkAll();
		}
		this.updateTypes(self);
		for (const pin of this.pinlist) {
			for (const link of links[pin.pinid]) {
				pin.linkTo(link);
			}
		}
	}

	updateTypes(self) {
		const outputHigh = this.outp.linkNum ? getLowestOrderVec(Object.values(this.outp.links).map(x => getHighestOrderVec(x.getTypes()))).vecOrder : 4;
		const outputLow = this.outp.linkNum ? getHighestOrderVec(Object.values(this.outp.links).map(x => getLowestOrderVec(x.getTypes(), 2))).vecOrder : 4;

		let minIn = 1;

		let maxIn = 1 + outputHigh - this.inpinOrder.length;
		let minOut;

		let inputLow = 0;
		let inputHigh = 0;
		for (const inn of this.inpinOrder) {
			const inp = this.inpins[inn];
			inp.linkMin = (inp.linkNum) ? (getLowestOrderVec(inp.getSingleLinked().getTypes()).vecOrder) : (1);
			inp.linkMax = (inp.linkNum) ? (getHighestOrderVec(inp.getSingleLinked().getTypes()).vecOrder) : (3);
			inputLow += inp.linkMin;
			inputHigh += inp.linkMax;
		}
		minOut = inputLow;

		if (this.outp.linkNum) {
			minOut = Math.max(outputLow, minOut);
		}

		let maxOut = Math.min(outputHigh, inputHigh);
		let linkedCount = 0;
		for (const inn of this.inpinOrder) {
			const inp = this.inpins[inn];
			if (inp.linkNum) {
				linkedCount++;
			}
		}
		for (const inn of this.inpinOrder) {
			let inTypes;
			const inp = this.inpins[inn];
			if (linkedCount == 0) {
				inTypes = [NVector1, NVector2, NVector3].slice(0, maxIn);
			} else {
				const minAvailable = Math.max(minOut - inputHigh + inp.linkMax, 1);
				const maxAvailable = maxOut - inputLow + inp.linkMin;
				inTypes = [NVector1, NVector2, NVector3].slice(minAvailable - 1, maxAvailable);
			}
			if (inp.linkNum) {
				inTypes = inp.getSingleLinked().getTypes().filter(x => inTypes.indexOf(x) >= 0);
			}
			const stringed = inTypes.join(":");
			if (this.prevInTypes[inn] != stringed) {
				inp.setTypes(false, ...inTypes);
				this.prevInTypes[inn] = stringed;
			}
		}
		let outTypes = [NVector2, NVector3, NVector4].slice(minOut - 2, maxOut - 1);
		for (const lid in this.outp.links) {
			outTypes = this.outp.links[lid].getTypes().filter(x => outTypes.indexOf(x) >= 0);
		}
		const stringed = outTypes.join(":");
		if (this.prevOutTypes != stringed) {
			this.outp.setTypes(false, ...outTypes);
			this.prevOutTypes = stringed
		}
	}

	load(data, loadids) {
		super.load(data, loadids);
	}

	saveExtra(data) {}

	setInCount(count) {
		if (this.inpinOrder.length == count) {
			return false;
		}
		switch (count) {
			case 2:
				this.centerText.innerHTML = "⇒";
				this.centerText.style.transform = "translate(0px, -14px)"
				if (this.inpinOrder.length > 2) {
					this.removeInPin(this.in3);
					if (this.inpinOrder.length == 4) {
						this.removeInPin(this.in4);
					}
				}
				this.updateTypes(false);
				break;
			case 3:
				this.centerText.innerHTML = "⇛";
				this.centerText.style.transform = "translate(0px, -6px)";
				this.reAddInPin(this.in3);
				if (this.inpinOrder.length == 4) {
					this.removeInPin(this.in4);
				}
				this.updateTypes(false);
				break;
			case 4:
				this.centerText.innerHTML = "⭆";
				this.centerText.style.transform = "translate(0px, -1.5px)";
				this.reAddInPin(this.in3);
				this.reAddInPin(this.in4);
				this.updateTypes(false);
				break;
		}
	}

	// makeContextMenu(pos) {
	// 	const menu = super.makeContextMenu(pos);
	// 	const node = this;
	// 	const brd = this.board;
	// 	if (node.prevMin < node.prevMax + 1) {
	// 		const op = new NCtxMenuOption("Add Input");
	// 		op.action = function(e) {
	// 			if (node.inpinOrder.length == 2) {
	// 				brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 3));
	// 				node.setInCount(3)
	// 			} else {
	// 				brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 4));
	// 				node.setInCount(4);
	// 			}
	// 			return false;
	// 		}
	// 		menu.addOption(op);
	// 	}
	// 	if (node.inpinOrder.length > 2) {
	// 		const op = new NCtxMenuOption("Remove Input");
	// 		op.action = function(e) {
	// 			if (node.inpinOrder.length == 4) {
	// 				brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 3));
	// 				node.setInCount(3)
	// 			} else {
	// 				brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 2));
	// 				node.setInCount(2);
	// 			}
	// 			return false;
	// 		}
	// 		menu.addOption(op);
	// 	}
	//
	// 	return menu;
	// }

	getReturnType(outPin) {
		let sum = 0;
		for (const inn of this.inpinOrder) {
			sum += this.inpins[inn].getReturnType().vecOrder;
		}
		return [NVector2, NVector3, NVector4][sum - 2];
	}

	scompile(pin, varType, data, depth) {
		return varType.compileName + "(" + this.inpinOrder.map(n => this.getSCompile(this.inpins[n], null, data, depth)).join(", ") + ")";
	}

	static getName() {
		return "S_Append";
	}

	static getTags() {
		return ["append", "combine", "make", "construct", ","];
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3];
	}

	static getOutTypes() {
		return [NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}
}