import decoderModuleSource from '../../lib/draco/decoder-worker-fixed16mb.js?raw'
import decoderWasmPath from '../../lib/draco/decoder-worker-fixed16mb.wasm?url'
import { DRACOLoader as THREEDRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

class DRACOLoader extends THREEDRACOLoader {

  // Overridden to use a webpacked decoder.
  // Rather than preloading the wasmBinary and sending via the init message,
  // shim the Emscripten module function to fetch it via locateFile:
  async _initDecoder() {
    const workerSource = `
      ${decoderModuleSource}

      var _DracoDecoderModule = DracoDecoderModule
      DracoDecoderModule = (config) => {
        config.locateFile = () => new URL('${decoderWasmPath}', self.origin).href;
        return _DracoDecoderModule(config);
      };

      (${DRACOLoader.DRACOWorker}).call(self);
    `
    const workerSourceBlob = new Blob([ workerSource ])
    this.workerSourceURL = URL.createObjectURL(workerSourceBlob)
  }
}

export { DRACOLoader }
