import { shallowMount } from '@vue/test-utils'
import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import Animatable from '~/mixins/animatable.js'


describe('animatable', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      mixins: [
        Animatable
      ],
      render: jest.fn()
    }
  })
  describe('hooks', () => {
    describe('created()', () => {
      it('initializes non-reactive data', () => {
        wrapper = shallowMount(component)
        expect(wrapper.vm.animations).toStrictEqual([])
        expect(wrapper.vm.animationFrame).toBeNull()
        expect(wrapper.vm.elapsedTime).toBe(0)
        expect(wrapper.vm.deltaTime).toBe(0)
      })
    })
  })
  describe('methods', () => {
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
    describe('render()', () => {
      beforeEach(() => {
        wrapper = shallowMount(component)
      })
      it('throws a not implemented error', () => {
        expect(() => wrapper.vm.render())
          .toThrow('Not implemented!')
      })
    })
    describe('startAnimating()', () => {
      beforeEach(() => {
        global.window.requestAnimationFrame =
          jest.fn(() => 'mockAnimationFrameRequestID')

        wrapper = shallowMount(component)
      })
      it('creates an animation frame request and stores the id', () => {
        wrapper.vm.startAnimating()
        expect(global.window.requestAnimationFrame)
          .toHaveBeenCalledWith(wrapper.vm.animate)
        expect(wrapper.vm.animationFrame)
          .toBe('mockAnimationFrameRequestID')
      })
    })
    describe('stopAnimating()', () => {
      beforeEach(() => {
        global.window.cancelAnimationFrame = jest.fn()
        wrapper = shallowMount(component)
        wrapper.vm.animationFrame = 'mockAnimationFrameRequestID'
      })
      it('cancels the current animation frame request', () => {
        wrapper.vm.stopAnimating()
        expect(global.window.cancelAnimationFrame)
          .toHaveBeenCalledWith('mockAnimationFrameRequestID')
      })
    })
    describe('update()', () => {
      beforeEach(() => {
        wrapper = shallowMount(component)
        wrapper.vm.elapsedTime = 0
        wrapper.vm.speedOfLife = 1
      })
      describe('when an animation exists', () => {
        let animation

        beforeEach(() => {
          animation = {
            startTime: 0,
            duration: 1000,
            tick: jest.fn(),
          }
          wrapper.setData({
            animations: [
              animation
            ]
          })
        })
        it('ticks the animation', () => {
          wrapper.vm.update()
          expect(animation.tick).toHaveBeenCalledWith(0, 1000)
        })
        describe('when the animation throws an error', () => {
          let error

          beforeEach(() => {
            error = new Error('Example Error')
            animation.tick.mockImplementation(() => { throw error })
          })
          it('culls the animation', () => {
            wrapper.vm.update()
            expect(wrapper.vm.animations).toHaveLength(0)
          })
          describe('when the animation has a reject handler', () => {
            beforeEach(() => {
              wrapper.vm.animations[0].reject = jest.fn()
            })
            it('calls the reject handler with the error', () => {
              wrapper.vm.update()
              expect(animation.reject).toHaveBeenCalledWith(error)
            })
          })
        })
        describe('when the animation is complete', () => {
          beforeEach(() => {
            wrapper.setData({
              elapsedTime: 1001
            })
          })
          it('culls the animation', () => {
            wrapper.vm.update()
            expect(wrapper.vm.animations).toHaveLength(0)
          })
          describe('when the animation has a resolve handler', () => {
            beforeEach(() => {
              wrapper.vm.animations[0].resolve = jest.fn()
            })
            it('calls the resolve handler', () => {
              wrapper.vm.update()
              expect(animation.resolve).toHaveBeenCalled()
            })
          })
        })
      })
    })
  })
})
