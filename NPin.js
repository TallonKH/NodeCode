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
		} else {
			this.type = null;
			this.types = types;
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
			const end = this.types.length-1;
			const percent = (100.0 / this.types.length);
			let args = this.types[0].color + ", " + this.types[0].color + " " + percent + "%";
			for(let i=1; i<end; i++){
				const pc = percent * i;
				args += ", " + this.types[i].color + " " + pc + "%, " + this.types[i+1].color + " " + pc + "%";
			}
			args += ", " + this.types[end].color + " " + percent * end + "%";
			this.pinDiv.style.background = "linear-gradient(" + args + ")";

			let avgr = 0;
			let avgg = 0;
			let avgb = 0;
			for (const type of this.types){
				avgr += parseInt(type.color.substring(1,3),16);
				avgg += parseInt(type.color.substring(3,5),16);
				avgb += parseInt(type.color.substring(5,7),16);
			}
			avgr = Math.max(Math.trunc(avgr/this.types.length - 20), 0).toString(16);
			avgg = Math.max(Math.trunc(avgg/this.types.length - 20), 0).toString(16);
			avgb = Math.max(Math.trunc(avgb/this.types.length - 20), 0).toString(16);
			console.log("2px solid #" + avgr + avgg + avgb);
			this.pinDiv.style.border = "2px solid #" + avgr + avgg + avgb;
		}else{
			this.pinDiv.style.backgroundColor = this.type.color;
		}
		return this.pinDiv;
	}
}