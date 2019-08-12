jest.mock('~/mixins/graphix.js')
jest.mock('~/models/webgl.js')
jest.mock('~/shims/pixi.js', () => ({
  Container: jest.fn(),
  Renderer: jest.fn(),
  Ticker: jest.fn(),
}))

import graphix from '~/mixins/graphix.js'
import pixiDemo from '~/mixins/pixi_demo.js'
import { WebGL } from '~/models/webgl.js'
import { Container, Renderer, Ticker } from '~/shims/pixi.js'
import { shallowMount } from '@vue/test-utils'


describe('pixi_demo', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      mixins: [
        pixiDemo
      ],
      render: jest.fn()
    }
  })
  describe('hooks', () => {
    describe('beforeDestroy()', () => {
      it('stops animating and disposes pixi resources', () => {
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
        mockAnimationFrameRequestId = 'example'
        global.window.requestAnimationFrame =
          jest.fn(() => mockAnimationFrameRequestId)

        wrapper = shallowMount(component)
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
      describe('when renderer is present', () => {
        it('destroys the renderer', () => {
          component.data = () => ({
            renderer: {
              destroy: jest.fn()
            }
          })
          wrapper = shallowMount(component)
          wrapper.vm.dispose()
          expect(wrapper.vm.renderer.destroy).toHaveBeenCalled()
        })
      })
      describe('when scene is present', () => {
        it('destroys the scene', () => {
          component.data = () => ({
            scene: {
              destroy: jest.fn()
            }
          })
          wrapper = shallowMount(component)
          wrapper.vm.dispose()
          expect(wrapper.vm.scene.destroy).toHaveBeenCalledWith(true)
        })
      })
      describe('when ticker is present', () => {
        it('destroys the ticker', () => {
          component.data = () => ({
            ticker: {
              destroy: jest.fn()
            },
          })
          wrapper = shallowMount(component)
          wrapper.vm.dispose()
          expect(wrapper.vm.ticker.destroy).toHaveBeenCalled()
        })
      })
    })
    describe('deltaTime()', () => {
      it('returns elapsed clock ms multiplied by the speed of life', () => {
          component.data = () => ({
            clock: {
              elapsedMS: 100
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
        it('imports pixi and initializes the renderer, clock, and scene', async () => {
          component.methods = {
            frame: jest.fn().mockReturnValue({
              height: 'mockHeight',
              width: 'mockWidth'
            }),
            startAnimating: jest.fn()
          }
          WebGL.assertWebGLAvailable.mockReturnValue()
          window.devicePixelRatio = 'mockDevicePixelRatio'
          global.Math.max = jest.fn().mockReturnValue('mockPixelRatio')

          wrapper = shallowMount(component)
          wrapper.vm.$refs.canvas = 'mockCanvas'

          result = wrapper.vm.load()
          await expect(result).resolves.toBeUndefined()
          expect(WebGL.assertWebGLAvailable).toHaveBeenCalledWith('mockCanvas')
          expect(component.methods.frame).toHaveBeenCalled()
          expect(global.Math.max).toHaveBeenCalledWith('mockDevicePixelRatio', 2)
          expect(Renderer).toHaveBeenCalledWith({
            height: 'mockHeight',
            resolution: 'mockPixelRatio',
            transparent: true,
            view: 'mockCanvas',
            width: 'mockWidth',
          })
          expect(wrapper.vm.renderer).toBe(Renderer.mock.instances[0])
          expect(Ticker).toHaveBeenCalled()
          expect(wrapper.vm.clock).toBe(Ticker.mock.instances[0])
          expect(Container).toHaveBeenCalled()
          expect(wrapper.vm.scene).toBe(Container.mock.instances[0])
          expect(component.methods.startAnimating).toHaveBeenCalled()
        })
      })
      describe('when webgl is not available', () => {
        it('logs a console warning and returns', async () => {
          WebGL.assertWebGLAvailable.mockImplementation(() => {
            throw new Error('mockError')
          })
          wrapper = shallowMount(component)
          wrapper.vm.$refs.canvas = 'mockCanvas'
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
          error = new Error('mock error')
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
          renderer: {
            render: jest.fn()
          },
          scene: 'example'
        })
        component.methods = {
          resize: jest.fn()
        }
        wrapper = shallowMount(component)
        wrapper.vm.render()
        expect(component.methods.resize).toHaveBeenCalled()
        expect(wrapper.vm.renderer.render)
          .toHaveBeenCalledWith(wrapper.vm.scene)
      })
    })
    describe('resize()', () => {
      let mockFrame

      it('resizes the renderer to match the frame', () => {
        mockFrame = {
          height: 100,
          width: 100
        }
        component.data = () => ({
          renderer: {
            resize: jest.fn()
          }
        })
        component.methods = {
          frame: jest.fn(() => mockFrame)
        }
        wrapper = shallowMount(component)
        wrapper.vm.resize()
        expect(component.methods.frame).toHaveBeenCalled()
        expect(wrapper.vm.renderer.resize)
          .toHaveBeenCalledWith(mockFrame.width, mockFrame.height)
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
      let mockAnimationFrameRequestId

      beforeEach(() => {
        component.data = () => ({
          clock: {
            stop: jest.fn()
          }
        })
        wrapper = shallowMount(component)
        global.window.cancelAnimationFrame = jest.fn()
      })
      describe('when animationFrame is not present', () => {
        it('stops the clock only', () => {
          wrapper.setData({ animationFrame: null })
          wrapper.vm.stopAnimating()
          expect(wrapper.vm.clock.stop)
            .toHaveBeenCalled()
          expect(global.window.cancelAnimationFrame)
            .not.toHaveBeenCalled()
        })
      })
      describe('when animationFrame is present', () => {
        it('stops the clock and cancels the animation frame', () => {
          wrapper.setData({ animationFrame: 'mockAnimationFrame' })
          wrapper.vm.stopAnimating()
          expect(wrapper.vm.clock.stop)
            .toHaveBeenCalled()
          expect(global.window.cancelAnimationFrame)
            .toHaveBeenCalledWith(wrapper.vm.animationFrame)
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
      const mixins = Object.values(pixiDemo.mixins)
      expect(mixins).toContain(graphix)
    })
  })
})
