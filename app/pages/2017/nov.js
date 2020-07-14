import {
  Font,
  LessDepth,
  MeshNormalMaterial,
  TextBufferGeometry,
  Vector3
} from 'three'
import ogImagePath from '~/assets/images/2017/nov/a-3d-character-exploder-in-webgl.png'
import Inconsolata from '~/assets/models/Inconsolata_Regular.json'
import ThreeDemo from '~/mixins/three-demo.js'
import { Organization } from '~/models/organization.js'
import { Particle } from '~/models/particle.js'
import { Random } from '~/models/random.js'

export default {
  beforeDestroy() {
  },
  created() {
    // Non-reactive data:
    this.alphabet = Array.from('abcdefghijklmnopqrstuvwxyz0123456789')
    this.canonicalUrl = `${Organization.default.url}/2017/nov.html`
    this.description = 'A 3d character exploder in WebGL.'
    this.font = new Font(Inconsolata)
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
        'name': 'nov 2017',
        'item': this.canonicalUrl
      }]
    },
    this.particles = []
    this.speedOfLife = 0.4 // Slow motion
    this.title = 'Nov 2017: A 3D Character Exploder in WebGL | Purvis Research'
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
        { property:'og:title', content:'Nov 2017' },
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
    layout() {
      this.camera.far = 10000
      this.camera.position.z = Random.rand({min: 100, max: 150})
    },
    async load() {
      await ThreeDemo.methods.load.call(this)

      this.particles = this.alphabet.map(character => {
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

        let particle = new Particle(geometry, material)

        let blastRadius = 60
        let acceleration = new Vector3(
          Random.rand({min: -blastRadius, max: blastRadius}),
          Random.rand({min: -blastRadius, max: blastRadius}),
          Random.rand({min: -blastRadius, max: blastRadius})
        )
        particle.acceleration = acceleration
        // Give each particle a jump start:
        particle.position.copy(acceleration)

        let mass = Random.rand({min: 0.25, max: 1})
        particle.mass = mass
        particle.scale.setScalar(mass)

        particle.rotation.set(
          Random.rand({max: 2 * Math.PI}),
          Random.rand({max: 2 * Math.PI}),
          Random.rand({max: 2 * Math.PI})
        )

        return particle
      })

      this.scene.add(...this.particles)
    },
    update() {
      ThreeDemo.methods.update.call(this)
      this.particles.forEach(p => p.update(this.deltaTime))
    },
  },
  mixins: [
    ThreeDemo,
  ],
  async mounted() {
    try {
      await this.load()
      await this.layout()
    }
    catch(error) {
      this.logError(error)
    }
  }
}

