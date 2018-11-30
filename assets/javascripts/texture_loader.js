import { TextureLoader as THREETextureLoader } from 'three'

class TextureLoader extends THREETextureLoader {

  load(url, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      super.load(url, resolve, onProgress, reject)
    })
  }
}

export { TextureLoader as default }
