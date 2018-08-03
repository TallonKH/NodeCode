//TODO fix z-indices

class NNode {
	constructor(data = null) {
		this.startData = data;
		this.resizable = false;

		this.board = null;
		this.containerDiv = null;
		this.nodeDiv = null;
		this.bodyDiv = null;
		this.centerDiv = null;
		this.headerDiv = null;
		this.inPinsDiv = null;
		this.inPinfosDiv = null;
		this.ipcNameDiv = null; // ipc = inpinfo column
		this.ipcEditDiv = null;
		this.outPinsDiv = null;
		this.outPinfosDiv = null;
		this.opcNameDiv = null; // opc = outpinfo column

		this.selected = false;
		this.position = new NPoint(0, 0);
		this.offset = new NPoint(0, 0);
		this.displayPosition = new NPoint(0, 0);

		this.nodeid = data ? (data.id) : (~~(Math.random() * 8388607)) // generate random int as ID
		this.inpins = {}; // name : pin
		this.inpinOrder = [];
		this.outpins = {};
		this.outpinOrder = [];

		this.pinlist = [];
	}

	makeResizable(minWidth = 75, minHeight = 22, maxWidth = 1000, maxHeight = 750) {
		if (!this.resizable) {
			this.resizable = true
			$(this.nodeDiv).resizable({
				handles: "se",
				maxHeight: maxHeight,
				maxWidth: maxWidth,
				minHeight: minHeight,
				minWidth: minWidth
			});
			this.nodeDiv.className = this.nodeDiv.className + " resizable"
		}
	}

	createNodeDiv() {
		this.containerDiv = document.createElement("div");
		this.containerDiv.className = "container";

		this.nodeDiv = document.createElement("div");
		this.nodeDiv.className = "node nodepart";
		this.nodeDiv.setAttribute("data-nodeid", this.nodeid);

		this.bodyDiv = document.createElement("div");
		this.bodyDiv.className = "nodepart body";
		this.bodyDiv.setAttribute("data-nodeid", this.nodeid);

		this.nodeDiv.append(this.bodyDiv);
		this.containerDiv.append(this.nodeDiv);

		return this.containerDiv;
	}

	remove() {
		this.board.removeNode(this);
	}

	select() {
		return this.board.selectNode(this);
	}

	deselect() {
		return this.board.deselectNode(this);
	}

	unlinkAllInpins() {
		for (const pin in this.inpins) {
			this.inpins[pin].unlinkAll();
		}
	}

	unlinkAllOutpins() {
		for (const pin in this.outpins) {
			this.outpins[pin].unlinkAll();
		}
	}

	unlinkAllPins() {
		this.unlinkAllInpins();
		this.unlinkAllOutpins();
	}

	addHeader(text = this.constructor.getName()) {
		this.headerDiv = document.createElement("header");
		this.headerDiv.className = "nodepart";
		this.headerDiv.setAttribute("data-nodeid", this.nodeid);
		this.headerDiv.innerHTML = text;
		// this.headerDiv.innerHTML = this.nodeid;
		this.nodeDiv.append(this.headerDiv);
		this.updateDims();
	}

	addCenter(text = null) {
		this.centerDiv = document.createElement("div");
		this.centerDiv.className = "nodepart center";
		this.centerDiv.setAttribute("data-nodeid", this.nodeid);
		if (text) {
			const txt = document.createElement("div");
			txt.className = "nodepart text";
			txt.setAttribute("data-nodeid", this.nodeid);
			txt.innerHTML = text;
			this.centerDiv.append(txt);
			this.centerText = txt;
		}
		this.bodyDiv.append(this.centerDiv);
	}

	setCenterFontSize(css) {
		$(this.centerDiv).find(".text").get(0).style.fontSize = css;
	}

