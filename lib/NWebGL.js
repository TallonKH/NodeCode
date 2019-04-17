const vertCode = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;

void main() {
	gl_Position = vec4(vertPosition, 0.0, 1.0);
  fragTexCoord = vertTexCoord;
}
`;

const fragCode = `
precision mediump float;

varying vec2 fragTexCoord;

void main() {
  gl_FragColor = vec4(fragTexCoord,0.0,1.0);
}
`;

function exportTexture(frag, width, height, onLoadFunc) {
	const cvs = document.createElement("canvas");
	cvs.width = width;
	cvs.height = height;
	setupWebGLRectangle(cvs, frag, onLoadFunc, true);
}

function exportAnimationPrompt() {
	const dims = exportDimensionsPrompt();
	if(dims == null){
		return null;
	}

	let delay = prompt("Millisecond delay between frames?", 100)
	if (delay == null) {
		return null;
	}
	while (!/^[0-9]+?$/.test(delay)) {
		delay = prompt("Please enter a valid frame delay! (integer > 0)", 100);
		if (delay == null) {
			return null;
		}
	}
	delay = parseInt(delay, 10);

	let frames = prompt("Number of frames?", 10)
	if (frames == null) {
		return null;
	}
	while (!/^[0-9]+?$/.test(frames)) {
		frames = prompt("Please enter a valid frame count! (integer > 0)", 10);
		if (frames == null) {
			return null;
		}
	}
	frames = parseInt(frames, 10);

	return {
		"frameDelay": delay,
		"frameCount": frames,
		"width": dims[0],
		"height": dims[1]
	}
}

function exportDimensionsPrompt() {
	let dims = prompt("Image size in pixels? (ie: 512, 512x256)", 128);
	if (dims == null) {
		return null;
	}
	while (!/^[0-9]+(x[0-9]+)?$/.test(dims)) {
		dims = prompt("Please enter a valid image size! (ie: 512, 512x256)", 128);
		if (dims == null) {
			return null;
		}
	}

	const splitIndex = dims.indexOf("x");
	if (splitIndex == -1) {
		dims = parseInt(dims, 10);
		if (dims > 4096) {
			alert("Image too big! The maximum size is 4096x4096. ");
			return null;
		}
		const s = parseInt(dims, 10);
		return [s, s];
	} else {
		const x = dims.substring(0, splitIndex);
		const y = dims.substring(splitIndex + 1);
		if (x * y > 16777216) {
			alert("Image too big! The maximum size is 4096x4096. ");
			return null;
		}
		return [x, y];
	}
}

function loadTexture(gl, url, index, location, callback) {
	const texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + index);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

	const image = new Image();
	image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// gl.generateMipmap(gl.TEXTURE_2D);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.uniform1i(location, index);
		callback();
	};
	image.src = url;

	return texture;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function setupWebGLRectangle(canvas, frag, onLoadFunc, preserve = false) {
	let gl = canvas.getContext("webgl", {
		preserveDrawingBuffer: preserve // this should only be true for exporting canvas data
	});

	if (!gl) {
		gl = canvas.getContext('experimental-webgl');
		if (!gl) {
			console.error("WebGL is not supported by this browser!");
			return null;
		}
	}

	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
		return null;
	}

	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, frag.text);
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
		return null;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	gl.detachShader(program, vertShader);
	gl.detachShader(program, fragShader);
	gl.deleteShader(vertShader);
	gl.deleteShader(fragShader);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);

	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	const planeVerts = [-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0];
	const vertBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVerts), gl.STATIC_DRAW);

	const planeIndices = [0, 1, 2, 2, 1, 3];
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeIndices), gl.STATIC_DRAW);

	const posAttribLoc = gl.getAttribLocation(program, "vertPosition");
	gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(posAttribLoc);

	const texCoordAttribLoc = gl.getAttribLocation(program, "vertTexCoord");
	gl.vertexAttribPointer(texCoordAttribLoc, 2, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(texCoordAttribLoc);

	gl.useProgram(program);

	const uniforms = {};
	let alreadyLoaded = false;

	const glPackage = {
		"program": program,
		"context": gl,
		"uniforms": [],
		"redraw": function() {
			gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);
		},
		"delete": function() {
			gl.deleteProgram(program)
		}
	}

	for (const unfn in frag.uniforms) {
		const unf = frag.uniforms[unfn];
		uniforms[unfn] = Object.assign({}, unf);
		const location = gl.getUniformLocation(program, unf.name);
		uniforms[unfn].location = location;

		glPackage.uniforms = uniforms;

		if (unf.type == "sampler2D") {
			loadTexture(gl, unf.src, unf.texIndex, location, function() {
				frag.pendingItems--;
				if (frag.pendingItems == 0) {
					alreadyLoaded = true;
					onLoadFunc(glPackage);
				}
				return null;
			});
		}
	}
	// if nothing to load, load
	if (!alreadyLoaded && !frag.pendingItems) {
		onLoadFunc(glPackage);
	}

	return glPackage;
}

function setupWebGL3D(canvas, frag, preserve = false) {
	let gl = canvas.getContext("webgl", {
		preserveDrawingBuffer: preserve
	});

	if (!gl) {
		gl = canvas.getContext('experimental-webgl');
		if (!gl) {
			console.error("WebGL is not supported by this browser!");
			return null;
		}
	}

	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
		return null;
	}

	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, frag);
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
		return null;
	}

	const program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	gl.detachShader(program, vertShader);
	gl.detachShader(program, fragShader);
	gl.deleteShader(vertShader);
	gl.deleteShader(fragShader);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);

	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	const planeVerts = [-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0];
	const vertBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVerts), gl.STATIC_DRAW);

	const planeIndices = [0, 1, 2, 2, 1, 3];
	const indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeIndices), gl.STATIC_DRAW);

	const posAttribLoc = gl.getAttribLocation(program, "vertPosition");
	gl.vertexAttribPointer(posAttribLoc, 2, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(posAttribLoc);

	const texCoordAttribLoc = gl.getAttribLocation(program, "vertTexCoord");
	gl.vertexAttribPointer(texCoordAttribLoc, 2, gl.FLOAT, gl.FALSE, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
	gl.enableVertexAttribArray(texCoordAttribLoc);

	gl.useProgram(program);

	return {
		"program": program,
		"context": gl,
		"redraw": function() {
			gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);
		},
		"delete": function() {
			gl.deleteProgram(program)
		}
	};
}