import { createLocalVue } from '@vue/test-utils'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'
import VueMeta from 'vue-meta'

export function describeVueMetaBehavior({
  canonicalUrl,
  description,
  jsonld,
  ogImageHeight = 859,
  ogImageUrl,
  ogImageWidth = 1646,
  ogTitle,
  title,
  twitterCard = 'summary_large_image'
}) {
  describe('when using vue-meta', () => {

    beforeAll((options) => {
      const localVue = createLocalVue()
      localVue.use(VueMeta, { keyName: 'head' })
      return { ...options, localVue }
    })

    beforeEach((wrapper) => {
      return wrapper.vm.$metaInfo
    })

    it('provides title', ({ title: actual }) => {
      expect(actual).toBe(title)
    })

    it('provides description meta', ({ meta }) => {
      expect(meta).toContainMatch({ name: 'description', content: description })
    })

    it('provides og:description meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:description', content: description })
    })

    it('provides og:image meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:image', content: ogImageUrl })
    })

    it('provides og:image:height meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:image:height', content: String(ogImageHeight) })
    })

    it('provides og:image:width meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:image:width', content: String(ogImageWidth) })
    })

    it('provides og:title meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:title', content: ogTitle })
    })

    it('provides og:url meta', ({ meta }) => {
      expect(meta).toContainMatch({ property: 'og:url', content: canonicalUrl })
    })

    it('provides twitter:card meta', ({ meta }) => {
      expect(meta).toContainMatch({ name: 'twitter:card', content: twitterCard })
    })

    it('provides canonicalUrl link', ({ link }) => {
      expect(link).toContainMatch({ rel: 'canonical', href: canonicalUrl })
    })

    it('provides jsonld script', ({ script }) => {
      expect(script).toContainMatch({ type: 'application/ld+json', json: jsonld })
    })
  })
}
