jest.mock('draco/decoder-worker-fixed16mb.js', () => 'mock-source')
jest.mock('three/examples/jsm/loaders/DRACOLoader.js')
import decoderModuleSource from 'draco/decoder-worker-fixed16mb.js'
import decoderWasmPath from 'draco/decoder-worker-fixed16mb.wasm'
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

  describe('_initDecoder()', () => {

    it('compiles worker source into a blob and assigns the object URL to .workerSourceURL', async () => {
      const mockUrl = {}
      const mockBlob = {}
      global.Blob = jest.fn(([ workerSource ]) => {
        expect(workerSource).toMatch(decoderModuleSource)
        expect(workerSource).toMatch(decoderWasmPath)
        expect(workerSource).toMatch(DRACOLoader.DRACOWorker.toString())
        return mockBlob
      })
      global.URL.createObjectURL = jest.fn(() => mockUrl)

      await loader._initDecoder()

      expect(global.Blob).toHaveBeenCalled()
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(loader.workerSourceURL).toBe(mockUrl)
    })
  })
})
