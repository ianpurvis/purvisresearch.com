import PixiDemo from '~/mixins/pixi_demo.js'
import { BezierTexture } from '~/assets/javascripts/bezier_texture.js'
import Oscillator from '~/assets/javascripts/oscillator.js'
import * as Random from '~/assets/javascripts/random.js'
import { SECONDS_TO_MILLISECONDS } from '~/assets/javascripts/constants.js'
import organization from '~/structured_data/organization.js'
import { isWebGLAvailable } from 'exports-loader?WEBGL!three/examples/js/WebGL.js'

export default {
  data () {
    return {
      canonicalUrl: `${organization.url}/2017/oct.html`,
      description: "A bézier moiré generator in WebGL.",
      elapsedTime: 0,
      oscillators: [
        new Oscillator({
          amplitude: 50,
          period: 100 * SECONDS_TO_MILLISECONDS
        }),
        new Oscillator({
          amplitude: 50,
          period: 50 * SECONDS_TO_MILLISECONDS
        })
      ],
      speedOfLife: 0.4, // Slow-motion
      textures: [],
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
    load() {
      return Promise.resolve(
        PixiDemo.methods.load.call(this)
      ).then(() => {
        let { height, width } = this.frame()
        return Promise.all([
          BezierTexture.create('0xff0000', height, width),
          BezierTexture.create('0x00ff00', height, width),
          BezierTexture.create('0x0000ff', height, width)
        ])
      }).then(textures => {
        textures
          .sort(Random.comparison)
          .forEach(texture => this.scene.addChild(texture))
        this.textures = textures
      })
    },
    update() {
      let deltaTime = this.deltaTime()
      if (deltaTime == 0) return
      this.elapsedTime += deltaTime
      if (this.oscillators.length < 1) return
      if (this.textures.length < 1) return
      this.textures[1].x = this.oscillators[0].sine(this.elapsedTime)
      this.textures[2].x = this.oscillators[1].sine(this.elapsedTime)
    }
  },
  mixins: [
    PixiDemo,
  ],
  mounted() {
    if (!isWebGLAvailable()) {
      let message = [
        'Your device does not seem to support WebGL.',
        'Learn more at http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'
      ].join('\n')
      console.warn(message)
      return
    }
    this.load()
  }
}
