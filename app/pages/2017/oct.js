import ogImagePath from '~/assets/images/2017/oct/a-bezier-moire-generator-in-webgl.png'
import PixiDemo from '~/mixins/pixi-demo.js'
import { BezierTexture } from '~/models/bezier_texture.js'
import { SECONDS_TO_MILLISECONDS } from '~/models/constants.js'
import { Organization } from '~/models/organization.js'
import { Oscillator } from '~/models/oscillator.js'
import { Random } from '~/models/random.js'

export default {
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2017/oct.html`
    this.description = 'A bézier moiré generator in WebGL.'
    this.jsonld = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'purvis research',
        'item': Organization.default.url
      },{
        '@type': 'ListItem',
        'position': 2,
        'name': 'oct 2017',
        'item': this.canonicalUrl
      }]
    },
    this.speedOfLife = 0.4 // Slow-motion
    this.textures = []
    this.title = 'oct 2017 - purvis research'
  },
  head () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Oct 2017' },
        { property:'og:url', content: this.canonicalUrl },
        { name:'twitter:card', content:'summary_large_image' },
      ],
      link: [
        { rel: 'canonical', href: this.canonicalUrl }
      ],
      script: [
        { type: 'application/ld+json', json: this.jsonld }
      ],
    }
  },
  methods: {
    async load() {
      await PixiDemo.methods.load.call(this)

      let { height, width } = this.frame()
      const textures = await Promise.all([
        BezierTexture.create('0xff0000', height, width),
        BezierTexture.create('0x00ff00', height, width),
        BezierTexture.create('0x0000ff', height, width)
      ])
      textures
        .sort(Random.comparison)
        .forEach(texture => this.scene.addChild(texture))
      this.textures = textures
    },
    async oscillatePosition(object, { amplitude, period }) {
      return new Promise((resolve, reject) => {
        const oscillator = new Oscillator({ amplitude, period })
        this.animations.push({
          startTime: this.elapsedTime,
          duration: Number.MAX_VALUE,
          tick: (t) => {
            object.x = oscillator.sin(t)
          },
          resolve: resolve,
          reject: reject
        })
      })
    },
    update() {
      PixiDemo.methods.update.call(this)
    }
  },
  mixins: [
    PixiDemo,
  ],
  async mounted() {
    try {
      await this.load()
      const oscillations = this.textures
        .slice(-2)
        .map(texture => this.oscillatePosition(texture, {
          amplitude: 50, // pixels
          period: Random.rand({ min: 50, max: 100 }) * SECONDS_TO_MILLISECONDS
        }))
      await Promise.all(oscillations)
    }
    catch(error) {
      this.logError(error)
    }
  }
}
