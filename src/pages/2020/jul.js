import ogImagePath from '../../assets/images/2020/jul/a-banknote-in-simplex-wind.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { BanknoteInSimplexWind } from '../../scenes/banknote-in-simplex-wind.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2020/jul.html`
export const title = 'Jul 2020: A Banknote in Simplex Wind | Purvis Research'
export const description = 'A Banknote In Simplex Wind'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const ogTitle = 'Jul 2020'
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
    'name': 'jul 2020',
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
  head() {
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
      if (this.scene) this.scene.dispose()
      if (this.engine) this.engine.dispose()
    },
    async load() {
      const { graphix: { $refs: { canvas } } } = this.$refs
      if (!detectWebGL(canvas)) return
      const engine = this.engine = new ThreeEngine(canvas, { maxFPS: 0 })
      const scene = engine.scene = new BanknoteInSimplexWind()
      await scene.load()
      await engine.play()
    }
  },
  mixins: [
    Graphix
  ],
  mounted() {
    this.load()
  }
}
