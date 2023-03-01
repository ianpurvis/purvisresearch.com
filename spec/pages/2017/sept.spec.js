import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueMeta from 'vue-meta'
import Component, { canonicalUrl, description, jsonld, ogImageUrl, title } from '~/pages/2017/sept.vue'

describe('Sept', () => {
  let localVue, wrapper

  beforeEach(() => {
    global.console = {
      error: jest.fn(),
      warn: jest.fn()
    }
    localVue = createLocalVue()
    localVue.use(VueMeta, { keyName: 'head' })
    wrapper = shallowMount(Component, {
      localVue,
      stubs: ['nuxt-link']
    })
  })
  it('is a Vue instance', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
  it('renders title', () => {
    expect(wrapper.vm.$metaInfo.title).toBe(title)
  })
  it('renders description', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ name: 'description', content: description }))
  })
  it('renders og:description', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:description', content: description }))
  })
  it('renders og:image', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:image', content: ogImageUrl }))
  })
  it('renders og:image:height', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:image:height', content: '859' }))
  })
  it('renders og:image:width', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:image:width', content: '1646' }))
  })
  it('renders og:title', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:title', content: 'Sept 2017' }))
  })
  it('renders og:url', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ property: 'og:url', content: canonicalUrl }))
  })
  it('renders twitter:card', () => {
    expect(wrapper.vm.$metaInfo.meta).toContainEqual(
      expect.objectContaining({ name: 'twitter:card', content: 'summary_large_image' }))
  })
  it('renders canonicalUrl', () => {
    expect(wrapper.vm.$metaInfo.link).toContainEqual(
      expect.objectContaining({ rel: 'canonical', href: canonicalUrl }))
  })
  it('renders jsonld', () => {
    expect(wrapper.vm.$metaInfo.script).toContainEqual(
      expect.objectContaining({ type: 'application/ld+json', json: jsonld }))
  })
})
