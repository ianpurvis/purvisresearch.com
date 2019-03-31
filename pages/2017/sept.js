import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import Sept2017Demo from '~/assets/javascripts/2017/sept.js'
import organization from '~/structured_data/organization.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', this.maximizeFrame)
    this.stopAnimating()
    document.body.removeChild(this.demo.element)
    this.demo.dispose()
    this.demo = null
  },
  components: {
    ObfuscatedMailto
  },
  data() {
    return {
      animationFrame: null,
      demo: null,
      description: "An emoji particle flow in WebGL.",
      title: "sept 2017 - purvis research",
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${organization.url}${require("~/assets/images/2017/sept.png")}` },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Sept 2017" },
        { name:"twitter:card", content:"summary_large_image" },
      ],
      link: [
        { rel: "canonical", href: `${organization.url}/2017/sept.html` }
      ],
    }
  },
  jsonld() {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "purvis research",
        "item": organization.url
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "sept 2017",
        "item": `${organization.url}/2017/sept.html`
      }]
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
    this.demo = new Sept2017Demo(this.frame())
    this.demo.load().then(() => {
      document.body.appendChild(this.demo.element)
      this.startAnimating()
      window.addEventListener('resize', this.maximizeFrame)
    })
  }
}
