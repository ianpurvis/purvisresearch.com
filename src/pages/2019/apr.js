import ogImagePath from '../../assets/images/2019/apr/surreal-television-with-webrtc-and-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../components/graphix.vue'
import { Organization } from '../../models/organization.js'
import { SurrealTVScene } from '../../scenes/surreal-tv.js'
import { detectWebGL } from '../../models/webgl.js'

const org = Organization.default
export const canonicalUrl = `${org.url}/2019/apr.html`
export const title = 'Apr 2019: Surreal Television With WebRTC and WebGL | Purvis Research'
export const description = 'Surreal television with WebRTC and WebGL.'
export const ogImageUrl = `${org.url}${ogImagePath}`
export const ogTitle = 'Apr 2019'
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
    'name': 'apr 2019',
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
      this.engine.pause()
      this.engine.dispose()
      this.stopVideo()
    },
    async load() {
      const { graphix: { $refs: { canvas } }, video } = this.$refs
      if (!detectWebGL(canvas)) return
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
          frameRate: 20,
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
  mounted() {
    Promise.all([
      this.load(),
      this.startVideo()
    ])
  }
}
