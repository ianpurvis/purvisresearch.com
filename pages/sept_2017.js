import * as Sept from '~/assets/javascripts/sept_2017.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', Sept.maximizeGraphics)
  },
  data() {
    return {
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
    unobfuscate(event) {
      let link = event.currentTarget
      link.href = link.href.replace('@@','.')
    }
  },
  mounted() {
    Sept.initializePIXI()
    window.addEventListener('resize', Sept.maximizeGraphics)
  }
}
