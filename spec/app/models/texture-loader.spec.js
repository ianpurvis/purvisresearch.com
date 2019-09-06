jest.mock('three')
import { TextureLoader as THREETextureLoader } from 'three'
import { TextureLoader, TextureLoaderError } from '~/models/texture-loader.js'

describe('TextureLoader', () => {
  let loader

  it('extends three.js TextureLoader', () => {
    expect(TextureLoader.prototype).toBeInstanceOf(THREETextureLoader)
  })

  describe('load(url)', () => {
    let url, result

    beforeEach(() => {
      loader = new TextureLoader()
      url = 'http://example.com'
    })
    afterEach(() => {
      expect(THREETextureLoader.prototype.load).toHaveBeenCalledWith(
        url,
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      )
    })
    describe('when super.load() succeeds', () => {
      it('resolves with a Texture object', async () => {
        let mockTexture = 'mock texture'
        THREETextureLoader.prototype.load =
          jest.fn((url, onLoad, onProgress, onError) => onLoad(mockTexture))

        result = loader.load(url)
        await expect(result).resolves.toBe(mockTexture)
      })
    })
    describe('when super.load() fails', () => {
      it('rejects with a TextureLoaderError containing the error', async () => {
        let mockError = new Error('mock error')
        THREETextureLoader.prototype.load =
          jest.fn((url, onLoad, onProgress, onError) => onError(mockError))

        result = loader.load(url)
        await expect(result).rejects.toThrow(TextureLoaderError)
      })
    })
  })
})
