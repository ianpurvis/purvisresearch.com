import ogImagePath from '../../assets/images/2019/apr/surreal-television-with-webrtc-and-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../mixins/graphix.js'
import { Organization } from '../../models/organization.js'
import { SurrealTVScene } from '../../scenes/surreal-tv.js'
import { WebGL } from '../../models/webgl.js'

export default {
  beforeDestroy() {
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2019/apr.html`
    this.title = 'Apr 2019: Surreal Television With WebRTC and WebGL | Purvis Research'
    this.description = 'Surreal television with WebRTC and WebGL.'
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
        'name': 'apr 2019',
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
        { property:'og:title', content:'Apr 2019' },
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
      this.engine.pause()
      this.engine.dispose()
      this.stopVideo()
    },
    async load() {
      const { canvas, video } = this.$refs
      WebGL.assertWebGLAvailable(canvas)
      const engine = this.engine = new ThreeEngine(canvas, { maxFPS: 20 })
      const scene = engine.scene = new SurrealTVScene(video)
      const playPromise = engine.play()
      await scene.load()
      while (!engine.paused) {
        await scene.run()
      }
      await playPromise
    },
    async startVideo() {
      const constraints = {
        audio: false,
        video: {
          aspect: 2,
          frameRate: 8,
          height: 64,
          resizeMode: 'crop-and-scale',
          width: 128
        }
      }
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia(constraints)
        if (this._isDestroyed || this._isBeingDestroyed) return
        this.$refs.video.srcObject = stream
      } catch (error) {
        console.warn(`Could not acquire device camera (${error.message})`)
      }
    },
    stopVideo() {
      const stream = this.$refs.video.srcObject
      if (!stream) return
      stream.getTracks().forEach(track => track.stop())
    }
  },
  mixins: [
    Graphix
  ],
  mounted() {
    Promise.all([
      this.load(),
      this.startVideo()
    ]).catch(Graphix.errorCaptured)
  }
}
