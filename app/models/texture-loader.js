import { TextureLoader as THREETextureLoader } from 'three'

class TextureLoaderError extends Error {
  constructor(message, innerError) {
    super(message)
    this.innerError = innerError
  }
}

class TextureLoader {

  constructor(args) {
    // Until THREE supports inheritance of TextureLoader:
    this._loader = new THREETextureLoader(args)
  }

  load(url, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      this._loader.load(url, resolve, onProgress, (error) => {
        reject(new TextureLoaderError('TextureLoader: Could not load url.', error))
      })
    })
  }
}

export { TextureLoader, TextureLoaderError }
