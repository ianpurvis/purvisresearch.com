jest.mock('draco3dgltf/draco_decoder_gltf_nodejs.js')
jest.mock('three/examples/jsm/loaders/DRACOLoader.js')
import DracoDecoderModule from 'draco3dgltf/draco_decoder_gltf_nodejs.js'
import { DRACOLoader as THREEDRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DRACOLoader } from '~/models/draco-loader.js'

describe('DRACOLoader', () => {
  let loader

  beforeEach(() => {
    loader = new DRACOLoader()
  })

  it('extends THREE.DRACOLoader', () => {
    expect(loader).toBeInstanceOf(THREEDRACOLoader)
  })

  describe('_compileWorkerSource()', () => {
    let mocks, result

    it('combines the decoder and worker sources', () => {
      mocks = {
        decoderSource: `DracoDecoderModule = ${DracoDecoderModule.toString()}`,
        workerSource: 'mockFunctionSource'
      }
      loader._extractSourceFromFunction =
        jest.fn().mockReturnValue(mocks.workerSource)

      result = loader._compileWorkerSource()

      expect(loader._extractSourceFromFunction)
        .toHaveBeenCalledWith(DRACOLoader.DRACOWorker)
      expect(result).toMatch(mocks.decoderSource)
      expect(result).toMatch(mocks.workerSource)
    })
  })

  describe('_extractSourceFromFunction(functi0n)', () => {
    let functi0n, result

    it('unpacks worker source so that it can be immediately executed', () => {
      functi0n = function() { return 'example' }
      result = loader._extractSourceFromFunction(functi0n)
      expect(result).toMatch(/\s+return 'example';\s+/)
    })
  })

  describe('_initDecoder()', () => {
    let mocks, result

    it('initializes .workerSourceURL using draco decoder', async () => {
      mocks = {
        blob: {},
        objectURL: {},
        workerSource: {}
      }

      global.Blob =
        jest.fn().mockImplementation(() => mocks.blob)
      global.URL.createObjectURL =
        jest.fn().mockReturnValue(mocks.objectURL)
      loader._compileWorkerSource =
        jest.fn().mockReturnValue(mocks.workerSource)

      result = loader._initDecoder()

      await expect(result).resolves.toBeUndefined()
      expect(loader._compileWorkerSource).toHaveBeenCalled()
      expect(global.Blob).toHaveBeenCalledWith([mocks.workerSource])
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mocks.blob)
      expect(loader.workerSourceURL).toBe(mocks.objectURL)
    })
  })
})
