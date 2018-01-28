import * as Nov from '~/assets/javascripts/nov_2017.js'

export default {
  beforeDestroy() {
    window.removeEventListener('resize', Nov.maximizeGraphics)
  },
  data () {
    return {
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
    unobfuscate(event) {
      let link = event.currentTarget
      link.href = link.href.replace('@@','.')
    }
  },
  mounted() {
    Nov.startGraphics()
    window.addEventListener('resize', Nov.maximizeGraphics)
  }
}

