import { useHead } from '#imports'
import { beforeAll, beforeEach, describe, expect, it } from 'jest-ctx'

export function describeHeadBehavior({
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
  describe('when calling useHead', () => {

    beforeAll(() => {
      useHead.mockClear()
    })

    beforeEach(() => (
      useHead.mock.calls[0][0]
    ))

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
      expect(typeof jsonld).toBe('string')
      expect(script).toContainMatch({ type: 'application/ld+json', textContent: jsonld })
    })
  })
}
