import {
  Font,
  LessDepth,
  Mesh,
  MeshNormalMaterial,
  TextBufferGeometry,
  Vector3
} from 'three'
import AlphabetParticle from '~/assets/javascripts/alphabet_particle.js'
import Inconsolata from "~/assets/fonts/Inconsolata_Regular.json"
import * as Random from '~/assets/javascripts/random.js'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'
import Config from '~/nuxt.config'

export default {
  beforeDestroy() {
  },
  components: {
    ObfuscatedMailto
  },
  data () {
    return {
      alphabet: Array.from("abcdefghijklmnopqrstuvwxyz0123456789"),
      animationFrame: null,
      font: new Font(Inconsolata),
      particles: [],
      title: "nov 2017 - purvis research"
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"A 3d character exploder in WebGL" },
        { property:"og:image", content: require("~/assets/images/2017/nov.png") },
        { property:"og:image:height", content:"619" },
        { property:"og:image:width", content:"1183" },
        { property:"og:title", content:"Nov 2017" },
        { name:"twitter:card", content:"summary_large_image" },
      ],
      link: [
        { rel: "canonical", href: `${Config.sitemap.hostname}/2017/nov.html` }
      ],
    }
  },
  methods: {
    layout() {
      this.camera.far = 10000
      this.camera.position.z = Random.rand({min: 100, max: 150})
    },
    load() {
      return new Promise(resolve => {
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
        resolve()
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
    this.load().then(this.layout)
  }
}

