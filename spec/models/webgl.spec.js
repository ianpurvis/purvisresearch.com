import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import { isWebGLAvailable, detectWebGL } from '~/models/webgl.js'

describe('WebGL', () => {
  describe('detectWebGL(canvas)', () => {
    let canvas, result

    beforeEach(() => {
      global.console.warn = jest.fn()
      global.window.WebGLRenderingContext = 'fake-interface'
      canvas = {
        getContext: jest.fn()
      }
    })
    describe('given a canvas with webgl', () => {
      beforeEach(() => {
        canvas.getContext.mockReturnValue(true)
        result = detectWebGL(canvas)
      })
      it('tries to get a webgl context', () => {
        expect(canvas.getContext).toHaveBeenCalled()
      })
      it('does not log a console warning', () => {
        expect(global.console.warn).not.toHaveBeenCalled()
      })
      it('returns true', () => {
        expect(result).toBe(true)
      })
    })
    describe('given a canvas without webgl', () => {
      beforeEach(() => {
        canvas.getContext.mockReturnValue(false)
        result = detectWebGL(canvas)
      })
      it('tries to get a webgl context', () => {
        expect(canvas.getContext).toHaveBeenCalled()
      })
      it('logs a console warning', () => {
        expect(global.console.warn).toHaveBeenCalled()
      })
      it('returns false', () => {
        expect(result).toBe(false)
      })
    })
  })
  describe('isWebGLAvailable(canvas)', () => {
    let example, mockCanvas

    beforeEach(() => {
      mockCanvas = {
        getContext: jest.fn()
      }
      example = () => isWebGLAvailable(mockCanvas)
    })
    describe('when window supports WebGLRenderingContext', () => {
      beforeEach(() => {
        global.window.WebGLRenderingContext = 'fake-interface'
      })
      describe('when canvas supports webgl', () => {
        it('returns true', () => {
          mockCanvas.getContext = jest.fn(contextType =>
            (contextType == 'webgl') ? 'mockContext' : null
          )
          expect(example()).toBe(true)
          expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl')
        })
      })
      describe('when canvas supports experimental-webgl', () => {
        it('returns true', () => {
          mockCanvas.getContext.mockImplementation(type =>
            (type == 'experimental-webgl') ? 'mockContext' : null
          )
          expect(example()).toBe(true)
          expect(mockCanvas.getContext).toHaveBeenCalledWith('experimental-webgl')
        })
      })
      describe('when canvas does not support webgl or experimental-webgl', () => {
        it('returns false', () => {
          mockCanvas.getContext.mockReturnValue(null)
          expect(example()).toBe(false)
          expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl')
          expect(mockCanvas.getContext).toHaveBeenCalledWith('experimental-webgl')
        })
      })
      describe('when an error is thrown', () => {
        it('returns false', () => {
          mockCanvas.getContext.mockImplementation(() => {
            throw new Error('Mock Error')
          })
          expect(example()).toBe(false)
        })
      })
    })
    describe('when window does not support WebGLRenderingContext', () => {
      beforeEach(() => {
        global.window.WebGLRenderingContext = undefined
      })
      it('returns false', () => {
        expect(example()).toBe(false)
      })
    })
  })
})
