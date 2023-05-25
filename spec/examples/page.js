import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import { mockConsole } from './console.js'
import { describeHeadBehavior } from './head.js'

export function describePage(
  Page,
  metadata,
  name = 'as a page',
  fn = () => {}
) {
  describe(name, () => {
    mockConsole(() => {

      beforeAll(() => ({
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      }))

      beforeEach((options) => shallowMount(Page, options))

      it('mounts', (wrapper) => {
        expect(wrapper.exists()).toBeTruthy()
      })

      describeHeadBehavior(metadata)

      fn()
    })
  })
}
