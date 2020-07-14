import {
  Color,
  DoubleSide,
  LineSegments,
  MathUtils,
  Spherical,
  Vector3,
  WireframeGeometry,
} from 'three'
import ogImagePath from '~/assets/images/2018/oct.png'
import basketPath from '~/assets/models/basket.draco.glb'
import ThreeDemo from '~/mixins/three-demo.js'
import { DEGREES_TO_RADIANS } from '~/models/constants.js'
import { GLTFLoader } from '~/models/gltf-loader.js'
import { DRACOLoader } from '~/models/draco-loader.js'
import { Organization } from '~/models/organization.js'
import { Random } from '~/models/random.js'

const BASKET_RADIUS = 64 // Pre-computed from basket.geometry.boundingSphere.radius

export default {
  beforeDestroy() {
  },
  created() {
    // Non-reactive data:
    this.colors = [
      new Color(0xff00ff),
      new Color(0xffff00)
    ]
    this.canonicalUrl = `${Organization.default.url}/2018/oct.html`
    this.description = 'Screen printing a 3D scan with WebGL.'
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
        'name': 'oct 2018',
        'item': this.canonicalUrl
      }]
    },
    this.title = 'oct 2018 - purvis research'
  },
  head() {
    return {
      title: this.title,
      meta: [
        { name: 'description', content: this.description, hid: 'description' },
        { property:'og:description', content: this.description },
        { property:'og:image', content: `${Organization.default.url}${ogImagePath}` },
        { property:'og:image:height', content:'859' },
        { property:'og:image:width', content:'1646' },
        { property:'og:title', content:'Oct 2018' },
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
    async delay(duration) {
      return new Promise((resolve, reject) => {
        const animation = {
          startTime: this.elapsedTime,
          duration: duration,
          tick: () => {},
          resolve: resolve,
          reject: reject
        }
        this.animations.push(animation)
      })
    },
    async fadeIn(duration) {
      const basketOpacity = Random.rand({min: 0.25, max: 0.90})
      const cloneOpacity = Random.rand({min: 0.25, max: 0.90})
      return Promise.all([
        this.transitionOpacity(this.basket, basketOpacity, duration),
        this.transitionOpacity(this.clone, cloneOpacity, duration),
      ])
    },
    async fadeOut(duration) {
      const basketDuration = duration * this.basket.material.opacity
      const cloneDuration = duration * this.clone.material.opacity
      return Promise.all([
        this.transitionOpacity(this.basket, 0.0, basketDuration),
        this.transitionOpacity(this.clone, 0.0, cloneDuration),
      ])
    },
    layout() {
      this.colors.sort(Random.comparison)

      this.basket.material.color = this.colors[0]
      this.basket.material.opacity = 0

      this.clone.material.color = this.colors[1]
      this.clone.material.opacity = 0

      this.clone.position.copy(
        this.vectorFromSpherical({
          radius: Random.rand({max: 8}),
          theta: Random.rand({max: 180}),
          phi: Random.rand({max: 360})
        })
      )

      let orbitScale = Random.rand({min: 1.20, max: 1.70})
      if (this.frame().width >= 568) {
        orbitScale = Random.rand({min: 0.90, max: 1.40})
      }

      this.camera.position.copy(
        this.vectorFromSpherical({
          radius: BASKET_RADIUS * orbitScale,
          theta: Random.rand({min: 30, max: 140}),
          phi: Random.rand({max: 360})
        })
      )

      this.camera.up.copy(
        this.vectorFromSpherical({
          radius: Random.rand({max: 8}),
          theta:  Random.rand({max: 180}),
          phi: Random.rand({max: 360})
        }).normalize()
      )

      this.camera.lookAt(
        this.vectorFromSpherical({
          kadius: BASKET_RADIUS * Random.rand({max: 0.25}),
          theta: Random.rand({max: 180}),
          phi: Random.rand({max: 360})
        })
      )
    },
    async load() {
      await ThreeDemo.methods.load.call(this)

      const gltfLoader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      gltfLoader.dracoLoader = dracoLoader
      const gltf = await gltfLoader.load(basketPath)
      dracoLoader.dispose()

      this.basket = gltf.scene.children[0]
      this.basket.position.set(0,0,0)
      this.basket.geometry.center()
      this.basket.material.depthTest = false
      this.basket.material.transparent = true
      this.scene.add(this.basket)

      let wireframe = new WireframeGeometry(this.basket.geometry)
      this.clone = new LineSegments(wireframe)
      this.clone.rotation.copy(this.basket.rotation)
      this.clone.material.depthTest = false
      this.clone.material.side = DoubleSide
      this.clone.material.transparent = true
      this.scene.add(this.clone)
    },
    async transitionOpacity(object, value, duration=1.0) {
      return new Promise((resolve, reject) => {
        const opacity = object.material.opacity
        const animation = {
          startTime: this.elapsedTime,
          duration: duration,
          tick: (t, d) => {
            object.material.opacity = MathUtils.lerp(opacity, value, t/d)
          },
          resolve: resolve,
          reject: reject
        }
        this.animations.push(animation)
      })
    },
    vectorFromSpherical({radius, theta, phi}) {
      let spherical = new Spherical(radius, theta * DEGREES_TO_RADIANS, phi * DEGREES_TO_RADIANS).makeSafe()
      let vector = new Vector3().setFromSpherical(spherical)
      return vector
    }
  },
  mixins: [
    ThreeDemo,
  ],
  async mounted() {
    try {
      await this.load()
      while (this.clock.running) {
        this.layout()
        await this.fadeIn(0.1)
        await this.fadeOut(24)
        await this.delay(2)
      }
    }
    catch (exception) {
      this.logError(exception)
    }
  }
}

