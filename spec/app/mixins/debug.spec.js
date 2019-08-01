jest.mock('~/assets/stylesheets/debug.scss', () => {}, { virtual: true })

import debug from '~/mixins/debug.js'
import { shallowMount } from '@vue/test-utils'


describe('debug', () => {

  const shallowMountDebug = (options) => shallowMount({
    render: jest.fn()
  }, {
    attachToDocument: true,
    mixins: [
      debug
    ],
    ...options
  })

  let wrapper, spy

  afterEach(() => {
    wrapper.destroy()
  })

  describe('beforeDestroy()', () => {
    it('it removes handleKeyup from window keyup', () => {
      spy = jest.spyOn(window, 'removeEventListener')
      wrapper = shallowMountDebug()
      wrapper.destroy()
      expect(spy).toHaveBeenCalledWith('keyup', wrapper.vm.handleKeyup)
    })
  })
  describe('mounted()', () => {
    it('it adds handleKeyup to window keyup', () => {
      spy = jest.spyOn(window, 'addEventListener')
      wrapper = shallowMountDebug()
      expect(spy).toHaveBeenCalledWith('keyup', wrapper.vm.handleKeyup)
    })
  })
  describe('methods', () => {
    describe('handleKeyup(event)', () => {
      let event, mockMethods

      beforeEach(() => {
        mockMethods = {
          toggleDebugMode: jest.fn()
        }
        wrapper = shallowMountDebug({ methods: mockMethods })
      })
      describe('when event prevents default', () => {
        it('it does nothing', () => {
          event = { defaultPrevented: true }
          wrapper.vm.handleKeyup(event)
          expect(mockMethods.toggleDebugMode).not.toHaveBeenCalled()
        })
      })
      describe('when event key is \'d\'', () => {
        it('it toggles debug mode', () => {
          event = { defaultPrevented: false, key: 'd' }
          wrapper.vm.handleKeyup(event)
          expect(mockMethods.toggleDebugMode).toHaveBeenCalled()
        })
      })
    })
    describe('toggleDebugMode()', () => {
      it('toggles the debug attribute on the window document element', () => {
        document.documentElement.toggleAttribute = jest.fn()
        wrapper = shallowMountDebug()
        wrapper.vm.toggleDebugMode()
        expect(document.documentElement.toggleAttribute).toHaveBeenCalledWith('debug')
      })
    })
  })
})
