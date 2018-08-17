import Nov2017Demo from '~/assets/javascripts/nov_2017.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', this.maximizeFrame)
    this.stopAnimating()
    document.body.removeChild(this.demo.element)
    this.demo.dispose()
    this.demo = null
  },
  data () {
    return {
      animationFrame: null,
      demo: null,
      title: "nov 2017 - purvis research"
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"A 3d character exploder in WebGL" },
        { property:"og:image", content:"http://purvisresearch.com/nov_2017.png" },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Nov 2017" },
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
    unobfuscate(event) {
      let link = event.currentTarget
      link.href = link.href.replace('@@','.')
    }
  },
  mounted() {
    this.demo = new Nov2017Demo(this.frame(), window.devicePixelRatio)
    document.body.appendChild(this.demo.element)
    this.startAnimating()
    window.addEventListener('resize', this.maximizeFrame)

    this.demo.load()
  }
}

