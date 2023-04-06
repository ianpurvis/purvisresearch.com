import ogImagePath from '../../assets/images/2018/oct/screenprinting-a-3d-scan-with-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { ScreenPrintingA3DScan } from '../../scenes/screen-printing-a-3d-scan.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2018/oct.html`
export const title = 'Oct 2018: Screen Printing a 3D Scan With WebGL | Purvis Research'
export const description = 'Screen printing a 3D scan with WebGL.'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const ogTitle = 'Oct 2018'
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
    'name': 'oct 2018',
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
      if (this.engine) this.engine.dispose()
    },
    async load() {
      const { graphix: { $refs: { canvas } } } = this.$refs
      if (!detectWebGL(canvas)) return
      const engine = this.engine = new ThreeEngine(canvas, { maxFPS: 20 })
      const scene = engine.scene = new ScreenPrintingA3DScan()
      await scene.load()
      await engine.play()
    },
  },
  async mounted() {
    this.load()
  }
}
