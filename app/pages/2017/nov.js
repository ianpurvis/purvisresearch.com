import {
  Font,
  LessDepth,
  Mesh,
  MeshNormalMaterial,
  TextBufferGeometry,
  Vector3
} from 'three'
import Inconsolata from "~/assets/models/Inconsolata_Regular.json"
import ThreeDemo from '~/mixins/three_demo.js'
import AlphabetParticle from '~/models/alphabet_particle.js'
import { Organization } from '~/models/organization.js'
import { Random } from '~/models/random.js'

export default {
  beforeDestroy() {
  },
  data () {
    return {
      alphabet: Array.from("abcdefghijklmnopqrstuvwxyz0123456789"),
      animationFrame: null,
      canonicalUrl: `${Organization.default.url}/2017/nov.html`,
      description: "A 3d character exploder in WebGL.",
      font: new Font(Inconsolata),
      particles: [],
      title: "nov 2017 - purvis research",
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:"og:description", content: this.description },
        { property:"og:image", content: `${Organization.default.url}${require("~/assets/images/2017/nov.png")}` },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Nov 2017" },
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
          "name": "nov 2017",
          "item": this.canonicalUrl
        }]
    }
  },
  methods: {
    layout() {
      this.camera.far = 10000
      this.camera.position.z = Random.rand({min: 100, max: 150})
    },
    load() {
      return Promise.resolve(
        ThreeDemo.methods.load.call(this)
      ).then(() => {
        this.alphabet.forEach(character => {
          let geometry = new TextBufferGeometry(character, {
            font: this.font
          })
          geometry.center()

          let material = new MeshNormalMaterial({
            depthFunc: LessDepth,
            opacity: 0.7,
            transparent: false,
            wireframe: true,
            wireframeLinewidth: 2.0,
          })

          let mesh = new Mesh(geometry, material)
          let radius = 60
          let acceleration = new Vector3(
            Random.rand({min: -radius, max: radius}),
            Random.rand({min: -radius, max: radius}),
            Random.rand({min: -radius, max: radius})
          )
          let scale = Random.rand({min: 0.25, max: 1})

          // Give each particle a jump start:
          mesh.position.copy(acceleration)

          mesh.rotation.set(
            Random.rand({max: 2 * Math.PI}),
            Random.rand({max: 2 * Math.PI}),
            Random.rand({max: 2 * Math.PI})
          )
          mesh.scale.setScalar(scale)

          let particle = new AlphabetParticle({
            mesh: mesh,
            acceleration: acceleration,
            mass: scale
          })

          this.particles.push(particle)
          this.scene.add(mesh)
        })
      })
    },
    update() {
      let deltaTime = this.deltaTime()
      if (deltaTime == 0) return
      this.particles.forEach(p => p.update(deltaTime))
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load().then(this.layout).catch(this.logError)
  }
}