	addInPin(pin) {
		if (this.inpins[pin.name]) {
			console.log("A inpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		if (this.startData && this.inpinOrder.length < this.startData.ipids.length) {
			pin.pinid = this.startData.ipids[this.inpinOrder.length];
		} else {
			pin.pinid = ~~(Math.random() * 8388607);
		}
		pin.node = this;
		pin.side = false;
		pin.setTypes(true, ...pin.types);
		this.inpins[pin.name] = pin;
		this.inpinOrder.push(pin.name);
		this.pinlist.push(pin);
		if (this.board) {
			this.board.pins[pin.pinid] = pin;
		}

		this.updateDims();

		if (this.inPinsDiv == null) {
			this.inPinsDiv = document.createElement("div");
			this.inPinsDiv.className = "inpins pins"
			this.inPinsDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.inPinsDiv);

			if (this.noPinfo) {
				this.inPinsDiv.setAttribute("noPinfo", true);
			} else {
				this.inPinfosDiv = document.createElement("div");
				this.inPinfosDiv.className = "inpinfos pinfos nodepart"
				this.inPinfosDiv.setAttribute("data-nodeid", this.nodeid);
				this.bodyDiv.append(this.inPinfosDiv);

				this.ipcNameDiv = document.createElement("div");
				this.ipcNameDiv.className = "inpinfocol pinfocol";
				this.ipcNameDiv.setAttribute("data-nodeid", this.nodeid);
				this.inPinfosDiv.append(this.ipcNameDiv);

				this.ipcEditDiv = document.createElement("div");
				this.ipcEditDiv.className = "inpinfocol pinfocol";
				this.ipcEditDiv.setAttribute("data-nodeid", this.nodeid);
				this.inPinfosDiv.append(this.ipcEditDiv);
			}

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.inPinsDiv.append(pin.createPinDiv());

		if (!this.noPinfo) {
			const pinfo = pin.createPinfoDiv();
			pinfo.setAttribute("data-nodeid", this.nodeid);
			this.ipcNameDiv.append(pinfo);

			var pinfoDiv = document.createElement("div");
			pinfoDiv.className = "nodepart pinfo " + (this.side ? "outpinfo" : "inpinfo");
			pinfoDiv.setAttribute("data-nodeid", this.nodeid);
			pinfoDiv.setAttribute("data-pinid", pin.pinid);
			this.ipcEditDiv.append(pinfoDiv);
		}

		if (((pin.type && pin.type.edit) || pin.customEditor) && !this.noPinfo) {
			const node = this;
			const pedit = (pin.type) ? (pin.type.edit(pin.defaultVal, this.board)) : (pin.customEditor(pin.defaultVal, this.board));
			pedit.onfocus = function(e) {
				node.inPinfosDiv.setAttribute("opened", true);
			}
			pedit.onblur = function(e) {
				node.inPinfosDiv.removeAttribute("opened");
			}
			pinfoDiv.append(pedit);
			pin.editDiv = pedit;
		}
		pin.setUp = true;
	}

	addOutPin(pin) {
		if (this.outpins[pin.name]) {
			console.log("An outpin with the name '" + pin.name + "' already exists on this node!");
			return false;
		}
		if (this.startData) {
			pin.pinid = this.startData.opids[this.outpinOrder.length];
		} else {
			pin.pinid = ~~(Math.random() * 8388607);
		}
		pin.node = this;
		pin.side = true;
		pin.setTypes(true, ...pin.types);
		this.outpins[pin.name] = pin;
		this.outpinOrder.push(pin.name);
		this.pinlist.push(pin);
		if (this.board) {
			this.board.pins[pin.pinid] = pin;
		}

		this.updateDims();

		if (this.outPinsDiv == null) {
			this.outPinsDiv = document.createElement("div");
			this.outPinsDiv.className = "outpins pins"
			this.outPinsDiv.setAttribute("data-nodeid", this.nodeid);
			this.bodyDiv.append(this.outPinsDiv);

			if (this.noPinfo) {
				this.outPinsDiv.setAttribute("noPinfo", true);
			} else {
				this.outPinfosDiv = document.createElement("div");
				this.outPinfosDiv.className = "outpinfos pinfos nodepart"
				this.outPinfosDiv.setAttribute("data-nodeid", this.nodeid);
				this.bodyDiv.append(this.outPinfosDiv);

				this.opcNameDiv = document.createElement("div");
				this.opcNameDiv.className = "outpinfocol pinfocol";
				this.opcNameDiv.setAttribute("data-nodeid", this.nodeid);
				this.outPinfosDiv.append(this.opcNameDiv);
			}

			this.centerDiv.remove();
			this.bodyDiv.append(this.centerDiv);
		}
		this.outPinsDiv.append(pin.createPinDiv());
		if (!this.noPinfo) {
			const pinfo = pin.createPinfoDiv();
			pinfo.setAttribute("data-nodeid", this.nodeid);
			pinfo.setAttribute("data-pinid", pin.pinid);
			this.opcNameDiv.append(pinfo);
		}
		pin.setUp = true;
	}

	removeInPin(pin) {
		pin.unlinkAll();
		delete this.inpins[pin.name];
		this.inpinOrder.splice(this.inpinOrder.indexOf(pin.name), 1);
		this.pinlist.splice(this.pinlist.indexOf(pin.name), 1);
		delete this.board.pins[pin.pinid];

		pin.pinDiv.remove();
		if (!this.noPinfo) {
			pin.pinfoDiv.remove();
		}
		if (pin.editDiv) {
			pin.editDiv.parentNode.remove();
		}
		this.updateDims();
	}

	reAddInPin(pin, index) {
		if(this.inpins[pin.name] != undefined){
			return null;
		}
		this.inpins[pin.name] = pin;
		this.inpinOrder.splice(index, 0, pin.name);
		this.pinlist.push(pin);
		this.board.pins[pin.pinid] = pin;

		this.inPinsDiv.insertBefore(pin.pinDiv, this.inPinsDiv.children[index]);
		if (this.ipcNameDiv && pin.pinfoDiv) {
			this.ipcNameDiv.insertBefore(pin.pinfoDiv, this.ipcNameDiv.children[index]);
		}
		if (this.ipcEditDiv && pin.editDiv) {
			const pinfoDiv = document.createElement("div");
			pinfoDiv.className = "nodepart pinfo " + (this.side ? "outpinfo" : "inpinfo");
			pinfoDiv.setAttribute("data-nodeid", this.nodeid);
			pinfoDiv.setAttribute("data-pinid", pin.pinid);
			this.ipcEditDiv.insertBefore(pinfoDiv, this.ipcEditDiv.children[index]);
			pinfoDiv.append(pin.editDiv);
		}

		this.updateDims();
	}

	removeOutPin(pin) {
		pin.unlinkAll();
		delete this.outpins[pin.name];
		this.outpinOrder.splice(this.outpinOrder.indexOf(pin.name), 1);
		this.pinlist.splice(this.pinlist.indexOf(pin.name), 1);
		delete this.board.pins[pin.pinid];

		pin.pinDiv.remove();
		if (!this.noPinfo) {
			pin.pinfoDiv.remove();
		}
		if (pin.editDiv) {
			pin.editDiv.remove();
		}
		this.updateDims();
	}

	removePin(pin) {
		if (pin.side) {
			return this.removeOutPin(pin);
		} else {
			return this.removeInPin(pin);
		}
	}

	reAddOutPin(pin, index) {
		if(this.outpins[pin.name] != undefined){
			return null;
		}
		this.outpins[pin.name] = pin;
		this.outpinOrder.splice(index, 0, pin);
		this.pinlist.push(pin);
		this.board.pins[pin.pinid] = pin;

		this.outPinsDiv.insertBefore(pin.pinDiv, this.inPinsDiv.children[index]);
		this.outPinfosDiv.insertBefore(pin.pinfoDiv, this.inPinfosDiv.children[index]);

		this.updateDims();
	}

	reAddPin(pin, index) {
		if (pin.side) {
			return this.reAddOutPin(pin, index);
		} else {
			return this.reAddInPin(pin, index);
		}
	}

	move(delta) {
		this.position = this.position.addp(delta);
		this.updatePosition();
	}

	updateDims() {
		if (typeof this.customHeight == "number") {
			this.nodeDiv.style.height = this.customHeight + "px";
		} else {
			//HEIGHT
			// pins
			const hp = Math.max(this.inpinOrder.length, this.outpinOrder.length) * 24;
			// center
			if (this.centerDiv) {
				// var hc = this.centerDiv.clientHeight;
				var hc2 = 0;
				if (this.centerDiv.children.length) {
					hc2 = 60;
				}
			}
			let h = Math.max(hp, hc2);

			// header
			if (this.headerDiv) {
				h += 22;
			}
			this.nodeDiv.style.height = h + "px";
		}

		if (typeof this.customWidth == "number") {
			this.nodeDiv.style.width = this.customWidth + "px";
		} else {
			//WIDTH
			let w = 0;
			// center
			if (this.centerDiv) {
				w = this.centerDiv.scrollWidth;
			}
			// header
			if (this.headerDiv) {
				w = Math.max(w, this.headerDiv.scrollWidth);
			}
			// pinfo + inputs
			if (this.inPinfosDiv) {
				let lastPinfo = 0;
				for (const div of this.inPinfosDiv.children) {
					if (div.nodeNode == "INPUT") {
						w = Math.max(w, div.scrollWidth);
					} else {

					}
				}
			}
			if (this.outPinfosDiv) {
				for (const div of this.outPinfosDiv.children) {
					w = Math.max(w, div.scrollWidth);
				}
			}
			this.nodeDiv.style.minWidth = w + "px";
		}
	}

	setPosition(pos) {
		this.position = pos;
		this.updatePosition()
	}

	updatePosition() {
		this.position = this.position.round(2);
		this.offset = new NPoint(this.containerDiv.offsetLeft, this.containerDiv.offsetTop);
		// this.offset = new NPoint(this.containerDiv.getBoundingClientRect().left, this.containerDiv.getBoundingClientRect().top);
		this.displayPosition = this.position.subtractp(this.offset);
		this.nodeDiv.style.left = this.displayPosition.x + "px";
		this.nodeDiv.style.top = this.displayPosition.y + "px";
		this.board.redraw();
	}

	pinLinked(selfPin, otherPin) {}

	pinUnlinked(selfPin, otherPin) {}

	linkedPinChangedType(thisPin, changedPin, from, to) {}

	linkedPinChangedByRef(thisPin, changedPin, from, to) {}

	returnValRequested(pin) {}

	inputExecuted(pin) {}

	getValue(pin) {
		if (!pin.type || (pin.type && !pin.type.hasValue)) {
			console.log("Can't get a return value from (" + pin.name + ")!");
			return null;
		}
		if (pin.side) { // if called on an output, run node logic
			return this.returnValRequested(pin);
		} else { // if called on an input, get value from the connected output
			if (pin.linkNum > 0) {
				return pin.getSingleLinked().getValue();
			} else { // has no connected output...
				return pin.defaultVal;
			}
		}
	}

	// shortcut to get input by name
	inputN(inpinName) {
		return this.getValue(this.inpins[inpinName]);
	}

	// shortcut to get input by index
	inputI(i) {
		return this.getValue(this.inpinOrder[i]);
	}

	// shortcut to execute by name
	execN(outpinName) {
		this.execute(this.outpins[outpinName]);
	}

	getOutputVarName(pin) {
		return "var";
	}

	fullSCompile(pin) {
		if (pin.linkNum !== 1) {
			console.log(pin.name + " has invalid number of inputs!");
			return null;
		}
		const data = {
			"varNameSet": new Set(),
			"varMap": {},
			"functions": {},
			"preVars": {}
		};



		let mainPre = "void main() {\n";
		const type = pin.getSingleLinked().getReturnType();
		let mainMid = this.getSCompile(pin, type, data, [0]);

		switch (type.name) {
			case "Vec1":
				mainMid = "vec4(vec3(" + mainMid + "), 1.0)";
				break;
			case "Vec2":
				mainMid = "vec4(" + mainMid + ", 0.0, 1.0)";
				break;
			case "Vec3":
				mainMid = "vec4(" + mainMid + ", 1.0)";
				break;
			case "Vec4":
				if (numbers.has(mainMid[0])) {
					mainMid = "vec4(" + mainMid + ")";
				}
				break;
		}

		let preMain = "precision mediump float;\n\n";

		for(const pvn in data.preVars){
			preMain += data.preVars[pvn] + "\n";
		}
		preMain += "\n";
		
		for(const fnn in data.functions){
			preMain += data.functions[fnn] + "\n\n";
		}

		const vars = Object.entries(data.varMap);
		vars.sort((a, b) => a[1].depth - b[1].depth);
		for (const v of vars) {
			mainPre = mainPre + "\t" + v[1].compiled + "\n";
		}

		const out = preMain + mainPre + "\tgl_FragColor = " + mainMid + ";\n}";
		console.log(out);
		return out;
	}

	getReturnType(outpin) {
		return outpin.type;
	}

	getSCompile(pin, varType, data, depth, forceVar = false) {
		if (pin.side) {
			// if output has multiple connections, do not repeat calculation - insert variable instead
			if ((pin.linkNum > 1 || forceVar || this.alwaysVar) && !this.neverVar) {
				// check if variable has already been 'declared'
				let v = data.varMap[pin];
				let name;
				// if var has not already been 'declared,' generate a unique name
				if (v) {
					name = v.name;
				} else {
					name = this.getOutputVarName(pin);
					let num = 0;
					while (data.varNameSet.has(name + num.toString())) {
						num++;
					}
					name = name + num.toString();
					data.varNameSet.add(name);

					const dt = data.varMap[pin];
					const depth2 = (dt === undefined) ? 0 : dt.depth;
					depth[0] = Math.max(depth[0], depth2);

					let cpd = this.scompile(pin, varType, data, depth);
					if (numbers.has(cpd[0])) {
						cpd = varType.compileName + "(" + cpd + ")";
					}
					const compiled = varType.compileName + " " + name + " = " + cpd + ";";

					data.varMap[pin] = {
						"depth": depth[0],
						"compiled": compiled,
						"name": name
					};

					// keep track of 'depth' to know which variables need to be declared before others
					depth[0]++;
				}
				return name;
			} else {
				return this.scompile(pin, varType, data, depth);
			}
		} else {
			if (pin.linkNum) {
				const link = pin.getSingleLinked();
				const otherType = link.getReturnType();
				if (!otherType) {
					this.board.env.logt(link.name + ":" + link.node.name + " has no return type!");
				} else {
					if (varType === null) {
						return link.node.getSCompile(link, link.getReturnType(), data, depth, forceVar);
					}
					switch (varType.name) {
						case "Vec1":
							switch (otherType.name) {
								case "Vec1":
									return link.node.getSCompile(link, NVector1, data, depth, forceVar);
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec1 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec3 to Vec1 at " + pin.name + ":" + this.type);
									return null;
								case "Vec4":
									this.board.env.logt("Cannot convert Vec4 to Vec1 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec2":
							switch (otherType.name) {
								case "Vec1":
									return "vec2(" + link.node.getSCompile(link, NVector1, data, depth, forceVar) + ")";
								case "Vec2":
									return link.node.getSCompile(link, NVector2, data, depth, forceVar);
								case "Vec3":
									this.board.env.logt("Cannot convert Vec3 to Vec2 at " + pin.name + ":" + this.type);
									return null;
								case "Vec4":
									this.board.env.logt("Cannot convert Vec4 to Vec2 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec3":
							switch (otherType.name) {
								case "Vec1":
									return "vec3(" + link.node.getSCompile(link, NVector1, data, depth, forceVar) + ")";
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec3 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									return link.node.getSCompile(link, NVector3, data, depth, forceVar);
								case "Vec4":
									this.board.env.logt("Cannot convert Vec4 to Vec3 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec4":
							switch (otherType.name) {
								case "Vec1":
									return "vec4(" + link.node.getSCompile(link, NVector1, data, depth, forceVar) + ")";
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec4 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec4 to Vec4 at " + pin.name + ":" + this.type);
									return null;
								case "Vec4":
									return link.node.getSCompile(link, NVector4, data, depth, forceVar);
							}
					}
				}
			} else {
				if (pin.multiTyped) {
					this.board.env.logt("Failed to compile shader - unlinked pin " + pin.name + ":" + this.type + " has no default value!");
					return null;
				} else {
					switch (varType.name) {
						case "Vec1":
							switch (pin.type.name) {
								case "Vec1":
									return NVector1.scompile(pin.defaultVal);
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec1 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec3 to Vec1 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec4 to Vec1 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec2":
							switch (pin.type.name) {
								case "Vec1":
									return "vec2(" + NVector1.scompile(pin.defaultVal) + ")";
								case "Vec2":
									return NVector2.scompile(pin.defaultVal);
								case "Vec3":
									this.board.env.logt("Cannot convert Vec3 to Vec2 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec4 to Vec2 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec3":
							switch (pin.type.name) {
								case "Vec1":
									return "vec3(" + NVector1.scompile(pin.defaultVal) + ")";
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec3 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									return NVector3.scompile(pin.defaultVal);
								case "Vec4":
									this.board.env.logt("Cannot convert Vec4 to Vec3 at " + pin.name + ":" + this.type);
									return null;
							}
						case "Vec4":
							switch (pin.type.name) {
								case "Vec1":
									return "vec4(" + NVector1.scompile(pin.defaultVal) + ")";
								case "Vec2":
									this.board.env.logt("Cannot convert Vec2 to Vec4 at " + pin.name + ":" + this.type);
									return null;
								case "Vec3":
									this.board.env.logt("Cannot convert Vec3 to Vec4 at " + pin.name + ":" + this.type);
									return null;
								case "Vec4":
									return NVector4.scompile(pin.defaultVal);
							}
					}
				}
			}
		}
	}

	scompile(pin, varType, data, depth) {
		console.log(pin.name + ":" + this.type + " does not have an scompile function!");
		return "ERROR";
	}

	execute(pin) {
		if (!pin.isExec) {
			console.log("Can't execute a non-exec pin! (" + pin.name + ")");
			return null;
		}

		if (pin.side) { // execute the connected input
			if (pin.linkNum > 0) {
				pin.getSingleLinked().execute();
			} else {
				// nothing to execute! reached end of branch
			}
		} else { // execute this input
			this.board.execIterCount++;
			if (this.board.execIterCount >= this.board.env.maxExecIterations) {
				console.log("REACHED MAXIMUM EXECUTION ITERATIONS - STOPPING");
				return null;
			}
			this.inputExecuted(pin);
		}
	}

	// returns if node is within points
	within(a, b) {
		const min = this.displayPosition;
		const max = new NPoint(min.x + this.nodeDiv.clientWidth, min.y + this.nodeDiv.clientHeight);
		return (min.x >= a.x && max.x <= b.x && min.y >= a.y && max.y <= b.y);
	}

	// do not call manually or override
	save() {
		const node = this;
		const data = {
			"type": this.constructor.getName(),
			"id": this.nodeid,
			"ipids": this.inpinOrder.map(x => node.inpins[x].pinid),
			"opids": this.outpinOrder.map(x => node.outpins[x].pinid),
			"x": this.position.x,
			"y": this.position.y
		};
		const wrap = {
			"nodes": [data]
		}

		const links = {};
		const defVals = {};
		let hasLinks = false;
		let hasDefVs = false;
		for (const inni in this.inpinOrder) {
			const pin = this.inpins[this.inpinOrder[inni]];
			for (let link in pin.links) {
				link = parseInt(link);
				hasLinks = true;
				links[pin.pinid + link] = [pin.pinid, link];
			}
			if (!pin.multiTyped && (JSON.stringify(pin.defaultVal) !== JSON.stringify(pin.defaultDefaultVal))) {
				hasDefVs = true;
				defVals[inni] = pin.defaultVal;
			}
		}
		for (const outn of this.outpinOrder) {
			const pin = this.outpins[outn];
			for (let link in pin.links) {
				link = parseInt(link);
				hasLinks = true;
				links[link + pin.pinid] = [link, pin.pinid];
			}
		}
		if (hasLinks) {
			wrap["links"] = links;
		}
		if (Object.keys(defVals).length) {
			data["defV"] = defVals;
		}
		this.saveExtra(data);
		return wrap;
	}

	saveExtra(data) {};

	load(data) {
		this.nodeid = data.id;
		this.applyPinIDs(data);
		this.loadDefVals(data);
		this.position = new NPoint(data.x, data.y);
		this.updatePosition();
	}

	// override pin default values with those from saved node data
	// assume existing pins are in same order as data
	loadDefVals(data) {
		const defVals = data["defV"];

		if (!defVals) {
			return false;
		}

		for (const index in defVals) {
			try {
				this.inpins[this.inpinOrder[index]].setDefaultVal(defVals[index], false);
			} catch (e) {
				throw e;
			}
		}
	}

	// override pin ID's with ID's from saved node data
	// assume existing pins are in same order as data
	applyPinIDs(data) {
		for (let i = 0; i < this.inpinOrder.length; i++) {
			this.inpins[this.inpinOrder[i]].pinid = data.ipids[i];
		}
		for (let i = 0; i < this.outpinOrder.length; i++) {
			this.outpins[this.outpinOrder[i]].pinid = data.opids[i];
		}
	}

	static getName() {
		return "Unknode";
	}

	getSize() {
		return new Point(this.nodeDiv.clientWidth, this.nodeDiv.clientHeight);
	}

	makeContextMenu(event) {
		const node = this;
		const brd = this.board;
		const menu = new NCtxMenu(this.board, event);
		menu.setHeader(this.constructor.getName() + " Node" + (this.selected ? " (selected)" : ""));

		let op;

		op = new NCtxMenuOption("Details");
		op.action = function(e) {
			brd.applyMenu(node.makeDetailsMenu(event));
			return true;
		}
		menu.addOption(op);

		op = new NCtxMenuOption("Copy");
		op.action = function(e) {
			brd.copyNodes([node]);
		}
		menu.addOption(op);

		op = new NCtxMenuOption("Cut");
		op.action = function(e) {
			brd.cutNodes([node]);
		}
		menu.addOption(op);

		op = new NCtxMenuOption("Duplicate");
		op.action = function(e) {
			const newNode = brd.duplicateNode(node);
			brd.addAction(new ActDuplicateNode(brd, newNode));
			brd.deselectAllNodes();
			brd.selectNode(newNode);
		}
		menu.addOption(op);

		let hasInLinks = false;
		let hasOutLinks = false;
		for (const pinid in this.inpins) {
			if (this.inpins[pinid].linkNum) {
				hasInLinks = true;
				break;
			}
		}

		for (const pinid in this.outpins) {
			if (this.outpins[pinid].linkNum) {
				hasOutLinks = true;
				break;
			}
		}

		if (hasInLinks) {
			op = new NCtxMenuOption("Unlink All Inputs");
			op.action = function(e) {
				brd.addAction(new ActUnlinkPins(brd, Object.values(node.inpins)));
				node.unlinkAllInpins();
			}
			menu.addOption(op);
		}
		if (hasOutLinks) {
			op = new NCtxMenuOption("Unlink All Outputs");
			op.action = function(e) {
				brd.addAction(new ActUnlinkPins(brd, Object.values(node.outpins)));
				node.unlinkAllOutpins();
			}
			menu.addOption(op);
		}

		if (hasInLinks && hasOutLinks) {
			op = new NCtxMenuOption("Unlink All");
			op.action = function(e) {
				brd.addAction(new ActUnlinkPins(brd, node.pinlist.slice()));
				node.unlinkAllPins();
			}
			menu.addOption(op);
		}

		if (hasInLinks) {
			op = new NCtxMenuOption("Select Upstream Nodes");
			op.action = function(e) {
				for (const pinid in node.inpins) {
					const pin = node.inpins[pinid];
					for (const link in pin.links) {
						// 4DD 4N 4CT1ON H3R3
						// 4LSO M4K3 1T R3CURS1V3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		if (hasOutLinks) {
			op = new NCtxMenuOption("Select Downstream Nodes");
			op.action = function(e) {
				for (const pinid in node.outpins) {
					const pin = node.outpins[pinid];
					for (const link in pin.links) {
						// 4DD 4N 4CT1ON H3R3
						// 4LSO M4K3 1T R3CURS1V3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		if (hasInLinks && hasOutLinks) {
			op = new NCtxMenuOption("Select Linked Nodes");
			op.action = function(e) {
				for (const pin of node.pinlist) {
					for (const link in pin.links) {
						// 4DD 4N 4CT1ON H3R3
						// 4LSO M4K3 1T R3CURS1V3
						pin.links[link].node.select();
					}
				}
			}
			menu.addOption(op);
		}

		op = new NCtxMenuOption("Delete Node");
		op.action = function(e) {
			brd.addAction(new ActRemoveNode(brd, node));
			node.remove();
		}
		menu.addOption(op);

		return menu;
	}

	makeDetailsMenu(event) {
		const node = this;
		const brd = this.board;
		const menu = new NCtxMenu(this.board, event);
		menu.setHeader("Node Details");

		menu.addOption(new NCtxMenuOption("<div class=mih>Type:</div> \"" + this.constructor.getName() + "\""));
		menu.addOption(new NCtxMenuOption("<div class=mih>Node ID:</div> " + this.nodeid));
		menu.addOption(new NCtxMenuOption("<div class=mih>Position:</div> " + this.position.round(2).toString()));

		return menu;
	}

	onAttemptedDropLink(other) {
		return null;
	}
}

makeMultiNodeMenu = function(brd, event, nodes) {
	const node = this;
	const menu = new NCtxMenu(brd, event);
	menu.setHeader("Multiple Nodes (" + nodes.length + ")");

	let op;

	op = new NCtxMenuOption("Details");
	op.action = function(e) {
		brd.applyMenu(makeMultiNodeDetailsMenu(brd, event, nodes));
		return true;
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Delete All");
	op.action = function(e) {
		brd.addAction(new ActRemoveSelectedNodes(brd));
		for (const node of nodes) {
			node.remove();
		}
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Copy");
	op.action = function(e) {
		brd.copyNodes(nodes);
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Cut");
	op.action = function(e) {
		brd.cutNodes(nodes);
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Duplicate");
	op.action = function(e) {
		const newNodes = brd.duplicateNodes(nodes);
		brd.addAction(new ActDuplicateNodes(brd, newNodes));
		brd.deselectAllNodes();
		for (const node of newNodes) {
			brd.selectNode(node);
		}
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Export as String");
	op.action = function(e) {
		// TODO M4K3 4 T3XT4R34
		console.log(JSON.stringify(brd.saveNodes(nodes)));
	}
	menu.addOption(op);

	op = new NCtxMenuOption("Go to");
	op.action = function(e) {
		// F1X TH1S
		brd.displayOffset = getGroupCenter(nodes).multiply1(-1).add2(brd.paneDiv.width / 2, brd.paneDiv.height / 2);
		brd.redraw();
	}
	menu.addOption(op);

	let hasLinks = false;
	for (const node of nodes) {
		for (const pin of node.pinlist) {
			if (pin.linkNum) {
				hasLinks = true;
				break;
			}
		}
		if (hasLinks) {
			break;
		}
	}
	if (hasLinks) {
		op = new NCtxMenuOption("Unlink All");
		op.action = function(e) {
			const pins = [];
			for (const node of nodes) {
				pins.push(...node.pinlist);
			}
			brd.addAction(new ActUnlinkPins(brd, pins));
			for (const node of nodes) {
				node.unlinkAllPins();
			}
		}
		menu.addOption(op);

		op = new NCtxMenuOption("Detach Group");
		op.action = function(e) {
			const pendingUnlinks = [];
			for (const node of nodes) {
				for (const pin of node.pinlist) {
					for (const linkid in pin.links) {
						const other = brd.pins[linkid];
						if (!other.node.selected) {
							pendingUnlinks.push([pin, other]);
						}
					}
				}
			}
			brd.addAction(new ActRemoveLinks(brd, pendingUnlinks.map(l => [l[0].pinid, l[1].pinid])));
			pendingUnlinks.forEach(l => l[0].unlink(l[1]));
		}
		menu.addOption(op);
	}

	return menu;
}

getGroupBounds = function(nodes) {
	return {
		"min": NPoint.min(...nodes.map(x => x.position)).round(2),
		"max": NPoint.max(...nodes.map(x => x.position.add2(x.nodeDiv.clientWidth, x.nodeDiv.clientHeight))).round(2)
	}
}

getGroupCenter = function(nodes) {
	const bounds = getGroupBounds(nodes);
	return bounds.min.addp(bounds.max).divide1(2);
}

makeMultiNodeDetailsMenu = function(brd, event, nodes) {
	const node = this;
	const menu = new NCtxMenu(brd, event);
	menu.setHeader("Group Details");

	const bounds = getGroupBounds(nodes);

	menu.addOption(new NCtxMenuOption("<div class=mih>Nodes:</div> " + nodes.length));
	menu.addOption(new NCtxMenuOption("<div class=mih>Bounds:</div> " + bounds.min.toString() + ", " + bounds.max.toString()));
	menu.addOption(new NCtxMenuOption("<div class=mih>Center:</div> " + bounds.min.addp(bounds.max).divide1(2)));

	return menu;
}