#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform sampler2D map;

varying vec2 vUv;

void main() {
  float frequency = 60.0; // Needed globally for lame version of aastep()

  // Use a texture to modulate the size of the dots
  vec3 texcolor = texture2D(map, vUv).rgb; // Unrotated coords

  // Pre-filter brightness
  float brightness = 0.25;
  texcolor += brightness;

  // Pre-filter contrast
  float contrast = 0.50;
  if (contrast > 0.0) {
    texcolor = (texcolor - 0.5) / (1.0 - contrast) + 0.5;
  } else {
    texcolor = (texcolor - 0.5) * (1.0 + contrast) + 0.5;
  }

  vec3 black = vec3(0.0, 0.0, 0.0);

  // Perform a rough RGB-to-CMYK conversion
  vec4 cmyk;
  cmyk.xyz = 1.0 - texcolor;
  cmyk.w = min(cmyk.x, min(cmyk.y, cmyk.z)); // Create K
  cmyk.xyz -= cmyk.w; // Subtract K equivalent from CMY

  // Distance to nearest point in a grid of
  // (frequency x frequency) points over the unit square
  vec2 st2 = mat2(0.707, -0.707, 0.707, 0.707) * vUv;
  vec2 nearest = 2.0*fract(frequency * st2) - 1.0;
  float dist = length(nearest);

  // Distance to nearest point in a grid of
  // (frequency x frequency) points over the unit square
  vec2 Kst = frequency*mat2(0.707, -0.707, 0.707, 0.707)*vUv;
  vec2 Kuv = 2.0*fract(Kst)-1.0;
  float k = step(0.0, sqrt(cmyk.w)-length(Kuv));
  vec2 Cst = frequency*mat2(0.966, -0.259, 0.259, 0.966)*vUv;
  vec2 Cuv = 2.0*fract(Cst)-1.0;
  float c = step(0.0, sqrt(cmyk.x)-length(Cuv));
  vec2 Mst = frequency*mat2(0.966, 0.259, -0.259, 0.966)*vUv;
  vec2 Muv = 2.0*fract(Mst)-1.0;
  float m = step(0.0, sqrt(cmyk.y)-length(Muv));
  vec2 Yst = frequency*vUv; // 0 deg
  vec2 Yuv = 2.0*fract(Yst)-1.0;
  float y = step(0.0, sqrt(cmyk.z)-length(Yuv));

  vec3 rgbscreen = 1.0 - 0.9*vec3(c,m,y);
  rgbscreen = mix(rgbscreen, black, k);

  gl_FragColor = vec4(rgbscreen, 1.0);
}
