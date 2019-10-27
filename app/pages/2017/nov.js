import {
  Font,
  LessDepth,
  MeshNormalMaterial,
  TextBufferGeometry,
  Vector3
} from 'three'
import ogImagePath from '~/assets/images/2017/nov.png'
import Inconsolata from '~/assets/models/Inconsolata_Regular.json'
import ThreeDemo from '~/mixins/three-demo.js'
import { DEGREES_TO_RADIANS } from '~/models/constants.js'
import { Organization } from '~/models/organization.js'
import { Particle } from '~/models/particle.js'
import { Random } from '~/models/random.js'

export default {
  beforeDestroy() {
  },
  created() {
    // Non-reactive data:
    this.canonicalUrl = `${Organization.default.url}/2017/nov.html`
    this.description = 'A 3d character exploder in WebGL.'
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
    this.title = 'nov 2017 - purvis research'
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
      this.camera.position.z = Random.rand({ min: 100, max: 150 })

      const blastRadius = 60
      const components = [ 'x', 'y', 'z' ]
      let mass, acceleration, rotation
      this.particles.forEach(particle => {
        mass = Random.rand({ min: 0.25, max: 1 })
        acceleration = components.map(() =>
          Random.rand({ min: -blastRadius, max: blastRadius })
        )
        rotation = components.map(() =>
          Random.rand({ max: 360 }) * DEGREES_TO_RADIANS
        )
        particle.mass = mass
        particle.acceleration.set(...acceleration)
        particle.rotation.set(...rotation)
        // Scale particle according to mass:
        particle.scale.setScalar(mass)
        // Give particle a jump start in the explosion:
        particle.position.set(...acceleration)
      })
    },
    load() {
      return Promise.resolve(
        ThreeDemo.methods.load.call(this)
      ).then(() => {
        const font = new Font(Inconsolata)
        const material = new MeshNormalMaterial({
          depthFunc: LessDepth,
          opacity: 0.7,
          transparent: false,
          wireframe: true,
          wireframeLinewidth: 2.0,
        })

        this.particles = Array
          .from('abcdefghijklmnopqrstuvwxyz0123456789')
          .map(character =>
            new TextBufferGeometry(character, { font }).center()
          )
          .map(geometry => new Particle(geometry, material))

        this.scene.add(...this.particles)
      })
    },
    update() {
      ThreeDemo.methods.update.call(this)
      this.particles.forEach(p => p.update(this.deltaTime))
    },
  },
  mixins: [
    ThreeDemo,
  ],
  mounted() {
    this.load().then(this.layout).catch(this.logError)
  }
}

