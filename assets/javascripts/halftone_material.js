import {
  ShaderChunk,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three'
import halftoneFilterFragmentShader from '~/assets/shaders/halftone_filter.frag.glsl'

class HalftoneMaterial extends ShaderMaterial {
  constructor({map}) {
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
          map: { value: map }
        }
      ]),
      fragmentShader: halftoneFilterFragmentShader,
      vertexShader: ShaderChunk.meshbasic_vert,
    })
  }
}

export { HalftoneMaterial as default }
