jest.mock('three/examples/jsm/loaders/GLTFLoader.js')
import { GLTFLoader as THREEGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from '~/models/gltf-loader.js'

describe('GLTFLoader', () => {
  let loader

  it('extends THREE.GLTFLoader', () => {
    expect(GLTFLoader.prototype).toBeInstanceOf(THREEGLTFLoader)
  })

  describe('parse(data)', () => {
    let data, result

    beforeEach(() => {
      loader = new GLTFLoader()
      data = 'mockData'
    })
    afterEach(() => {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(THREEGLTFLoader.prototype.parse).toHaveBeenCalledWith(
        data,
        '/',
        expect.any(Function),
        expect.any(Function)
      )
    })
    describe('when super.parse() succeeds', () => {
      it('resolves with a GLTF object', async () => {
        let mockGLTF = 'mock gltf'
        THREEGLTFLoader.prototype.parse =
          jest.fn((data, path, onLoad, onError) => onLoad(mockGLTF))

        result = loader.parse(data)
        await expect(result).resolves.toBe(mockGLTF)
      })
    })
    describe('when super.parse() fails', () => {
      it('rejects with the error', async () => {
        let mockError = new Error('mock error')
        THREEGLTFLoader.prototype.parse =
          jest.fn((data, path, onLoad, onError) => onError(mockError))

        result = loader.parse(data)
        await expect(result).rejects.toThrow(mockError)
      })
    })
  })
})
