import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import Oct2017Demo from '~/assets/javascripts/2017/oct.js'
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
  data () {
    return {
      animationFrame: null,
      canonicalUrl: `${organization.url}/2017/oct.html`,
      demo: null,
      description: "A bézier moiré generator in WebGL.",
      title: "oct 2017 - purvis research",
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${organization.url}${require("~/assets/images/2017/oct.png")}` },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Oct 2017" },
        { property:"og:url", content: this.canonicalUrl },
        { name:"twitter:card", content:"summary_large_image" },
      ],
      link: [
        { rel: "canonical", href: this.canonicalUrl }
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
        "name": "oct 2017",
        "item": `${organization.url}/2017/oct.html`
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
    this.demo = new Oct2017Demo(this.frame())
    this.demo.load().then(() => {
      document.body.appendChild(this.demo.element)
      this.startAnimating()
      window.addEventListener('resize', this.maximizeFrame)
    })
  }
}
