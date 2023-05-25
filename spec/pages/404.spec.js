import { useHead } from '#imports'
import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import Page, * as metadata from '~/pages/404.vue'

describe('404.vue', () => {

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

  describe('when calling useHead', () => {

    beforeAll(() => {
      useHead.mockClear()
    })

    beforeEach(() => (
      useHead.mock.calls[0][0]
    ))

    it('provides title', ({ title }) => {
      expect(title).toBe(metadata.title)
    })
  })
})
