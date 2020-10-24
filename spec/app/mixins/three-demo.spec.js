jest.mock('three')
jest.mock('~/mixins/animatable.js')
jest.mock('~/mixins/graphix.js')
jest.mock('~/models/webgl.js')

import Animatable from '~/mixins/animatable.js'
import graphix from '~/mixins/graphix.js'
import threeDemo from '~/mixins/three-demo.js'
import { WebGL } from '~/models/webgl.js'
import { WebGLRenderer } from 'three'
import { shallowMount } from '@vue/test-utils'


describe('three-demo', () => {
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
          wrapper = shallowMount(component)
          wrapper.vm.renderer = {
            dispose: jest.fn(),
            getRenderTarget: jest.fn(),
          }
          wrapper.vm.dispose()
          expect(wrapper.vm.renderer.dispose).toHaveBeenCalled()
        })
      })
      describe('when scene is present', () => {
        it('destroys the scene', () => {
          wrapper = shallowMount(component)
          wrapper.vm.scene = {
            traverse: jest.fn()
          }
          wrapper.vm.dispose()
          expect(wrapper.vm.scene.traverse).toHaveBeenCalled()
        })
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

      beforeEach(() => {
        global.console = {
          error: jest.fn(),
          warn: jest.fn()
        }
        wrapper = shallowMount(component, {
          mocks: {
            $sentry: {
              captureException: jest.fn()
            }
          }
        })
      })
      describe('when error is an WebGL.WebGLNotAvailableError', () => {
        beforeEach(() => {
          error = new WebGL.WebGLNotAvailableError()
          result = wrapper.vm.logError(error)
        })
        it('logs a console warning with the error message', () => {
          expect(global.console.warn)
            .toHaveBeenCalledWith(error.message)
        })
      })
      describe('otherwise', () => {
        beforeEach(() => {
          error = new Error('mockError')
          result = wrapper.vm.logError(error)
        })
        it('sends the error to sentry', () => {
          expect(wrapper.vm.$sentry.captureException)
            .toHaveBeenCalledWith(error)
        })
        it('logs a console error with the error object', () => {
          expect(global.console.error)
            .toHaveBeenCalledWith(error)
        })
      })
    })
    describe('render()', () => {
      it('resizes and renders the scene', () => {
        component.methods = {
          resize: jest.fn()
        }
        wrapper = shallowMount(component)
        wrapper.vm.camera = 'mockCamera'
        wrapper.vm.renderer = {
          render: jest.fn()
        }
        wrapper.vm.scene = 'mockScene'
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
          component.methods = {
            frame: jest.fn()
          }
          wrapper = shallowMount(component)
          wrapper.vm.camera = {
            isPerspectiveCamera: false
          }
          wrapper.vm.renderer = {
            getPixelRatio: jest.fn(() => mockPixelRatio),
            getSize: jest.fn(() =>  mockRendererSize),
            setSize: jest.fn()
          }
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
      beforeEach(() => {
        wrapper = shallowMount(component)
        wrapper.vm.clock = {
          start: jest.fn()
        }
      })
      it('starts the clock', () => {
        wrapper.vm.startAnimating()
        expect(wrapper.vm.clock.start).toHaveBeenCalled()
      })
      it('calls Animatable.methods.startAnimating()', () => {
        wrapper.vm.startAnimating()
        expect(Animatable.methods.startAnimating).toHaveBeenCalled()
      })
    })
    describe('stopAnimating()', () => {
      beforeEach(() => {
        wrapper = shallowMount(component)
        wrapper.vm.clock = {
          stop: jest.fn()
        }
      })
      it('stops the clock', () => {
        wrapper.vm.stopAnimating()
        expect(wrapper.vm.clock.stop).toHaveBeenCalled()
      })
      it('calls Animatable.methods.stopAnimating()', () => {
        wrapper.vm.stopAnimating()
        expect(Animatable.methods.stopAnimating).toHaveBeenCalled()
      })
      describe('when clock is null', () => {
        it('does not throw an error', () => {
          wrapper.vm.clock = null
          expect(() => wrapper.vm.stopAnimating()).not.toThrow()
        })
      })
    })
    describe('update()', () => {
      beforeEach(() => {
        wrapper = shallowMount(component)
        wrapper.vm.elapsedTime = 0
        wrapper.vm.speedOfLife = 1
      })
      describe('when clock is running', () => {
        let deltaTime

        beforeEach(() => {
          deltaTime = 1000
          wrapper.vm.clock = {
            getDelta: jest.fn().mockReturnValue(deltaTime),
            running: true
          }
        })
        it('updates delta time', () => {
          [1,2].forEach(() => {
            wrapper.vm.update()
            expect(wrapper.vm.deltaTime).toBe(deltaTime)
          })
        })
        it('updates elapsed time', () => {
          [1,2].forEach(i => {
            wrapper.vm.update()
            expect(wrapper.vm.elapsedTime).toBe(deltaTime * i)
          })
        })
        it('calls Animatable.methods.update()', () => {
          wrapper.vm.update()
          expect(Animatable.methods.update).toHaveBeenCalled()
        })
      })
      describe('when clock is stopped', () => {
        beforeEach(() => {
          wrapper.vm.clock = {
            running: false
          }
        })
        it('does nothing', () => {
          const result = wrapper.vm.update()
          expect(result).toBeUndefined()
        })
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
