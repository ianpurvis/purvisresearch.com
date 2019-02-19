// Halftone Filter Fragment Shader
// Based on GLSL halftone shader demo for WebGL
// by Stefan Gustavson 2012-02-16 (stefan.gustavson@liu.se)
// http://weber.itn.liu.se/~stegu/webglshadertutorial/shadertutorial.html
precision highp float;

uniform sampler2D map;

varying vec2 vUv;

const vec3 BLACK = vec3(0.0, 0.0, 0.0);
const float BRIGHTNESS = 0.25;
const float CONTRAST = 0.50;
const float FREQUENCY = 60.0;


vec4 toCMYK(vec3 rgb) {
  vec4 cmyk;
  cmyk.xyz = 1.0 - rgb;
  cmyk.w = min(cmyk.x, min(cmyk.y, cmyk.z)); // Create K
  cmyk.xyz -= cmyk.w; // Subtract K equivalent from CMY

  return cmyk;
}


vec4 toRGBA(vec4 cmyk) {
  vec4 rgba;
  rgba.rgb = 1.0 - cmyk.xyz;
  rgba.rgb = mix(rgba.rgb, BLACK, cmyk.w);
  rgba.a = 1.0;

  return rgba;
}


void main() {
  vec3 rgb = texture2D(map, vUv).rgb;

  // Filter original texture color
  rgb = rgb + BRIGHTNESS;
  rgb = (rgb - 0.5) / (1.0 - CONTRAST) + 0.5;

  // Given a halftone grid for each CMYK component color, calculate the
  // fragment's distance to the nearest grid point.  If the fragment falls
  // within range of the grid point, include the color in the final shade.
  // Each grid consists of (frequency x frequency) dots over the unit square,
  // and is rotated according to color halftone tradition.
  vec4 cmyk = toCMYK(rgb);

  // Cyan grid rotated 15 degrees
  vec2 Cst = FREQUENCY*mat2(0.966, -0.259, 0.259, 0.966)*vUv;
  vec2 Cuv = 2.0*fract(Cst)-1.0;
  cmyk.x = step(0.0, sqrt(cmyk.x)-length(Cuv));

  // Magenta grid rotated -15 degrees
  vec2 Mst = FREQUENCY*mat2(0.966, 0.259, -0.259, 0.966)*vUv;
  vec2 Muv = 2.0*fract(Mst)-1.0;
  cmyk.y = step(0.0, sqrt(cmyk.y)-length(Muv));

  // Yellow grid rotated 0 degrees
  vec2 Yst = FREQUENCY*vUv;
  vec2 Yuv = 2.0*fract(Yst)-1.0;
  cmyk.z = step(0.0, sqrt(cmyk.z)-length(Yuv));

  // Black grid rotated 45 degrees
  vec2 Kst = FREQUENCY*mat2(0.707, -0.707, 0.707, 0.707)*vUv;
  vec2 Kuv = 2.0*fract(Kst)-1.0;
  cmyk.w = step(0.0, sqrt(cmyk.w)-length(Kuv));

  gl_FragColor = toRGBA(cmyk);
}
