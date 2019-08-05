jest.mock('three')
jest.mock('three/examples/js/WebGL.js', () => ({
  isWebGLAvailable: jest.fn()
}))
jest.mock('~/mixins/graphix.js')

import graphix from '~/mixins/graphix.js'
import threeDemo from '~/mixins/three_demo.js'
import { WebGLRenderer } from 'three'
import { isWebGLAvailable } from 'three/examples/js/WebGL.js'
import { shallowMount } from '@vue/test-utils'

const shallowMountThreeDemo = (options = {}) => shallowMount({
  render: jest.fn()
}, {
  mixins: [
    threeDemo
  ],
  ...options
})

describe('three_demo', () => {
  let wrapper, mockData, mockMethods, mockRefs

  describe('hooks', () => {
    describe('beforeDestroy()', () => {
      it('stops animating and disposes', () => {
        mockMethods = {
          dispose: jest.fn(),
          stopAnimating: jest.fn()
        }
        wrapper = shallowMountThreeDemo({
          methods: mockMethods
        })
        wrapper.destroy()
        expect(mockMethods.stopAnimating).toHaveBeenCalled()
        expect(mockMethods.dispose).toHaveBeenCalled()
      })
    })
  })
  describe('methods', () => {
    let result

    describe('animate()', () => {
      let mockAnimationFrameRequestId

      it('updates, renders, and requests an animation frame callback to itself', () => {
        mockMethods = {
          update: jest.fn(),
          render: jest.fn()
        }
        wrapper = shallowMountThreeDemo({
          methods: mockMethods
        })
        mockAnimationFrameRequestId = 'example'
        global.window.requestAnimationFrame =
          jest.fn(() => mockAnimationFrameRequestId)

        wrapper.vm.animate()
        expect(mockMethods.update)
          .toHaveBeenCalled()
        expect(mockMethods.render)
          .toHaveBeenCalled()
        expect(global.window.requestAnimationFrame)
          .toHaveBeenCalledWith(wrapper.vm.animate)
        expect(wrapper.vm.animationFrame)
          .toBe(mockAnimationFrameRequestId)
      })
    })
    describe('dispose()', () => {
      describe('when renderer and scene are not present', () => {
        it('does nothing', () => {
          wrapper = shallowMountThreeDemo()
          result = wrapper.vm.dispose()
          expect(result).toBeUndefined()
        })
      })
      describe('when renderer is present', () => {
        it('disposes the renderer', () => {
          mockData = {
            renderer: {
              dispose: jest.fn(),
              getRenderTarget: jest.fn(),
            },
          }
          wrapper = shallowMountThreeDemo({
            data: () => mockData
          })
          wrapper.vm.dispose()
          expect(mockData.renderer.dispose).toHaveBeenCalled()
        })
      })
      describe('when scene is present', () => {
        it('destroys the scene', () => {
          mockData = {
            scene: {
              dispose: jest.fn(),
              traverse: jest.fn()
            },
          }
          wrapper = shallowMountThreeDemo({
            data: () => mockData
          })
          wrapper.vm.dispose()
          expect(mockData.scene.traverse).toHaveBeenCalled()
          expect(mockData.scene.dispose).toHaveBeenCalled()
        })
      })
    })
    describe('deltaTime()', () => {
      it('returns elapsed clock ms multiplied by the speed of life', () => {
          mockData = {
            clock: {
              getDelta: jest.fn().mockReturnValue(100)
            },
            speedOfLife: 0.5
          }
          wrapper = shallowMountThreeDemo({
            data: () => mockData
          })
          result = wrapper.vm.deltaTime()
          expect(result).toBe(mockData.clock.getDelta() * mockData.speedOfLife)
      })
    })
    describe('frame()', () => {
      it('returns the canvas height, width, and aspect', () => {
        mockRefs = {
          canvas: {
            clientHeight: 100,
            clientWidth: 100,
          }
        }
        wrapper = shallowMountThreeDemo()
        wrapper.vm.$refs = mockRefs
        result = wrapper.vm.frame()
        expect(result).toStrictEqual({
          height: mockRefs.canvas.clientHeight,
          width: mockRefs.canvas.clientWidth,
          aspect: mockRefs.canvas.clientWidth / mockRefs.canvas.clientHeight
        })
      })
    })
    describe('load()', () => {
      describe('when webgl is available', () => {
        it('initializes the renderer and starts animating', () => {
          mockMethods = {
            frame: jest.fn().mockReturnValue({
              height: 'mockHeight',
              width: 'mockWidth'
            }),
            startAnimating: jest.fn()
          }
          mockRefs = {
            canvas: 'mockCanvas'
          }
          isWebGLAvailable.mockReturnValue(true)
          // For some reason, these methods don't get mocked automatically:
          Object.assign(WebGLRenderer.prototype, {
            setPixelRatio: jest.fn(),
            setSize: jest.fn()
          })
          window.devicePixelRatio = 'mockDevicePixelRatio'
          global.Math.max = jest.fn().mockReturnValue('mockPixelRatio')

          wrapper = shallowMountThreeDemo({
            methods: mockMethods,
          })
          wrapper.vm.$refs = mockRefs

          result = wrapper.vm.load()
          expect(isWebGLAvailable).toHaveBeenCalled()
          expect(mockMethods.frame).toHaveBeenCalled()
          expect(global.Math.max).toHaveBeenCalledWith('mockDevicePixelRatio', 2)
          expect(WebGLRenderer).toHaveBeenCalledWith({
            alpha: true,
            antialias: false,
            canvas: mockRefs.canvas,
          })
          expect(wrapper.vm.renderer.setPixelRatio)
            .toHaveBeenCalledWith('mockPixelRatio')
          expect(wrapper.vm.renderer.setSize)
            .toHaveBeenCalledWith('mockWidth', 'mockHeight', false)
          expect(wrapper.vm.renderer)
            .toBe(WebGLRenderer.mock.instances[0])
          expect(mockMethods.startAnimating)
            .toHaveBeenCalled()
        })
      })
      describe('when webgl is not available', () => {
        it('logs a console warning and returns', () => {
          isWebGLAvailable.mockReturnValue(false)
          global.console.warn = jest.fn()
          wrapper = shallowMountThreeDemo()
          result = wrapper.vm.load()
          expect(isWebGLAvailable)
            .toHaveBeenCalled()
          expect(global.console.warn)
            .toHaveBeenCalledWith(expect.any(String))
          expect(result).toBeUndefined()
        })
      })
    })
    describe('render()', () => {
      it('resizes and renders the scene', () => {
        mockData = {
          camera: 'mockCamera',
          renderer: {
            render: jest.fn()
          },
          scene: 'mockScene'
        }
        mockMethods = {
          resize: jest.fn()
        }
        wrapper = shallowMountThreeDemo({
          data: () => mockData,
          methods: mockMethods
        })
        wrapper.vm.render()
        expect(mockMethods.resize).toHaveBeenCalled()
        expect(mockData.renderer.render)
          .toHaveBeenCalledWith(mockData.scene, mockData.camera)
      })
    })
    describe('resize()', () => {
      let mockFrame, mockRendererSize, mockPixelRatio

      describe('when camera is not a perspective camera', () => {
        beforeEach(() => {
          mockRendererSize = {
            height: 100,
            width: 100
          }
          mockPixelRatio = 2.0
          mockData = {
            camera: {
              isPerspectiveCamera: false
            },
            renderer: {
              getPixelRatio: jest.fn(() => mockPixelRatio),
              getSize: jest.fn(() =>  mockRendererSize),
              setSize: jest.fn()
            }
          }
          mockMethods = {
            frame: jest.fn()
          }
          wrapper = shallowMountThreeDemo({
            data: () => mockData,
            methods: mockMethods
          })
        })
        it('resizes the renderer to match the frame', () => {
          mockFrame = {
            height: 100,
            width: 100
          }
          mockMethods.frame.mockReturnValue(mockFrame)
          wrapper.vm.resize()
          expect(mockMethods.frame)
            .toHaveBeenCalled()
          expect(mockData.renderer.getSize)
            .toHaveBeenCalled()
          expect(mockData.renderer.setSize)
            .toHaveBeenCalledWith(mockFrame.width, mockFrame.height, false)
        })
        describe('when frame dimensions do not change', () => {
          it('does not resize the renderer', () => {
            mockFrame = {
              height: 200,
              width: 200
            }
            mockMethods.frame.mockReturnValue(mockFrame)
            wrapper.vm.resize()
            expect(mockMethods.frame)
              .toHaveBeenCalled()
            expect(mockData.renderer.getSize)
              .toHaveBeenCalled()
            expect(mockData.renderer.setSize)
              .not.toHaveBeenCalled()
          })
        })
      })
    })
    describe('startAnimating()', () => {
      let mockAnimationFrameRequestId

      it([
        'starts the clock',
        'requests an animation frame callback to animate',
        'and stores the request id'
      ].join(', '), () => {
        mockData = {
          clock: {
            start: jest.fn()
          }
        }
        wrapper = shallowMountThreeDemo({
          data: () => mockData,
        })
        mockAnimationFrameRequestId = 'example'
        global.window.requestAnimationFrame =
          jest.fn(() => mockAnimationFrameRequestId)

        wrapper.vm.startAnimating()
        expect(mockData.clock.start)
          .toHaveBeenCalled()
        expect(global.window.requestAnimationFrame)
          .toHaveBeenCalledWith(wrapper.vm.animate)
        expect(wrapper.vm.animationFrame)
          .toBe(mockAnimationFrameRequestId)
      })
    })
    describe('stopAnimating()', () => {
      beforeEach(() => {
        mockData = {
          clock: {
            stop: jest.fn()
          }
        }
        wrapper = shallowMountThreeDemo({
          data: () => mockData,
        })
        global.window.cancelAnimationFrame = jest.fn()
      })
      describe('when animationFrame is not present', () => {
        it('stops the clock only', () => {
          wrapper.vm.stopAnimating()
          expect(mockData.clock.stop)
            .toHaveBeenCalled()
          expect(global.window.cancelAnimationFrame)
            .not.toHaveBeenCalled()
        })
      })
      describe('when animationFrame is present', () => {
        it('stops the clock and cancels the animation frame', () => {
          mockData.animationFrame = 'example'
          wrapper.setData(mockData)

          wrapper.vm.stopAnimating()
          expect(mockData.clock.stop)
            .toHaveBeenCalled()
          expect(global.window.cancelAnimationFrame)
            .toHaveBeenCalledWith(mockData.animationFrame)
        })
      })
    })
    describe('update()', () => {
      it('does nothing', () => {
        wrapper = shallowMountThreeDemo()
        result = wrapper.vm.update()
        expect(result).toBeUndefined()
      })
    })
  })
  describe('mixins', () => {
    it('registers graphix', () => {
      const mixins = Object.values(threeDemo.mixins)
      expect(mixins).toContain(graphix)
    })
  })
})
