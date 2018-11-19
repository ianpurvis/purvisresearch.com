import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import Demo from '~/assets/javascripts/2018/oct.js'
import Stats from 'stats.js'

export default {
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyup)
    window.removeEventListener('resize', this.maximizeFrame)
    this.stopAnimating()
    document.body.removeChild(this.demo.element)
    this.demo.dispose()
    this.demo = null
  },
  components: {
    'obfuscated-mailto': ObfuscatedMailto
  },
  data() {
    return {
      animationFrame: null,
      demo: null,
      stats: null,
      title: "oct 2018 - purvis research"
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"Screen printing a 3D scan with WebGL" },
        { property:"og:image", content: require("~/assets/images/2018/oct.png") },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Oct 2018" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    animate() {
      if (this.stats) this.stats.begin()
      this.demo.update()
      this.demo.render()
      if (this.stats) this.stats.end()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    handleKeyup(event) {
      if (event.defaultPrevented) return

      switch (event.key) {
        case "p": this.toggleProfiling()
      }
    },
    frame() {
      return {
        height: Math.max(document.body.clientHeight, window.innerHeight),
        width: Math.max(document.body.clientWidth, window.innerWidth)
      }
    },
    maximizeFrame() {
      this.demo.frame = this.frame()
    },
    startAnimating() {
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    stopAnimating() {
      if (!this.animationFrame) return
      window.cancelAnimationFrame(this.animationFrame)
    },
    startProfiling() {
      if (this.stats) return
      this.stats = new Stats()
      this.stats.showPanel(0)
      document.body.appendChild(this.stats.dom)
    },
    stopProfiling() {
      if (!this.stats) return
      document.body.removeChild(this.stats.dom)
      this.stats = null
    },
    toggleProfiling() {
      (this.stats) ? this.stopProfiling() : this.startProfiling()
    },
  },
  mounted() {
    let pixelRatio = Math.max(window.devicePixelRatio, 2)
    this.demo = new Demo(this.frame(), pixelRatio)
    document.body.appendChild(this.demo.element)

    this.startAnimating()
    window.addEventListener('resize', this.maximizeFrame)
    window.addEventListener('keyup', this.handleKeyup)

    this.demo.load()
  }
}

