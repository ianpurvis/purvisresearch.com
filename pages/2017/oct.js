import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import Oct2017Demo from '~/assets/javascripts/2017/oct.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', this.maximizeFrame)
    this.stopAnimating()
    document.body.removeChild(this.demo.element)
    this.demo.dispose()
    this.demo = null
  },
  components: {
    'obfuscated-mailto': ObfuscatedMailto
  },
  data () {
    return {
      animationFrame: null,
      demo: null,
      title: "oct 2017 - purvis research"
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"A bézier moiré generator in WebGL." },
        { property:"og:image", content: require("~/assets/images/2017/oct.png") },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Oct 2017" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    animate() {
      this.demo.update()
      this.demo.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
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
  },
  mounted() {
    this.demo = new Oct2017Demo(this.frame())
    document.body.appendChild(this.demo.element)
    this.startAnimating()
    window.addEventListener('resize', this.maximizeFrame)

    this.demo.load()
  }
}
