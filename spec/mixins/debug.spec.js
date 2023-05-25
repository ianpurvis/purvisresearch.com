jest.mock('~/assets/stylesheets/debug.scss', () => {}, { virtual: true })

import { shallowMount } from '@vue/test-utils'
import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import { useDebug } from '~/mixins/debug.js'


describe('useDebug()', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      setup() {
        useDebug()
      },
      render: jest.fn()
    }
  })

  describe('when mounted', () => {
    let addEventListener

    beforeEach(() => {
      addEventListener = jest.spyOn(window, 'addEventListener')
      wrapper = shallowMount(component)
    })

    it('listens for window keyup events', () => {
      expect(addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function))
    })

    describe('when a window keyup event is heard', () => {
      let event, toggleAttribute

      beforeEach(() => {
        toggleAttribute = jest.spyOn(document.documentElement, 'toggleAttribute')
      })

      describe('when event prevents default', () => {
        it('does nothing', () => {
          event = new KeyboardEvent('keyup')
          event.preventDefault()
          window.dispatchEvent(event)
          expect(toggleAttribute).not.toHaveBeenCalled()
        })
      })

      describe('when event key is not "d"', () => {
        it('does nothing', () => {
          event = new KeyboardEvent('keyup', { key: 'x' })
          window.dispatchEvent(event)
          expect(toggleAttribute).not.toHaveBeenCalled()
        })
      })

      describe('when event key is "d"', () => {
        it('toggles debug mode', () => {
          event = new KeyboardEvent('keyup', { key: 'd' })
          window.dispatchEvent(event)
          expect(toggleAttribute).toHaveBeenCalledWith('debug')
        })
      })
    })

    describe('when unmounted', () => {
      let removeEventListener

      beforeEach(() => {
        removeEventListener = jest.spyOn(window, 'removeEventListener')
        wrapper.destroy()
      })

      it('stops listening for window keyup events', () => {
        expect(removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function))
      })
    })
  })
})
