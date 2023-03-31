import { jest } from '@jest/globals'
import { afterEach, beforeEach, describe, expect, it } from 'jest-ctx'
import { TextureLoader as THREETextureLoader } from 'three'
import { TextureLoader, TextureLoaderError } from '~/models/texture-loader.js'

jest.mock('three')

describe('TextureLoader', () => {
  let loader

  describe('constructor(args)', () => {
    let args, mockLoader

    beforeEach(() => {
      args = 'mock-args'
      mockLoader = {}
      THREETextureLoader.mockImplementation(() => mockLoader)
    })
    it('initializes ._loader with args', () => {
      loader = new TextureLoader(args)
      expect(THREETextureLoader).toHaveBeenCalledWith(args)
      expect(loader._loader).toBe(mockLoader)
    })
  })

  describe('load(url)', () => {
    let url, result

    beforeEach(() => {
      loader = new TextureLoader()
      url = 'http://example.com'
    })
    afterEach(() => {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(loader._loader.load).toHaveBeenCalledWith(
        url,
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      )
    })
    describe('when super.load() succeeds', () => {
      it('resolves with a Texture object', async () => {
        let mockTexture = 'mock texture'
        loader._loader.load =
          jest.fn((url, onLoad) => onLoad(mockTexture))

        result = loader.load(url)
        await expect(result).resolves.toBe(mockTexture)
      })
    })
    describe('when super.load() fails', () => {
      it('rejects with a TextureLoaderError containing the error', async () => {
        let mockError = new Error('mock error')
        loader._loader.load =
          jest.fn((url, onLoad, onProgress, onError) => onError(mockError))

        result = loader.load(url)
        await expect(result).rejects.toThrow(TextureLoaderError)
      })
    })
  })
})
