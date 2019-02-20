import {
  ShaderChunk,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three'
import halftoneFilterFragmentShader from '~/assets/shaders/halftone_filter.frag.glsl'

class HalftoneMaterial extends ShaderMaterial {
  constructor({map, opacity=1.0, transparent=false}) {
    super({
      defines: {
        USE_MAP: true,
      },
      extensions: {
        derivatives: true,
      },
      uniforms: UniformsUtils.merge([
        UniformsLib.common,
        {
          map: { value: map },
          opacity: { value: opacity },
        }
      ]),
      fragmentShader: halftoneFilterFragmentShader,
      vertexShader: ShaderChunk.meshbasic_vert,
      opacity: opacity,
      transparent: transparent,
    })
  }
}

export { HalftoneMaterial as default }
