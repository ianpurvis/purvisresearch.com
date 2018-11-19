import {
  Color,
  DoubleSide,
  LineSegments,
  Material,
  Mesh,
  Spherical,
  Vector3,
  WireframeGeometry,
} from 'three'
import ModelLoader from '~/assets/javascripts/model_loader.js'
import Random from '~/assets/javascripts/random.js'
import Basket from '~/assets/models/basket.draco.glb'
import ObfuscatedMailto from '~/components/obfuscated_mailto.vue'
import ThreeDemo from '~/mixins/three_demo.js'

const BASKET_RADIUS = 64 // Pre-computed from basket.geometry.boundingSphere.radius
const DEGREES_TO_RADIANS = (Math.PI / 180)

export default {
  beforeDestroy() {
  },
  components: {
    ObfuscatedMailto
  },
  data() {
    return {
      colors: [
        new Color(0xff00ff),
        new Color(0xffff00)
      ],
      loader: new ModelLoader(),
      speedOfLife: 0.05,
      title: "oct 2018 - purvis research",
    }
  },
  head() {
    return {
      title: this.title,
      meta: [
        { property:"og:description", content:"Screen printing a 3D scan with WebGL" },
        { property:"og:image", content: require("~/assets/images/2018/oct.png") },
        { property:"og:image:height", content:"859" },
        { property:"og:image:width", content:"1646" },
        { property:"og:title", content:"Oct 2018" },
        { name:"twitter:card", content:"summary_large_image" },
      ]
    }
  },
  methods: {
    layout() {
      this.colors.sort(Random.comparison)

      this.basket.material.color = this.colors[0]
      this.basket.material.opacity = Random.rand({min: 0.25, max: 0.90})

      this.clone.material.color = this.colors[1]
      this.clone.material.opacity = Random.rand({min: 0.25, max: 0.90})

      this.clone.position.copy(
        this.vectorFromSpherical({
          radius: Random.rand({max: 8}),
          theta: Random.rand({max: 180}),
          phi: Random.rand({max: 360})
        })
      )

      let orbitScale = Random.rand({min: 1.20, max: 1.70})
      if (this.renderer.getSize().width >= 568) {
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
    load() {
      return this.loader.parse(Basket)
        .then(gltf => {
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
        })
        .catch((error) => {
          console.error(`An error happened ${error}`)
        })
    },
    update() {
      let deltaTime = this.deltaTime()
      if (deltaTime == 0) return
      if (!this.basket || !this.clone) return

      this.basket.material.opacity -= deltaTime
      this.clone.material.opacity -= deltaTime

      // This update loop will decrement opacity below zero,
      // providing a hack to delay re-layout for a few ms:
      let threshold = -0.1
      if (this.basket.material.opacity < threshold
        && this.clone.material.opacity < threshold
      ) {
        this.layout()
      }
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
  mounted() {
    this.load().then(this.layout)
  }
}

