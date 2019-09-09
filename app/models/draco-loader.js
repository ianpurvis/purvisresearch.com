import { DRACOLoader as THREEDRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import DracoDecoderModule from 'draco3dgltf/draco_decoder_gltf_nodejs.js'


class DRACOLoader extends THREEDRACOLoader {

  static buildWorkerSourceURL() {
    let decoderSource = DracoDecoderModule.toString()

    // Expose the decoder as the global variable that the
    // worker source expects:
    decoderSource = `DracoDecoderModule = ${decoderSource}`

    let workerSource = DRACOLoader.DRACOWorker.toString()

    // Unpack worker source so that it is immediately
    // executed in the worker context:
    workerSource = workerSource.substring(
      workerSource.indexOf('{') + 1,
      workerSource.lastIndexOf('}')
    )

    let body = [
      '/* draco decoder */',
      decoderSource,
      '/* worker */',
      workerSource
    ].join('\n')

    return URL.createObjectURL(new Blob([body]))
  }

  constructor(args) {
    super(args)
    this.decoderConfig.type = 'js'
    this.workerSourceURL = DRACOLoader.buildWorkerSourceURL()
    this.decoderPending = Promise.resolve()
  }
}

export { DRACOLoader }
