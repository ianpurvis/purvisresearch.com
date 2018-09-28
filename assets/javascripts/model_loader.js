import { DRACOLoader } from 'exports-loader?DRACOLoader=THREE.DRACOLoader!imports-loader?THREE=three!three/examples/js/loaders/DRACOLoader.js'
import { GLTFLoader } from 'exports-loader?GLTFLoader=THREE.GLTFLoader!imports-loader?THREE=three!three/examples/js/loaders/GLTFLoader.js'
import DracoDecoderModule from 'three/examples/js/libs/draco/gltf/draco_decoder.js'

export default class ModelLoader extends GLTFLoader {

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
    DRACOLoader.decoderModulePromise = ModelLoader.loadDracoDecoder()
  }

  parse(data, path = '/') {
    return new Promise((resolve, reject) => {
      super.parse(data, path, resolve, reject)
    })
  }
}
