import ogImagePath from '../../assets/images/2020/jul/a-banknote-in-simplex-wind.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../mixins/graphix.js'
import { Organization } from '../../models/organization.js'
import { BanknoteInSimplexWind } from '../../scenes/banknote-in-simplex-wind.js'
import { detectWebGL } from '../../models/webgl.js'

export default {
  beforeDestroy() {
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2020/jul.html`
    this.title = 'Jul 2020: A Banknote in Simplex Wind | Purvis Research'
    this.description = 'A Banknote In Simplex Wind'
    this.jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'purvis research',
        'item': Organization.default.url
      },{
        '@type': 'ListItem',
        'position': 2,
        'name': 'jul 2020',
        'item': this.canonicalUrl
      }]
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Jul 2020' },
        { property:'og:url', content: this.canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: this.canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: this.jsonld }
      ],
    }
  },
  methods: {
    dispose() {
      if (this.scene) this.scene.dispose()
      if (this.engine) this.engine.dispose()
    },
    async load() {
      const { canvas } = this.$refs
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
