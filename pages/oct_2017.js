import * as Oct from '~/assets/javascripts/oct_2017.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', Oct.maximizeGraphics)
  },
  data () {
    return {
      title: "oct 2017 - purvis research"
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"A bézier moiré generator in WebGL." },
        { property:"og:image", content:"http://purvisresearch.com/oct_2017.png" },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Oct 2017" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    unobfuscate(event) {
      let link = event.currentTarget
      link.href = link.href.replace('@@','.')
    }
  },
  mounted() {
    Oct.initializePIXI()
    window.addEventListener('resize', Oct.maximizeGraphics)
  }
}
