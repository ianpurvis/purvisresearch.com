import ogImagePath from '~/assets/images/2017/nov/a-3d-character-exploder-in-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '~/models/organization.js'
import { CharacterExploderScene } from '../../scenes/character-exploder.js'
import { detectWebGL } from '~/models/webgl.js'

export default {
  beforeDestroy() {
    this.dispose()
  },
  components: {
    Graphix
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2017/nov.html`
    this.title = 'Nov 2017: A 3D Character Exploder in WebGL | Purvis Research'
    this.description = 'A 3d character exploder in WebGL.'
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
        'name': 'nov 2017',
        'item': this.canonicalUrl
      }]
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Nov 2017' },
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
      if (this.engine) this.engine.dispose()
    },
    async load() {
      const { graphix: { $refs: { canvas } } } = this.$refs
      if (!detectWebGL(canvas)) return
      const engine = new ThreeEngine(canvas, { maxFPS: 30 })
      engine.scene = new CharacterExploderScene()
      this.engine = engine
      await engine.play()
    }
  },
  mounted() {
    this.load()
  }
}
