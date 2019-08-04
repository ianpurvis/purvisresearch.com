jest.mock('three/examples/js/WebGL.js')
jest.mock('~/mixins/graphix.js')
jest.mock('@pixi/core', () => {
  let module = {
    BatchRenderer: jest.fn(),
    Renderer: jest.fn(),
    systems: jest.fn()
  }
  module.Renderer.registerPlugin = jest.fn()
  return module
})
jest.mock('@pixi/display')
jest.mock('@pixi/ticker')
jest.mock('@pixi/unsafe-eval')
jest.mock('three/examples/js/WebGL.js', () => ({
  isWebGLAvailable: jest.fn()
}))

import graphix from '~/mixins/graphix.js'
import pixiDemo from '~/mixins/pixi_demo.js'
import { BatchRenderer, Renderer, systems } from '@pixi/core'
import { Container } from '@pixi/display'
import { Ticker } from '@pixi/ticker'
import { install } from '@pixi/unsafe-eval'
import { isWebGLAvailable } from 'three/examples/js/WebGL.js'
import { shallowMount } from '@vue/test-utils'

const shallowMountPixiDemo = (options = {}) => shallowMount({
  render: jest.fn()
}, {
  mixins: [
    pixiDemo
  ],
  ...options
})

describe('pixi_demo', () => {
  let wrapper, mockData, mockMethods, mockRefs

  describe('hooks', () => {
    describe('beforeDestroy()', () => {
      it('stops animating and disposes pixi resources', () => {
        mockMethods = {
          dispose: jest.fn(),
          stopAnimating: jest.fn()
        }
        wrapper = shallowMountPixiDemo({
          methods: mockMethods
        })
        wrapper.destroy()
        expect(mockMethods.stopAnimating).toHaveBeenCalled()
        expect(mockMethods.dispose).toHaveBeenCalled()
      })
    })
  })
  describe('methods', () => {
    describe('animate()', () => {
      let mockAnimationFrameRequestId

      it('updates, renders, and requests an animation frame callback to itself', () => {
        mockMethods = {
          update: jest.fn(),
          render: jest.fn()
        }
        wrapper = shallowMountPixiDemo({
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
      describe('when renderer is present', () => {
        it('destroys the renderer', () => {
          mockData = {
            renderer: {
              destroy: jest.fn()
            },
          }
          wrapper = shallowMountPixiDemo({
            data: () => mockData
          })
          wrapper.vm.dispose()
          expect(mockData.renderer.destroy).toHaveBeenCalled()
        })
      })
      describe('when scene is present', () => {
        it('destroys the scene', () => {
          mockData = {
            scene: {
              destroy: jest.fn()
            },
          }
          wrapper = shallowMountPixiDemo({
            data: () => mockData
          })
          wrapper.vm.dispose()
          expect(mockData.scene.destroy).toHaveBeenCalledWith(true)
        })
      })
      describe('when ticker is present', () => {
        it('destroys the ticker', () => {
          mockData = {
            ticker: {
              destroy: jest.fn()
            },
          }
          wrapper = shallowMountPixiDemo({
            data: () => mockData
          })
          wrapper.vm.dispose()
          expect(mockData.ticker.destroy).toHaveBeenCalled()
        })
      })
    })
    describe('deltaTime()', () => {
      let result

      it('returns elapsed clock ms multiplied by the speed of life', () => {
          mockData = {
            clock: {
              elapsedMS: 100
            },
            speedOfLife: 0.5
          }
          wrapper = shallowMountPixiDemo({
            data: () => mockData
          })
          result = wrapper.vm.deltaTime()
          expect(result).toBe(mockData.clock.elapsedMS * mockData.speedOfLife)
      })
    })
    describe('frame()', () => {
      let result

      it('returns the canvas height, width, and aspect', () => {
        mockRefs = {
          canvas: {
            clientHeight: 100,
            clientWidth: 100,
          }
        }
        wrapper = shallowMountPixiDemo()
        wrapper.vm.$refs = mockRefs
        result = wrapper.vm.frame()
        expect(result).toStrictEqual({
          height: mockRefs.canvas.clientHeight,
          width: mockRefs.canvas.clientWidth,
          aspect: mockRefs.canvas.clientWidth / mockRefs.canvas.clientHeight
        })
      })
    })
    describe('importPIXI()', () => {
      let result

      it([
        'dynamically imports pixi components',
        'installs @pixi/unsafe-eval',
        'registers the batch renderer plugin',
        'and resolves with Container, Renderer, and Ticker'
      ].join(', '), async () => {
        wrapper = shallowMountPixiDemo()
        result = wrapper.vm.importPIXI()
        await expect(result)
          .resolves
          .toStrictEqual({ Container, Renderer, Ticker })
        expect(install)
          .toHaveBeenCalledWith({ systems })
        expect(Renderer.registerPlugin)
          .toHaveBeenCalledWith('batch', BatchRenderer)
      })
    })
    describe('load()', () => {
      let result

      describe('when webgl is available', () => {
        it('imports pixi and initializes the renderer, clock, and scene', async () => {
          mockMethods = {
            frame: jest.fn().mockReturnValue({
              height: 'mockHeight',
              width: 'mockWidth'
            }),
            importPIXI: jest.fn().mockResolvedValue({
              Container,
              Renderer,
              Ticker
            }),
          }
          mockRefs = {
            canvas: 'mockCanvas'
          }
          isWebGLAvailable.mockReturnValue(true)
          window.devicePixelRatio = 'mockDevicePixelRatio'
          global.Math.max = jest.fn().mockReturnValue('mockPixelRatio')

          wrapper = shallowMountPixiDemo({
            methods: mockMethods,
          })
          wrapper.vm.$refs = mockRefs

          result = wrapper.vm.load()
          await expect(result).resolves
          expect(isWebGLAvailable).toHaveBeenCalled()
          expect(mockMethods.importPIXI).toHaveBeenCalled()
          expect(mockMethods.frame).toHaveBeenCalled()
          expect(global.Math.max).toHaveBeenCalledWith('mockDevicePixelRatio', 2)
          expect(Renderer).toHaveBeenCalledWith({
            height: 'mockHeight',
            resolution: 'mockPixelRatio',
            transparent: true,
            view: mockRefs.canvas,
            width: 'mockWidth',
          })
          expect(wrapper.vm.renderer).toBe(Renderer.mock.instances[0])
          expect(Ticker).toHaveBeenCalled()
          expect(wrapper.vm.clock).toBe(Ticker.mock.instances[0])
          expect(Container).toHaveBeenCalled()
          expect(wrapper.vm.scene).toBe(Container.mock.instances[0])
        })
      })
      describe('when webgl is not available', () => {
        it('logs a console warning and returns', () => {
          isWebGLAvailable.mockReturnValue(false)
          global.console.warn = jest.fn()
          wrapper = shallowMountPixiDemo()
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
          renderer: {
            render: jest.fn()
          },
          scene: 'example'
        }
        mockMethods = {
          resize: jest.fn()
        }
        wrapper = shallowMountPixiDemo({
          data: () => mockData,
          methods: mockMethods
        })
        wrapper.vm.render()
        expect(mockMethods.resize).toHaveBeenCalled()
        expect(mockData.renderer.render)
          .toHaveBeenCalledWith(mockData.scene)
      })
    })
    describe('resize()', () => {
      let mockFrame

      it('resizes the renderer to match the frame', () => {
        mockFrame = {
          height: 100,
          width: 100
        }
        mockData = {
          renderer: {
            resize: jest.fn()
          }
        }
        mockMethods = {
          frame: jest.fn(() => mockFrame)
        }
        wrapper = shallowMountPixiDemo({
          data: () => mockData,
          methods: mockMethods
        })
        wrapper.vm.resize()
        expect(mockMethods.frame).toHaveBeenCalled()
        expect(mockData.renderer.resize)
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
        mockData = {
          clock: {
            start: jest.fn()
          }
        }
        wrapper = shallowMountPixiDemo({
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
        wrapper = shallowMountPixiDemo({
          data: () => mockData,
        })
        global.window.cancelAnimationFrame = jest.fn()
      })
      describe('when animationFrame is not present', () => {
        it('does nothing', () => {
          wrapper.vm.stopAnimating()
          expect(mockData.clock.stop)
            .not.toHaveBeenCalled()
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
  })
  describe('mixins', () => {
    it('registers graphix', () => {
      const mixins = Object.values(pixiDemo.mixins)
      expect(mixins).toContain(graphix)
    })
  })
})
