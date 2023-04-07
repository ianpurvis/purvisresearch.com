import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import { mockConsole } from './console.js'
import { describeVueMetaBehavior } from './vue-meta.js'

export function describePage(
  Page,
  metadata,
  name = 'as a page',
  fn = () => {}
) {
  describe(name, () => {
    mockConsole(() => {

      beforeAll(() => ({ stubs: ['nuxt-link'] }))
      beforeEach((options) => shallowMount(Page, options))

      it('mounts', (wrapper) => {
        expect(wrapper.exists()).toBeTruthy()
      })

      describeVueMetaBehavior(metadata)

      fn()
    })
  })
}
