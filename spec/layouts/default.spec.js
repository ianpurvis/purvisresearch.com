import { useHead } from '#imports'
import { shallowMount } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import Layout, * as metadata from '~/layouts/default.vue'

describe('default.vue', () => {

  beforeAll(() => ({ stubs: ['nuxt', 'nuxt-link'] }))
  beforeEach((options) => shallowMount(Layout, options))

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

    it('provides html lang attribute', ({ htmlAttrs: { lang } }) => {
      expect(lang).toBe('en')
    })

    it('provides title', ({ title }) => {
      expect(title).toBe(metadata.title)
    })

    it('provides charset meta', ({ meta }) => {
      expect(meta).toContainMatch({ charset: 'utf-8' })
    })

    it('provides description meta', ({ meta }) => {
      expect(meta).toContainMatch({ name: 'description', content: metadata.description })
    })

    it('provides viewport meta', ({ meta }) => {
      expect(meta).toContainMatch({ name: 'viewport' })
    })

    it('provides msapplication config meta', ({ meta }) => {
      expect(meta).toContainMatch({ name: 'msapplication-config', content: metadata.browserConfigUrl })
    })

    it('provides apple touch icon link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'apple-touch-icon', href: metadata.appleTouchIconUrl })
    })

    it('provides 16x16 favicon link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'icon', sizes: '16x16', href: metadata.favicon16Url })
    })

    it('provides 32x32 favicon link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'icon', sizes: '32x32', href: metadata.favicon32Url })
    })

    it('provides manifest link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'manifest', href: metadata.manifestUrl })
    })

    it('provides mask icon link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'mask-icon', href: metadata.maskIconUrl })
    })

    it('provides jsonld script', ({ script }) => {
      expect(typeof metadata.jsonld).toBe('string')
      expect(script).toContainMatch({ type: 'application/ld+json', textContent: metadata.jsonld })
    })
  })
})
