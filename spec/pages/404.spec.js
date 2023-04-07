import { createLocalVue, shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import VueMeta from 'vue-meta'
import Page, * as metadata from '~/pages/404.vue'

describe('404.vue', () => {

  beforeAll(() => ({ stubs: ['nuxt-link'] }))
  beforeEach((options) => shallowMount(Page, options))

  it('mounts', (wrapper) => {
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when using vue-meta', () => {

    beforeAll((options) => {
      const localVue = createLocalVue()
      localVue.use(VueMeta, { keyName: 'head' })
      return { ...options, localVue }
    })

    beforeEach((wrapper) => {
      return wrapper.vm.$metaInfo
    })

    it('provides title', ({ title }) => {
      expect(title).toBe(metadata.title)
    })
  })
})
