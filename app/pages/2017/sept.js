import ogImagePath from '~/assets/images/2017/sept/an-emoji-particle-flow-in-webgl.png'
import Graphix from '~/mixins/graphix.js'
import { Organization } from '~/models/organization.js'
import { WebGL } from '~/models/webgl.js'

export default {
  beforeDestroy() {
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2017/sept.html`
    this.title = 'Sep 2017: An Emoji Particle Flow in WebGL | Purvis Research'
    this.description = 'An emoji particle flow in WebGL.'
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
        'name': 'sept 2017',
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
        { property:'og:title', content:'Sept 2017' },
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
      const canvas = this.$refs.canvas
      WebGL.assertWebGLAvailable(canvas)
      const { PixiEngine } = await import('../../engines/pixi-engine.js')
      const { EmojiParticleFlowScene } = await import('../../scenes/emoji-particle-flow.js')
      const engine = new PixiEngine(canvas, { maxFPS: 30 })
      const { clientHeight, clientWidth } = canvas
      engine.scene = new EmojiParticleFlowScene(clientWidth, clientHeight)
      this.engine = engine
      await engine.play()
    }
  },
  mixins: [
    Graphix,
  ],
  mounted() {
    this.load().catch(Graphix.errorCaptured)
  }
}
