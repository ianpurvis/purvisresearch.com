import ogImagePath from '~/assets/images/2017/oct/a-bezier-moire-generator-in-webgl.png'
import Graphix from '~/components/graphix.vue'
import { Organization } from '~/models/organization.js'
import { detectWebGL } from '~/models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2017/oct.html`
export const title = 'Oct 2017: A Bézier Moiré Generator in WebGL | Purvis Research'
export const description = 'A bézier moiré generator in WebGL.'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const ogTitle = 'Oct 2017'
export const jsonld = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [{
    '@type': 'ListItem',
    'position': 1,
    'name': 'purvis research',
    'item': org.url
  },{
    '@type': 'ListItem',
    'position': 2,
    'name': 'oct 2017',
    'item': canonicalUrl
  }]
})

export default {
  beforeDestroy() {
    this.dispose()
  },
  components: {
    Graphix
  },
  head () {
    return {
      title,
      meta: [
        { name: 'description', content: description, hid: 'description' },
        { property:'og:description', content: description },
        { property:'og:image', content: ogImageUrl },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content: ogTitle },
        { property:'og:url', content: canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: jsonld }
      ],
    }
  },
  methods: {
    dispose() {
      if (this.engine) this.engine.dispose()
    },
    async load() {
      const { graphix: { $refs: { canvas } } } = this.$refs
      if (!detectWebGL(canvas)) return
      const { PixiEngine } = await import('../../engines/pixi-engine.js')
      const { BezierMoireGenerator } = await import('../../scenes/bezier-moire-generator.js')
      const engine = new PixiEngine(canvas, { maxFPS: 30 })
      const { clientHeight, clientWidth } = canvas
      engine.scene = new BezierMoireGenerator(clientWidth, clientHeight)
      this.engine = engine
      await this.engine.play()
    }
  },
  mounted() {
    this.load()
  }
}
