import { TextureLoader as THREETextureLoader } from 'three'

class TextureLoader extends THREETextureLoader {

  load(url, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      super.load(url, resolve, onProgress, (event) => {
        reject(new Error('TextureLoader: Could not load url.'))
      })
    })
  }
}

export { TextureLoader as default }
