class NPin {
	constructor(name, byRef, ...types) {
		this.node = null;
		this.side = null;
		this.name = name;
		this.byRef = byRef;
		if(types.length == 0){
			types = [NObject];
		}
		this.multiTyped = types.length > 1;
		if (types.length == 1) {
			this.type = types[0];
			this.types = null;
			this.color = types[0].color;
		} else {
			this.type = null;
			this.types = types;
			this.color = avgHex(...types.map(x=>x.color));
		}

		this.pinDiv = null;
	}

	canPlugInto(otherPin) {
		if (!this.side) {
			console.log("canPlugInto called by an input pin!");
			return false;
		}

		if (this.side == otherPin.side) {
			return false;
		}

		if (this.multiTyped) {
			if (otherPin.multiTyped) {
				for (const outType of this.types) {
					for (const inType of otherPin.types) {
						if (outType.isA(inType)) {
							return true;
						}
					}
				}
				return false;
			} else {
				for (const outType of this.types) {
					if (outType.isA(otherPin.type)) {
						return true;
					}
				}
				return false;
			}
		} else {
			if (otherPin.multiTyped) {
				for (const inType of otherPin.types) {
					if (this.type.isA(inType)) {
						return true;
					}
				}
				return false;
			} else {
				return this.type.isA(otherPin.type);
			}
		}
	}

	createPinDiv() {
		this.pinDiv = document.createElement("div");
		this.pinDiv.className = this.side ? "outpin pin" : "inpin pin";
		if(this.multiTyped){
			const colors = this.types.map(x=>x.color);
			const end = colors.length-1;
			const percent = (100.0 / colors.length);
			let args = colors[0] + ", " + colors[0] + " " + percent + "%";
			for(let i=1; i<end; i++){
				const pc = percent * i;
				args += ", " + colors[i] + " " + pc + "%, " + colors[i+1] + " " + pc + "%";
			}
			args += ", " + colors[end] + " " + percent * end + "%";
			this.pinDiv.style.background = "linear-gradient(" + args + ")";

			this.pinDiv.style.border = "2px solid " + this.color;
		}else{
			this.pinDiv.style.backgroundColor = this.color;
		}
		return this.pinDiv;
	}
}