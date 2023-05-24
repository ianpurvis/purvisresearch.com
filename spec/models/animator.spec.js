import { jest } from '@jest/globals'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import { Animator } from '~/models/animator.js'


describe('Animator', () => {

  describe('constructor()', () => {
    let animator

    beforeAll(() => {
      animator = new Animator()
    })

    it('initializes animations to an empty array', () => {
      expect(animator.animations).toStrictEqual([])
    })

    it('initializes elapsedTime to 0', () => {
      expect(animator.elapsedTime).toStrictEqual(0)
    })
  })

  describe('queue(...animations)', () => {
    let animator, animations

    it('queues the specified animations', () => {
      animator = new Animator()
      animations = [ { startTime: 0 }, { startTime: 1 } ]
      animator.queue(...animations)

      expect(animator.animations).toStrictEqual(animations)
    })
  })

  describe('resolve(...animations)', () => {
    let animator, animations, result

    it('promisifies the specified animations and queues them', () => {
      animator = new Animator()
      animations = [ { startTime: 0 }, { startTime: 1 } ]
      result = animator.resolve(...animations)

      expect(result).toBeInstanceOf(Promise)
      expect(animator.animations).toMatchObject(
        animations.map((animation) => ({
          ...animation,
          resolve: expect.any(Function),
          reject: expect.any(Function)
        }))
      )
    })
  })

  describe('update(deltaTime)', () => {
    let animator, deltaTime

    beforeEach(() => {
      animator = new Animator()
      deltaTime = Math.random()
    })
    it('adds deltaTime to elapsedTime', () => {
      animator.update(deltaTime)
      expect(animator.elapsedTime).toEqual(deltaTime)
    })
    describe('given a queued animation', () => {
      let animation

      beforeEach(() => {
        animation = {
          startTime: 0,
          duration: 1000,
          tick: jest.fn(),
        }
        animator.animations.push(animation)
      })
      it('ticks the animation', () => {
        animator.update(deltaTime)

        const expectedAnimationElapsedTime = animator.elapsedTime
        expect(animation.tick).toHaveBeenCalledWith(expectedAnimationElapsedTime)
      })
      describe('when the animation throws an error', () => {
        let error

        beforeEach(() => {
          error = new Error('Example Error')
          animation.tick.mockImplementation(() => { throw error })
        })
        it('throws the error', () => {
          expect(() => animator.update(deltaTime)).toThrow(error)
        })
        describe('when the animation has a reject handler', () => {
          beforeEach(() => {
            animation.reject = jest.fn()
          })
          it('calls the reject handler with the error', () => {
            animator.update(deltaTime)
            expect(animation.reject).toHaveBeenCalledWith(error)
          })
        })
      })
      describe('when the animation is complete', () => {
        beforeEach(() => {
          animator.elapsedTime = 1001
        })
        it('culls the animation', () => {
          animator.update(deltaTime)
          expect(animator.animations).toHaveLength(0)
        })
        describe('when the animation has a resolve handler', () => {
          beforeEach(() => {
            animation.resolve = jest.fn()
          })
          it('calls the resolve handler', () => {
            animator.update(deltaTime)
            expect(animation.resolve).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
