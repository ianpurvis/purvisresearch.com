import { WebGL } from '~/models/webgl.js'

describe('WebGL', () => {
  describe('WebGLNotAvailableError', () => {
    it('extends Error', () => {
      expect(WebGL.WebGLNotAvailableError.prototype).toBeInstanceOf(Error)
    })
  })
  describe('assertWebGLAvailable(canvas)', () => {
    let example, mockCanvas

    beforeEach(() => {
      mockCanvas = {
        getContext: jest.fn()
      }
      example = () => WebGL.assertWebGLAvailable(mockCanvas)
      jest.spyOn(WebGL, 'isWebGLAvailable')
    })
    afterEach(() => {
      WebGL.isWebGLAvailable.mockRestore()
    })
    describe('when webgl is available', () => {
      it('does not throw an error', () => {
        WebGL.isWebGLAvailable.mockReturnValue(true)
        expect(example).not.toThrow()
        expect(WebGL.isWebGLAvailable).toHaveBeenCalledWith(mockCanvas)
      })
    })
    describe('when webgl is not available', () => {
      it('throws WebGLNotAvailableError', () => {
        WebGL.isWebGLAvailable.mockReturnValue(false)
        expect(example).toThrow(WebGL.WebGLNotAvailableError)
        expect(WebGL.isWebGLAvailable).toHaveBeenCalledWith(mockCanvas)
      })
    })
  })
  describe('isWebGLAvailable(canvas)', () => {
    let example, mockCanvas

    beforeEach(() => {
      mockCanvas = {
        getContext: jest.fn()
      }
      example = () => WebGL.isWebGLAvailable(mockCanvas)
    })
    describe('when window supports WebGLRenderingContext', () => {
      beforeEach(() => {
        global.window.WebGLRenderingContext = 'mockClass'
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
