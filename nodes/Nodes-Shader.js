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

		this.addOutPin(new NPin("Vec 1 Out", NVector1));
		this.addOutPin(new NPin("Vec 2 Out", NVector2));
		this.addOutPin(new NPin("Vec 3 Out", NVector3));
		this.addOutPin(new NPin("Vec 4 Out", NVector4));

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
		this.addHeader("Vector1");
		this.addCenter();
		this.inputDiv = NVector1.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec1";
		this.centerDiv.append(this.inputDiv);
		this.noPinfo = true;
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
		return ["1d", "vec1", "vector1", "float1", "grayscale", "greyscale", "constant", "number"];
	}
}

class SVector2Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector2.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Vector2");
		this.addCenter();
		this.inputDiv = NVector2.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec2";
		this.centerDiv.append(this.inputDiv);
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
		$(this.inputDiv).find(".vec2x").get(0).value = this.val.x;
		$(this.inputDiv).find(".vec2y").get(0).value = this.val.y;
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
		return ["2d", "vec2", "vector2", "float2", "coordinate", "position", "location", "uv"];
	}
}

class SVector3Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector3.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Vector3");
		this.addCenter();
		this.inputDiv = NVector3.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec3";
		this.centerDiv.append(this.inputDiv);
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
		$(this.inputDiv).find(".vec3x").get(0).value = this.val.x;
		$(this.inputDiv).find(".vec3y").get(0).value = this.val.y;
		$(this.inputDiv).find(".vec3z").get(0).value = this.val.z;
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
		return ["3d", "vec3", "vector3", "float3", "color", "colour", "position", "location"];
	}
}

class SVector4Node extends NNode {
	constructor(data = null) {
		super(data);
		this.val = NVector4.construct();
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Vector4");
		this.addCenter();
		this.inputDiv = NVector4.edit(this.val, this.board);
		this.inputDiv.className = "nodeval vec4";
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
		$(this.inputDiv).find(".vec4x").get(0).value = this.val.x;
		$(this.inputDiv).find(".vec4y").get(0).value = this.val.y;
		$(this.inputDiv).find(".vec4z").get(0).value = this.val.z;
		$(this.inputDiv).find(".vec4a").get(0).value = this.val.a;
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
		return ["4d", "vec4", "float4", "color", "colour"];
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

		this.addCenter();
		const node = this;

		const refresher = document.createElement("i");
		refresher.className = "material-icons";
		refresher.innerHTML = "refresh";
		refresher.onclick = function(e) {
			node.recompileCanvas();
		}
		this.centerDiv.append(refresher);

		this.canvas = document.createElement("canvas");
		this.canvas.className = "displaynode";
		this.centerDiv.append(this.canvas);

		this.noPinfo = true;
		this.addHeader("Shader Dislay");
		this.addInPin(new NPin("_", NVector1, NVector2, NVector3, NVector4));

		return this.containerDiv;
	}

	recompileCanvas() {
		if (this.gl) {
			this.gl.delete();
		}
		const inpin = this.inpins["_"];
		if (inpin.linkNum) {
			const link = inpin.getSingleLinked();
			if (!link.multiTyped) {
				this.gl = setupWebGLRectangle(this.canvas, this.fullSCompile(inpin, link.type));
			}
		}
	}

	static getName() {
		return "S_Display";
	}

	static getInTypes() {
		return [NVector1, NVector2, NVector3];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["output", "preview"];
	}
}

class SComponentNode extends NNode {
	constructor(data = null) {
		super(data);
		this.canvas;
		this.gl;
	}

