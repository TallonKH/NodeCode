//TODO
// clamp
// dot
// step
// smoothstep
// distance
// cross
// reflect

// rand (v3,v4)
// noise

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
		// this.addInPin(new NPin("Vec 1,2 In", NVector1,NVector2));
		// this.addInPin(new NPin("Vec 1,3 In", NVector1,NVector3));
		// this.addInPin(new NPin("Vec 1,4 In", NVector1,NVector4));
		// this.addInPin(new NPin("Vec 2,3 In", NVector2,NVector3));
		// this.addInPin(new NPin("Vec 2,4 In", NVector2,NVector4));
		// this.addInPin(new NPin("Vec 3,4 In", NVector3,NVector4));
		// this.addInPin(new NPin("Vec 1,2,3 In", NVector1,NVector2,NVector3));
		// this.addInPin(new NPin("Vec 1,2,4 In", NVector1,NVector2,NVector4));
		// this.addInPin(new NPin("Vec 1,3,4 In", NVector1,NVector3,NVector4));
		// this.addInPin(new NPin("Vec 2,3,4 In", NVector2,NVector3,NVector4));
		// this.addInPin(new NPin("Vec 1,2,3,4 In", NVector1,NVector2,NVector3,NVector4));

		this.addOutPin(new NPin("Vec 1 Out", NVector1));
		this.addOutPin(new NPin("Vec 2 Out", NVector2));
		this.addOutPin(new NPin("Vec 3 Out", NVector3));
		this.addOutPin(new NPin("Vec 4 Out", NVector4));
		// this.addOutPin(new NPin("Vec 1,2 Out", NVector1,NVector2));
		// this.addOutPin(new NPin("Vec 1,3 Out", NVector1,NVector3));
		// this.addOutPin(new NPin("Vec 1,4 Out", NVector1,NVector4));
		// this.addOutPin(new NPin("Vec 2,3 Out", NVector2,NVector3));
		// this.addOutPin(new NPin("Vec 2,4 Out", NVector2,NVector4));
		// this.addOutPin(new NPin("Vec 3,4 Out", NVector3,NVector4));
		// this.addOutPin(new NPin("Vec 1,2,3 Out", NVector1,NVector2,NVector3));
		// this.addOutPin(new NPin("Vec 1,2,4 Out", NVector1,NVector2,NVector4));
		// this.addOutPin(new NPin("Vec 1,3,4 Out", NVector1,NVector3,NVector4));
		// this.addOutPin(new NPin("Vec 2,3,4 Out", NVector2,NVector3,NVector4));
		// this.addOutPin(new NPin("Vec 1,2,3,4 Out", NVector1,NVector2,NVector3,NVector4));

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
		return ["1", "1d", "vec1", "vector1", "double", "int", "float1", "grayscale", "greyscale", "constant", "number"];
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
		return ["2", "2d", "vec2", "vector2", "float2", "coordinate", "position", "location", "uv"];
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
		return ["3", "3d", "vec3", "vector3", "float3", "color", "colour", "position", "location"];
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
		return ["4", "4d", "vec4", "float4", "color", "colour"];
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

		this.customWidth = 270;
		this.customHeight = 250;
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
		this.addHeader("Shader Display");
		this.addInPin(new NPin("_", NVector1, NVector2, NVector3, NVector4));

		return this.containerDiv;
	}

	recompileCanvas() {
		if (this.gl) {
			this.gl.delete();
			delete this.board.activeGLContexts[this.pinid]
		}
		const inpin = this.inpins["_"];
		if (inpin.linkNum) {
			const link = inpin.getSingleLinked();
			const fullCompile = this.fullSCompile(inpin);
			console.log(fullCompile);
			this.gl = setupWebGLRectangle(this.canvas, fullCompile.text);

			const uniforms = {};
			for (const unfn in fullCompile.uniforms) {
				const unf = fullCompile.uniforms[unfn];
				uniforms[unfn] = Object.assign({}, unf);
				uniforms[unfn].location = this.gl.context.getUniformLocation(this.gl.program, unfn);
				console.log(uniforms[unfn].location);
			}

			this.board.activeGLContexts[this.pinid] = Object.assign({
				"uniforms": uniforms
			}, this.gl);
		}

	}

	remove() {
		this.gl.delete();
		delete this.board.activeGLContext[this.gl];
		super.remove();
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
		return ["component", "mask", "break", ".x", ".y", ".z", ".a", ".xy", ".xyz", ".", "part", "make", "construct"];
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
		return ["break", ".x", ".y", "split"];
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
		return ["break", ".x", ".y", ".z", "split"];
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
		return ["break", ".x", ".y", ".z", ".w", "split"];
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
		return ["vector2", "vec2", "make", "xy", "construct"];
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
		return ["vector3", "vec3", "make", "xyz", "construct"];
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
		return ["vector4", "vec4", "make", "xyzw", "construct"];
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
		data.varying["fragTexCoord"] = "varying vec2 fragTexCoord;";
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
		return [NVector2];
	}

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["3.1415926536", "pi", "π"];
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
		return "3.1415926536";
	}

	static getName() {
		return "S_Tau";
	}

	static getOutTypes() {
		return [NVector2];
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
				data.functions["rand1"] = "float rand1(float n){\n\treturn fract(sin(n)  * 1369.6124 + cos(n) * 43758.5453123);\n}";
				return "rand1(" + this.getSCompile(inp, NVector1, data, depth) + ")";
			case 2:
				data.functions["rand2"] = "float rand2(vec2 p){\n\treturn fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));\n}";
				return "rand2(" + this.getSCompile(inp, NVector2, data, depth) + ")";
			case 3:
				data.functions["rand3"] = "float rand3(vec3 n){\n\treturn ???;\n}";
				return "rand3(" + this.getSCompile(inp, NVector3, data, depth) + ")";
			case 4:
				data.functions["rand4"] = "float rand4(vec4 n){\n\treturn ???;)\n}";
				return "rand4(" + this.getSCompile(inp, NVector4, data, depth) + ")";
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

	static getCategory() {
		return "Shader";
	}

	static getTags() {
		return ["||", "length", "len", "magnitude", "size", "scale", "abs"];
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
			// THERE'S NO SUCH THING AS TOO MANY ARROW FUNCTIONS
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
		return ["sin", "sine", "trig"];
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
		return ["cos", "cosine", "trig"];
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
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "asin(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
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
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "acos(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
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
		this.addInPin(new NPin("in (radians)", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "atan(" + this.getSCompile(this.inpins["in (radians)"], null, data, depth) + ")";
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

class SRadiansNode extends SmartVecNode1 {
	createNodeDiv() {
		super.createNodeDiv();
		this.addCenter("θ<sup>R<sup>");
		this.customWidth = 150;
		this.centerText.style.fontSize = "40px";
		this.noPinfo = true;
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "radians(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
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
		this.addInPin(new NPin("in", NVector1, NVector2, NVector3, NVector4));
		this.addOutPin(new NPin("out", NVector1, NVector2, NVector3, NVector4));
		return this.containerDiv;
	}

	scompile(pin, varType, data, depth) {
		return "degrees(" + this.getSCompile(this.inpins["in"], null, data, depth) + ")";
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
		this.addCenter("|-|");
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
		return "1.0 - " + this.getSCompile(this.inpins["in"], null, data, depth);
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
		return "S_ISqrt";
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
		const order = getHighestOrderVec([this.inpins["A"].getReturnType(), this.inpins["B"].getReturnType()]);
		return "mix(" +
			this.getSCompile(this.inpins["A"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["B"], order, data, depth) + ", " +
			this.getSCompile(this.inpins["~"], null, data, depth) + ")";
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

		this.prevMin = 2;
		this.prevMax = 4;

		return this.containerDiv;
	}

	linkedPinChangedType(self, linked, from, to) {
		this.updateTypes(false);
	}

	pinLinked(self, other) {
		this.updateTypes(false);
	}

	pinUnlinked(self, other) {
		this.updateTypes(false);
	}

	updateTypes(force) {
		const min = this.calcMinOrder();
		const max = this.calcMaxOrder();
		if (force || this.prevMin != min || this.prevMax != max) {
			for (const inn of this.inpinOrder) {
				const inp = this.inpins[inn];
				const available = max + 1 - min + (inp.linkNum ? Math.min(...inp.getSingleLinked().getTypes().map(t => t.vecOrder)) : 1);
				inp.setTypes(false, ...[NVector1, NVector2, NVector3].slice(0, available));
			}
			this.outp.setTypes(false, ...[NVector2, NVector3, NVector4].slice(min - 2, max));
		}

		this.prevMin = min;
		this.prevMax = max;
	}

	calcMinOrder() {
		let mi = 0;
		for (const pinn of this.inpinOrder) {
			const inp = this.inpins[pinn];
			if (inp.linkNum) {
				mi += Math.min(...inp.getSingleLinked().getTypes().map(t => t.vecOrder));
			} else {
				mi += 1;
			}
		}

		return mi;
	}

	calcMaxOrder() {
		let mo = 4;
		for (const lid in this.outp.links) {
			const link = this.outp.links[lid];
			mo = Math.min(mo, Math.max(...link.getTypes().map(t => t.vecOrder)));
		}

		let mi = 0;
		for (const pinn of this.inpinOrder) {
			const inp = this.inpins[pinn];
			if (inp.linkNum) {
				mi += Math.max(...inp.getSingleLinked().getTypes().map(t => t.vecOrder));
			} else {
				mi += 4;
			}
		}

		return Math.min(mo, mi) - 1;
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

	makeContextMenu(pos) {
		const menu = super.makeContextMenu(pos);
		const node = this;
		const brd = this.board;
		if (node.prevMin < node.prevMax + 1) {
			const op = new NCtxMenuOption("Add Input");
			op.action = function(e) {
				if (node.inpinOrder.length == 2) {
					brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 3));
					node.setInCount(3)
				} else {
					brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 4));
					node.setInCount(4);
				}
				return false;
			}
			menu.addOption(op);
		}
		if (node.inpinOrder.length > 2) {
			const op = new NCtxMenuOption("Remove Input");
			op.action = function(e) {
				if (node.inpinOrder.length == 4) {
					brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 3));
					node.setInCount(3)
				} else {
					brd.addAction(new ActChangeSAppendInputNum(brd, node, node.inpinOrder.length, 2));
					node.setInCount(2);
				}
				return false;
			}
			menu.addOption(op);
		}

		return menu;
	}

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