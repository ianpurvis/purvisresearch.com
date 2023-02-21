jest.mock('vue-tight')
jest.mock('~/directives/unobfuscate.js')

import tight from 'vue-tight'
import unobfuscate from '~/directives/unobfuscate.js'
import graphix from '~/mixins/graphix.js'
import { shallowMount } from '@vue/test-utils'
import { WebGL } from '~/models/webgl.js'


describe('graphix', () => {
  let component, wrapper

  beforeEach(() => {
    component = {
      mixins: [
        graphix
      ],
      render: jest.fn()
    }
  })
  describe('errorCaptured', () => {
    let error, result

    beforeEach(() => {
      error = new Error('fake-error')
      global.console = {
        warn: jest.fn()
      }
    })

    it('throws error', () => {
      expect(() => graphix.errorCaptured(error)).toThrow(error)
    })

    describe('when error is WebGLNotAvailableError', () => {
      beforeEach(() => {
        error = new WebGL.WebGLNotAvailableError()
      })
      it('writes a warning to the console', () => {
        graphix.errorCaptured(error)
        expect(console.warn).toHaveBeenCalledWith(error.message)
      })
      it('returns false', () => {
        result = graphix.errorCaptured(error)
        expect(result).toBe(false)
      })
    })
  }),
  describe('directives', () => {
    let directives

    beforeEach(() => {
      directives = Object.values(graphix.directives)
    })
    it('registers vue-tight', () => {
      expect(directives).toContain(tight)
    })
    it('registers directives/unobfuscate', () => {
      expect(directives).toContain(unobfuscate)
    })
  })
  describe('methods', () => {
    describe('snake(value)', () => {
      let value, result

      describe('given a value string with spaces', () => {
        it('returns the string with spaces replaced by scoped underscore spans', () => {
          component._scopeId = 'example-scope'
          wrapper = shallowMount(component)
          value = 'snake example'
          result = wrapper.vm.snake(value)
          expect(result).toBe('snake<span class="underscore" example-scope>&nbsp;</span>example')
        })
      })
    })
  })
})
