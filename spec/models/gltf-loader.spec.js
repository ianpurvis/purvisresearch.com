jest.mock('three/examples/jsm/loaders/GLTFLoader.js')

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { GLTFLoader as THREEGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from '~/models/gltf-loader.js'

describe('GLTFLoader', () => {
  let loader

  it('extends THREE.GLTFLoader', () => {
    expect(GLTFLoader.prototype).toBeInstanceOf(THREEGLTFLoader)
  })

  describe('load(url)', () => {
    let url, result

    beforeEach(() => {
      loader = new GLTFLoader()
      url = 'http://example.com/mock-file'
    })
    afterEach(() => {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(THREEGLTFLoader.prototype.load).toHaveBeenCalledWith(
        url,
        expect.any(Function),
        undefined,
        expect.any(Function)
      )
    })
    describe('when super.load() succeeds', () => {
      it('resolves with a GLTF object', async () => {
        let mockGLTF = 'mock gltf'
        THREEGLTFLoader.prototype.load =
          jest.fn((url, onLoad) => onLoad(mockGLTF))

        result = loader.load(url)
        await expect(result).resolves.toBe(mockGLTF)
      })
    })
    describe('when super.load() fails', () => {
      it('rejects with the error', async () => {
        let mockError = new Error('mock error')
        THREEGLTFLoader.prototype.load =
          jest.fn((url, onLoad, onProgress, onError) => onError(mockError))

        result = loader.load(url)
        await expect(result).rejects.toThrow(mockError)
      })
    })
  })
})
