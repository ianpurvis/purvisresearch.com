import Demo from '~/assets/javascripts/2018/sept.js'

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
      title: "sept 2018 - purvis research"
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"A scanned 3d model, randomly rendered in WebGL" },
        { property:"og:image", content:"http://purvisresearch.com/images/2018/sept.png" },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Sept 2018" },
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
    let pixelRatio = Math.max(window.devicePixelRatio, 2)
    this.demo = new Demo(this.frame(), pixelRatio)
    document.body.appendChild(this.demo.element)
    this.startAnimating()
    window.addEventListener('resize', this.maximizeFrame)

    this.demo.load()
  }
}

