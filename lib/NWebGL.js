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

function setupWebGLRectangle(canvas, frag) {
	const gl = canvas.getContext("webgl");

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
	gl.shaderSource(fragShader, fragCode);
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

	const planeVerts = [-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1];
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
	gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);

	return {
		"context": gl,
		"redraw": function() {
			gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);
		},
	};
}