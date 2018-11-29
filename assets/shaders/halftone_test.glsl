#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform sampler2D map;

varying vec2 vUv; // Texcoords


void main() {
  float frequency = 40.0; // Needed globally for lame version of aastep()

  // Distance to nearest point in a grid of
  // (frequency x frequency) points over the unit square
  vec2 st2 = mat2(0.707, -0.707, 0.707, 0.707) * vUv;
  vec2 nearest = 2.0*fract(frequency * st2) - 1.0;
  float dist = length(nearest);
  // Use a texture to modulate the size of the dots
  vec3 texcolor = texture2D(map, vUv).rgb; // Unrotated coords
  float radius = sqrt(1.0-texcolor.g); // Use green channel
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 fragcolor = mix(black, white, step(radius, dist));
  gl_FragColor = vec4(fragcolor, 1.0);
}
