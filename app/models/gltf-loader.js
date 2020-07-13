import { GLTFLoader as THREEGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


class GLTFLoader extends THREEGLTFLoader {

  async load(url) {
    return new Promise((resolve, reject) => {
      super.load(url, resolve, undefined, reject)
    })
  }
}

export { GLTFLoader }