	createNodeDiv() {
		super.createNodeDiv();

		this.addCenter();
		// 4 <select> divs in a row
		// 		each select has following options:
		//				if input is vec1:		none, x
		//				if input is vec2:		none, x, y
		//				if input is vec3:		none, x, y, z
		//				if input is vec4:		none, x, y, z, a
		//			EXCEPT: first selector does not have 'none' option
		// 		each select div is greyed out unless previous one is not 'none'
		//				eg:
		//						[X],[Y],[Y],[X]		-->		vec4 output (input.xyyx)
		//						[X],[Y],[-],[ ]		-->		vec2 output (input.xy)
		//						[Z],[-],[ ],[ ]		-->		vec1 output (input.z)
		// connecting the input forces all selectors to limit options
		// connecting the output forces correct number of selectors to be active, removing 'none' option where required
		// selecting an options forces input to be a vector that contains the selected component, and also forces the output length
		// by default, output should be vec1 set to X (and options should be [x],[-],[ ],[ ])
		this.addInPin(new NPin("_", NVector1, NVector2, NVector3, NVector4));

		return this.containerDiv;
	}

	recompileCanvas() {
		if (this.gl) {
			this.gl.delete();
		}
		const inpin = this.inpins["_"];
		if (inpin.linkNum) {
			const link = inpin.getSingleLinked();
			if (!link.multiTyped) {
				this.gl = setupWebGLRectangle(this.canvas, this.fullSCompile(inpin, link.type));
			}
		}
	}

	static getName() {
		return "S_Components";
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
		return ["component", "mask", "break", "x", "y", "z", "a", "xy", "xyz", ".", "part"];
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
		this.noPinfo = true;
		this.addOutPin(new NPin("_", NVector2));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
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

class SRoundNode extends NNode {
	constructor(data = null) {
		super(data);
	}

	createNodeDiv() {
		super.createNodeDiv();
		this.addHeader("Round");
		this.addCenter("⌊ ⌉");
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	linkedPinChangedType(self, linked, from, to) {
		this.updateTypes(self.side);
	}

	pinLinked(self, other) {
		this.updateTypes(self.side);
	}

	pinUnlinked(self, other) {
		this.updateTypes(self.side);
	}

	updateTypes(side) {
		const inp = this.inpins["in"];
		const inpl = inp.linkNum ? inp.getSingleLinked() : null;

		const outp = this.outpins["out"];
		const outpl = outp.linkNum ? Object.values(outp.links) : null;

		let inTypes;
		let outTypes;

		if (inpl === null && outpl === null) {
			inTypes = [NVector1, NVector2, NVector3, NVector4];
			outTypes = [NVector1, NVector2, NVector3, NVector4];
		} else if (inpl === null) {
			// narrow inTypes down to types that are acceptable by (any types for all pins linked to output)
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a,b) => a.filter(x => b.indexOf(x) >= 0));
			// narrow outTypes down to types that can be cast from inTypes
			outTypes = getVecChildrenU(inTypes);
		} else if (outpl === null) {
			// narrow down to types that are acceptable by (any types for pin linked to input)
			inTypes = getVecChildrenU(inpl.getTypes());
			// narrow outTypes down to types that can be cast from inTypes
			outTypes = getVecChildrenU(inTypes);
		} else {
			// narrow down to types that are acceptable by both (any types for all pins linked to output) and (any types for pin linked to input)
			// THERE'S NO SUCH THING AS TOO MANY LAMBDAS
			inTypes = outpl.map(x => getVecParentsU(x.getTypes())).reduce((a,b) => a.filter(x => b.indexOf(x) >= 0)).filter(x => getVecChildrenU(inpl.getTypes()).indexOf(x) >= 0);
			// narrow outTypes down to types that can be cast from inTypes
			outTypes = getVecChildrenU(inTypes);
		}
		inp.setTypes(!side, ...inTypes);
		outp.setTypes(side, ...outTypes);
	}

	scompile(pin, varType, data, depth) {
		return "floor(" + this.getSCompile(this.inpins["in"], varType, data, depth) + " + 0.5)";
	}

	static getName() {
		return "S_Round";
	}

	static getOutTypes() {
		return [NVector1, NVector2, NVector3, NVector4];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["round", "texcoord", "uv"];
	}
}