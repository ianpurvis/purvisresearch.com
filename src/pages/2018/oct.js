import ogImagePath from '../../assets/images/2018/oct/screenprinting-a-3d-scan-with-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../mixins/graphix.js'
import { Organization } from '../../models/organization.js'
import { ScreenPrintingA3DScan } from '../../scenes/screen-printing-a-3d-scan.js'
import { WebGL } from '../../models/webgl.js'

export default {
  beforeDestroy() {
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2018/oct.html`
    this.title = 'Oct 2018: Screen Printing a 3D Scan With WebGL | Purvis Research'
    this.description = 'Screen printing a 3D scan with WebGL.'
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
        'name': 'oct 2018',
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
        { property:'og:title', content:'Oct 2018' },
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
      const { canvas } = this.$refs
      WebGL.assertWebGLAvailable(canvas)
      const engine = this.engine = new ThreeEngine(canvas, { maxFPS: 20 })
      const scene = engine.scene = new ScreenPrintingA3DScan()
      await scene.load()
      await engine.play()
    },
  },
  mixins: [
    Graphix,
  ],
  async mounted() {
    this.load().catch(Graphix.errorCaptured)
  }
}