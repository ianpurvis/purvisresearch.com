import {
  ShaderChunk,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three'
import halftone_shader from '~/assets/shaders/halftone_test.glsl'

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
      fragmentShader: halftone_shader,
      vertexShader: ShaderChunk.meshbasic_vert,
    })
  }
}

export { HalftoneMaterial as default }
