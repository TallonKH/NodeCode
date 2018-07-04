uniform mediump float time;
uniform int resX;
uniform int resY;

void main() {
	mediump vec2 coord = mod(gl_PointCoord / vec2(1, 1), 1.0);
	gl_FragColor = vec4(coord, mod(time, 1.0), 1.0);
}