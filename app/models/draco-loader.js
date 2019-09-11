import { DRACOLoader as THREEDRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import DracoDecoderModule from 'draco3dgltf/draco_decoder_gltf_nodejs.js'


class DRACOLoader extends THREEDRACOLoader {

  _compileWorkerSource() {
    let workerSource = [
      '/* draco decoder */',
      // The worker expecta a global DracoDecoderModule:
      `DracoDecoderModule = ${DracoDecoderModule.toString()}`,
      '/* worker */',
      this._extractSourceFromFunction(DRACOLoader.DRACOWorker)
    ].join('\n')
    return workerSource
  }

  _extractSourceFromFunction(functi0n) {
    let source = functi0n.toString()
    // Unpack worker source so that it can be immediately executed:
    source = source.substring(source.indexOf('{') + 1, source.lastIndexOf('}'))
    return source
  }

  // Overridden to use webpacked decoder
  _initDecoder() {
    let workerSource = this._compileWorkerSource()
    let workerSourceBlob = new Blob([workerSource])
    this.workerSourceURL = URL.createObjectURL(workerSourceBlob)
    return Promise.resolve()
  }
}

export { DRACOLoader }
