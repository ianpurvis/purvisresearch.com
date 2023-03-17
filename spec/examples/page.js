import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-globals-ctx'
import { MESSAGE_NO_WEBGL } from '~/models/webgl.js'
import { mockConsole } from './console.js'
import { describeVueMetaBehavior } from './vue-meta.js'

export function describePage(name, Page, metadata) {
  describe(name, () => {
    mockConsole()

    beforeAll(() => ({ stubs: ['nuxt-link'] }))
    beforeEach(() => { console.warn.mockClear() })
    beforeEach((options) => shallowMount(Page, options))

    it('mounts', (wrapper) => {
      expect(wrapper.exists()).toBeTruthy()
    })

    it('warns if webgl is not available', () => {
      expect(console.warn).toHaveBeenCalledWith(MESSAGE_NO_WEBGL)
    })

    describeVueMetaBehavior(metadata)
  })
}
