import { DRACOLoader } from '~/models/draco-loader.js'
import { GLTFLoader as THREEGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


class GLTFLoader extends THREEGLTFLoader {

  parse(data, path = '/') {
    return new Promise((resolve, reject) => {
      super.parse(data, path, resolve, reject)
    })
  }
}

export { GLTFLoader }
