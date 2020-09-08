jest.mock('~/assets/stylesheets/debug.scss', () => {}, { virtual: true })

import debug from '~/mixins/debug.js'
import { shallowMount } from '@vue/test-utils'


describe('debug', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      mixins: [
        debug
      ],
      render: jest.fn()
    }
  })
  describe('beforeDestroy()', () => {
    it('removes handleKeyup from window keyup', () => {
      global.window.removeEventListener = jest.fn()
      wrapper = shallowMount(component, {
        mounted: jest.fn()
      })
      wrapper.destroy()
      expect(global.window.removeEventListener)
        .toHaveBeenCalledWith('keyup', wrapper.vm.handleKeyup)
    })
  })
  describe('mounted()', () => {
    it('adds handleKeyup to window keyup', () => {
      global.window.addEventListener = jest.fn()
      wrapper = shallowMount(component)
      expect(global.window.addEventListener)
        .toHaveBeenCalledWith('keyup', wrapper.vm.handleKeyup)
    })
  })
  describe('methods', () => {
    describe('handleKeyup(event)', () => {
      let event

      beforeEach(() => {
        component.methods = {
          toggleDebugMode: jest.fn()
        }
        wrapper = shallowMount(component)
      })
      describe('when event prevents default', () => {
        it('does nothing', () => {
          event = { defaultPrevented: true }
          wrapper.vm.handleKeyup(event)
          expect(component.methods.toggleDebugMode).not.toHaveBeenCalled()
        })
      })
      describe('when event key is \'d\'', () => {
        it('toggles debug mode', () => {
          event = { defaultPrevented: false, key: 'd' }
          wrapper.vm.handleKeyup(event)
          expect(component.methods.toggleDebugMode).toHaveBeenCalled()
        })
      })
    })
    describe('toggleDebugMode()', () => {
      it('toggles the debug attribute on the window document element', () => {
        global.document.documentElement.toggleAttribute = jest.fn()
        wrapper = shallowMount(component)
        wrapper.vm.toggleDebugMode()
        expect(global.document.documentElement.toggleAttribute)
          .toHaveBeenCalledWith('debug')
      })
    })
  })
})
