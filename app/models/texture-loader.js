import { TextureLoader as THREETextureLoader } from 'three'

class TextureLoaderError extends Error {
  constructor(message, innerError) {
    super(message)
    this.innerError = innerError
  }
}

class TextureLoader extends THREETextureLoader {

  load(url, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      super.load(url, resolve, onProgress, (error) => {
        reject(new TextureLoaderError('TextureLoader: Could not load url.', error))
      })
    })
  }
}

export { TextureLoader, TextureLoaderError }
