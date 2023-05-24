import { Matrix3, ShaderChunk, ShaderMaterial } from 'three'
import halftoneFilterFragmentShader from '~/assets/shaders/halftone_filter.frag.glsl?raw'

class HalftoneMaterial extends ShaderMaterial {
  constructor({map, opacity=1.0, transparent=false}) {
    super({
      extensions: {
        derivatives: true,
      },
      uniforms: {
        map: { value: map },
        opacity: { value: opacity },
        uvTransform: { value: new Matrix3() },
      },
      fragmentShader: halftoneFilterFragmentShader,
      vertexShader: ShaderChunk.meshbasic_vert,
      transparent: transparent,
    })
  }

  get map() {
    return this.uniforms.map.value
  }

  set map(value) {
    this.uniforms.map.value = value
  }

  get opacity() {
    return this.uniforms.opacity.value
  }

  set opacity(value) {
    // Exit early if called from super constructor before this.uniforms exist.
    if (!this.uniforms) return
    this.uniforms.opacity.value = value
  }
}

export { HalftoneMaterial as default }
