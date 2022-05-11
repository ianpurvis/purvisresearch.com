import ogImagePath from '../../assets/images/2019/apr/surreal-television-with-webrtc-and-webgl.png'
import { ThreeEngine } from '../../engines/three-engine.js'
import Graphix from '../../mixins/graphix.js'
import { Organization } from '../../models/organization.js'
import { SurrealTVScene } from '../../scenes/surreal-tv.js'

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
    isDesktopSafari() {
      let userAgent = window.navigator.userAgent
      return userAgent.match(/Safari/i) && !userAgent.match(/Mobile/i)
    },
    async load() {
      const { canvas, video } = this.$refs
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
      let constraints = {
        audio: false,
        video: true,
      }
      if (this.isDesktopSafari()) {
        constraints.video = {
          aspectRatio: { ideal: 16/9 }
        }
      }
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia(constraints)
        stream.getTracks().forEach(track => console.debug(track.getSettings()))
        if (this._isDestroyed || this._isBeingDestroyed) return
        this.$refs.video.srcObject = stream
      } catch (error) {
        console.warn(`Could not acquire device camera (${error.message})`)
      }
    },
    stopVideo() {
      let stream = this.$refs.video.srcObject
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
