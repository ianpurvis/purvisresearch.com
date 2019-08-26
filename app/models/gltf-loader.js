import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader as THREEGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import DracoDecoderModule from 'draco3dgltf/draco_decoder_gltf_nodejs.js'


class GLTFLoader extends THREEGLTFLoader {

  static loadDracoDecoder() {
    return new Promise((resolve) => {
      let config = {
        onModuleLoaded: (decoder) => {
          // Module is Promise-like. Wrap before resolving to avoid loop.
          resolve({decoder: decoder})
        }
      }
      DracoDecoderModule(config)
    })
  }

  constructor(manager) {
    super(manager)
    this.dracoLoader = new DRACOLoader()

    // Lazy-load DRACO decoder
    if (DRACOLoader.decoderModulePromise) return
    DRACOLoader.decoderModulePromise = GLTFLoader.loadDracoDecoder()
  }

  parse(data, path = '/') {
    return new Promise((resolve, reject) => {
      super.parse(data, path, resolve, reject)
    })
  }
}

export { GLTFLoader }
