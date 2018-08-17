import Sept2017Demo from '~/assets/javascripts/sept_2017.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', this.maximizeFrame)
    this.stopAnimating()
    document.body.removeChild(this.demo.element)
    this.demo.dispose()
    this.demo = null
  },
  data() {
    return {
      animationFrame: null,
      demo: null,
      title: "sept 2017 - purvis research"
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"An emoji particle flow in WebGL." },
        { property:"og:image", content:"http://purvisresearch.com/sept_2017.png" },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Sept 2017" },
        { name:"twitter:card", content:"summary_large_image" },
      ],
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
    this.demo = new Sept2017Demo(this.frame())
    document.body.appendChild(this.demo.element)
    this.startAnimating()
    window.addEventListener('resize', this.maximizeFrame)

    this.demo.load()
  }
}
