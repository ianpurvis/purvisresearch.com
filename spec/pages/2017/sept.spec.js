import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueMeta from 'vue-meta'
import Component, { canonicalUrl, description, jsonld, ogImageUrl, title } from '~/pages/2017/sept.vue'

describe('Sept', () => {
  describe('mount()', () => {
    let localVue, stubs, wrapper

    beforeEach(() => {
      global.console = {
        error: jest.fn(),
        warn: jest.fn()
      }
      localVue = createLocalVue()
      localVue.use(VueMeta, { keyName: 'head' })
      stubs = ['nuxt-link']
      wrapper = shallowMount(Component, { localVue, stubs })
    })
    it('is a Vue instance', () => {
      expect(wrapper.exists()).toBeTruthy()
    })
    it('provides title', () => {
      expect(wrapper.vm.$metaInfo.title).toBe(title)
    })
    it('provides description meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ name: 'description', content: description })
    })
    it('provides og:description meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:description', content: description })
    })
    it('provides og:image meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:image', content: ogImageUrl })
    })
    it('provides og:image:height meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:image:height', content: '859' })
    })
    it('provides og:image:width meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:image:width', content: '1646' })
    })
    it('provides og:title meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:title', content: 'Sept 2017' })
    })
    it('provides og:url meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ property: 'og:url', content: canonicalUrl })
    })
    it('provides twitter:card meta', () => {
      expect(wrapper.vm.$metaInfo.meta)
        .toContainMatch({ name: 'twitter:card', content: 'summary_large_image' })
    })
    it('provides canonicalUrl link', () => {
      expect(wrapper.vm.$metaInfo.link)
        .toContainMatch({ rel: 'canonical', href: canonicalUrl })
    })
    it('provides jsonld script', () => {
      expect(wrapper.vm.$metaInfo.script)
        .toContainMatch({ type: 'application/ld+json', json: jsonld })
    })
  })
})
