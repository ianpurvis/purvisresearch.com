jest.mock('three')
jest.mock('~/mixins/graphix.js')
jest.mock('~/models/webgl.js')

import graphix from '~/mixins/graphix.js'
import threeDemo from '~/mixins/three_demo.js'
import { WebGL } from '~/models/webgl.js'
import { WebGLRenderer } from 'three'
import { shallowMount } from '@vue/test-utils'


describe('three_demo', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      mixins: [
        threeDemo
      ],
      render: jest.fn()
    }
  })
  describe('hooks', () => {
    describe('beforeDestroy()', () => {
      it('stops animating and disposes', () => {
        component.methods = {
          dispose: jest.fn(),
          stopAnimating: jest.fn()
        }
        wrapper = shallowMount(component)
        wrapper.destroy()
        expect(component.methods.stopAnimating).toHaveBeenCalled()
        expect(component.methods.dispose).toHaveBeenCalled()
      })
    })
  })
  describe('methods', () => {
    let result

    describe('animate()', () => {
      let mockAnimationFrameRequestId

      it('updates, renders, and requests an animation frame callback to itself', () => {
        component.methods = {
          update: jest.fn(),
          render: jest.fn()
        }
        wrapper = shallowMount(component)
        mockAnimationFrameRequestId = 'example'
        global.window.requestAnimationFrame =
          jest.fn(() => mockAnimationFrameRequestId)

        wrapper.vm.animate()
        expect(component.methods.update)
          .toHaveBeenCalled()
        expect(component.methods.render)
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
          wrapper = shallowMount(component)
          result = wrapper.vm.dispose()
          expect(result).toBeUndefined()
        })
      })
      describe('when renderer is present', () => {
        it('disposes the renderer', () => {
          component.data = () => ({
            renderer: {
              dispose: jest.fn(),
              getRenderTarget: jest.fn(),
            },
          })
          wrapper = shallowMount(component)
          wrapper.vm.dispose()
          expect(wrapper.vm.renderer.dispose).toHaveBeenCalled()
        })
      })
      describe('when scene is present', () => {
        it('destroys the scene', () => {
          component.data = () => ({
            scene: {
              dispose: jest.fn(),
              traverse: jest.fn()
            },
          })
          wrapper = shallowMount(component)
          wrapper.vm.dispose()
          expect(wrapper.vm.scene.traverse).toHaveBeenCalled()
          expect(wrapper.vm.scene.dispose).toHaveBeenCalled()
        })
      })
    })
    describe('deltaTime()', () => {
      it('returns elapsed clock ms multiplied by the speed of life', () => {
          component.data = () => ({
            clock: {
              getDelta: jest.fn().mockReturnValue(100)
            },
            speedOfLife: 0.5
          })
          wrapper = shallowMount(component)
          result = wrapper.vm.deltaTime()
          expect(result).toBe(50)
      })
    })
    describe('frame()', () => {
      let mockCanvas

      it('returns the canvas height, width, and aspect', () => {
        mockCanvas = {
          clientHeight: 100,
          clientWidth: 100,
        }
        wrapper = shallowMount(component)
        wrapper.vm.$refs.canvas = mockCanvas
        result = wrapper.vm.frame()
        expect(result).toStrictEqual({
          height: mockCanvas.clientHeight,
          width: mockCanvas.clientWidth,
          aspect: mockCanvas.clientWidth / mockCanvas.clientHeight
        })
      })
    })
    describe('load()', () => {
      describe('when webgl is available', () => {
        it('initializes the renderer and starts animating', async () => {
          component.methods = {
            frame: jest.fn().mockReturnValue({
              height: 'mockHeight',
              width: 'mockWidth'
            }),
            startAnimating: jest.fn()
          }
          WebGL.assertWebGLAvailable.mockReturnValue()
          // For some reason, these methods don't get mocked automatically:
          Object.assign(WebGLRenderer.prototype, {
            setPixelRatio: jest.fn(),
            setSize: jest.fn()
          })
          window.devicePixelRatio = 'mockDevicePixelRatio'
          global.Math.max = jest.fn().mockReturnValue('mockPixelRatio')

          wrapper = shallowMount(component)
          wrapper.vm.$refs.canvas = 'mockCanvas'

          result = wrapper.vm.load()
          await expect(result).resolves.toBeUndefined()
          expect(WebGL.assertWebGLAvailable).toHaveBeenCalledWith('mockCanvas')
          expect(component.methods.frame).toHaveBeenCalled()
          expect(global.Math.max).toHaveBeenCalledWith('mockDevicePixelRatio', 2)
          expect(WebGLRenderer).toHaveBeenCalledWith({
            alpha: true,
            antialias: false,
            canvas: 'mockCanvas'
          })
          expect(wrapper.vm.renderer.setPixelRatio)
            .toHaveBeenCalledWith('mockPixelRatio')
          expect(wrapper.vm.renderer.setSize)
            .toHaveBeenCalledWith('mockWidth', 'mockHeight', false)
          expect(wrapper.vm.renderer)
            .toBe(WebGLRenderer.mock.instances[0])
          expect(component.methods.startAnimating)
            .toHaveBeenCalled()
        })
      })
      describe('when webgl is not available', () => {
        it('logs a console warning and returns', async () => {
          WebGL.assertWebGLAvailable.mockImplementation(() => {
            throw new Error('mockError')
          })
          global.console.warn = jest.fn()
          wrapper = shallowMount(component)
          result = wrapper.vm.load()
          await expect(result)
            .rejects.toThrow('mockError')
          expect(WebGL.assertWebGLAvailable)
            .toHaveBeenCalledWith('mockCanvas')
        })
      })
    })
    describe('logError(error)', () => {
      let error

      describe('when error is an WebGL.WebGLNotAvailableError', () => {
        it('logs a console warning with the error message', () => {
          global.console.warn = jest.fn()
          error = new WebGL.WebGLNotAvailableError()
          wrapper = shallowMount(component)
          result = wrapper.vm.logError(error)
          expect(global.console.warn)
            .toHaveBeenCalledWith(error.message)
        })
      })
      describe('otherwise', () => {
        it('logs a console error with the error object', () => {
          global.console.error = jest.fn()
          error = new Error('mockError')
          wrapper = shallowMount(component)
          result = wrapper.vm.logError(error)
          expect(global.console.error)
            .toHaveBeenCalledWith(error)
        })
      })
    })
    describe('render()', () => {
      it('resizes and renders the scene', () => {
        component.data = () => ({
          camera: 'mockCamera',
          renderer: {
            render: jest.fn()
          },
          scene: 'mockScene'
        })
        component.methods = {
          resize: jest.fn()
        }
        wrapper = shallowMount(component)
        wrapper.vm.render()
        expect(component.methods.resize)
          .toHaveBeenCalled()
        expect(wrapper.vm.renderer.render)
          .toHaveBeenCalledWith(wrapper.vm.scene, wrapper.vm.camera)
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
          component.data = () => ({
            camera: {
              isPerspectiveCamera: false
            },
            renderer: {
              getPixelRatio: jest.fn(() => mockPixelRatio),
              getSize: jest.fn(() =>  mockRendererSize),
              setSize: jest.fn()
            }
          })
          component.methods = {
            frame: jest.fn()
          }
          wrapper = shallowMount(component)
        })
        it('resizes the renderer to match the frame', () => {
          mockFrame = {
            height: 100,
            width: 100
          }
          component.methods.frame.mockReturnValue(mockFrame)
          wrapper.vm.resize()
          expect(component.methods.frame)
            .toHaveBeenCalled()
          expect(wrapper.vm.renderer.getSize)
            .toHaveBeenCalled()
          expect(wrapper.vm.renderer.setSize)
            .toHaveBeenCalledWith(mockFrame.width, mockFrame.height, false)
        })
        describe('when frame dimensions do not change', () => {
          it('does not resize the renderer', () => {
            mockFrame = {
              height: 200,
              width: 200
            }
            component.methods.frame.mockReturnValue(mockFrame)
            wrapper.vm.resize()
            expect(component.methods.frame)
              .toHaveBeenCalled()
            expect(wrapper.vm.renderer.getSize)
              .toHaveBeenCalled()
            expect(wrapper.vm.renderer.setSize)
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
        component.data = () => ({
          clock: {
            start: jest.fn()
          }
        })
        mockAnimationFrameRequestId = 'example'
        global.window.requestAnimationFrame =
          jest.fn(() => mockAnimationFrameRequestId)

        wrapper = shallowMount(component)
        wrapper.vm.startAnimating()
        expect(wrapper.vm.clock.start)
          .toHaveBeenCalled()
        expect(global.window.requestAnimationFrame)
          .toHaveBeenCalledWith(wrapper.vm.animate)
        expect(wrapper.vm.animationFrame)
          .toBe(mockAnimationFrameRequestId)
      })
    })
    describe('stopAnimating()', () => {
      beforeEach(() => {
        component.data = () => ({
          animationFrame: 'mockAnimationFrame',
          clock: {
            stop: jest.fn()
          }
        })
        global.window.cancelAnimationFrame = jest.fn()
        wrapper = shallowMount(component)
      })
      it('stops the clock and cancels the animation frame', () => {
        wrapper.vm.stopAnimating()
        expect(wrapper.vm.clock.stop)
          .toHaveBeenCalled()
        expect(global.window.cancelAnimationFrame)
          .toHaveBeenCalledWith('mockAnimationFrame')
      })
      describe('when clock is null', () => {
        it('does not throw an error', () => {
          wrapper.setData({ clock: null })
          expect(() => wrapper.vm.stopAnimating())
            .not.toThrow()
        })
      })
    })
    describe('update()', () => {
      it('does nothing', () => {
        wrapper = shallowMount(component)
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
