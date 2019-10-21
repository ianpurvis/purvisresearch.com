import PixiDemo from '~/mixins/pixi_demo.js'
import { SECONDS_TO_MILLISECONDS } from '~/models/constants.js'
import { Organization } from '~/models/organization.js'

export default {
  data() {
    return {
      canonicalUrl: `${Organization.default.url}/2017/sept.html`,
      description: "An emoji particle flow in WebGL.",
      emitter: null,
      speedOfLife: 0.4, // Slow-motion
      textures: [],
      title: "sept 2017 - purvis research",
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${Organization.default.url}${require("~/assets/images/2017/sept.png")}` },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Sept 2017" },
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
        "item": Organization.default.url
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "sept 2017",
        "item": this.canonicalUrl
      }]
    }
  },
  methods: {
    dispose() {
      this.textures.forEach(texture => texture.destroy())
      if (this.emitter) this.emitter.destroy()
      PixiDemo.methods.dispose.call(this)
    },
    load() {
      return Promise.resolve(
        PixiDemo.methods.load.call(this)
      ).then(() =>
        import('~/shims/pixi.js')
      ).then(({ Emitter, RenderTexture, Text }) => {
        Array
          .from("💾📀")
          .map(emoji => new Text(emoji, {
            fontSize: '32px',
          }))
          .forEach(text => {
            // Pre-render texture and discard the text:
            let texture = RenderTexture.create({
              height: 32,
              width: 32,
              resolution: this.renderer.resolution
            })
            this.renderer.render(text, texture)
            this.textures.push(texture)
            text.destroy(true)
          })

        let options = {
          frequency: 0.020,
          pos: {
            x: 0,
            y: 0
          },
          rotationSpeed: {
            min: 100,
            max: 400
          },
          scale: {
            list: [
              {
                value: 0.5,
                time: 0
              },{
                value: 1.25,
                time: 1
              }
            ],
          },
          spawnType: "rect",
          startRotation: {
            min: -5,
            max: 5
          }
        }

        let { height, width } = this.frame()
        options.spawnRect = {
          h: height
        }

        let speed = 100 // approx px per second
        options.speed = {
          list: [
            {
              value: speed,
              time: 0
            },{
              value: speed * 3.0,
              time: 1
            }
          ],
        }

        // Set lifetime to be a little less than width / avg speed
        let lifetime = width / (speed * 1.8)
        options.lifetime = {
          min: lifetime,
          max: lifetime
        }

        this.emitter = new Emitter(this.scene, this.textures, options)
      })
    },
    update() {
      PixiDemo.methods.update.call(this)
      if (!this.emitter) return
      this.emitter.update(this.deltaTime / SECONDS_TO_MILLISECONDS)
    }
  },
  mixins: [
    PixiDemo,
  ],
  mounted() {
    this.load().catch(this.logError)
  }
}
