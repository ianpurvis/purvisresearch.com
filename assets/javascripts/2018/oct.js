import { Color, WireframeGeometry, LineSegments, DoubleSide, Spherical, Vector3 } from 'three'
import ModelLoader from '~/assets/javascripts/model_loader.js'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'
import Basket from '~/assets/models/basket.draco.glb'

const BASKET_RADIUS = 64 // Pre-computed from basket.geometry.boundingSphere.radius
const DEGREES_TO_RADIANS = (Math.PI / 180)

export default class Oct2018Demo extends ThreeDemo {

  constructor(frame, pixelRatio) {
    super(frame, pixelRatio)
    this.loader = new ModelLoader()
    this.speedOfLife = 0.05
  }

  layout() {
    let colors = [
      new Color(0xff00ff),
      new Color(0xffff00)
    ].sort(Random.comparison)

    this.basket.material.color = colors[0]
    this.basket.material.opacity = Random.rand({min: 0.25, max: 0.90})

    this.clone.material.color = colors[1]
    this.clone.material.opacity = Random.rand({min: 0.25, max: 0.90})

    this.clone.position.copy(
      this.vectorFromSpherical({
        radius: Random.rand({max: 8}),
        theta:  Random.rand({max: 180}),
        phi: Random.rand({max: 360})
      })
    )

    this.scene.lookAt(
      this.vectorFromSpherical({
        radius: Random.rand({max: 8}),
        theta:  Random.rand({max: 180}),
        phi: Random.rand({max: 360})
      })
    )

    let orbitScale = Random.rand({min: 1.20, max: 2.0})
    if (this.renderer.getSize().width >= 568) {
      orbitScale = Random.rand({min: 0.90, max: 1.20})
    }

    this.camera.position.copy(
      this.vectorFromSpherical({
        radius: BASKET_RADIUS * orbitScale,
        theta:  Random.rand({min: 50, max: 140}),
        phi: Random.rand({max: 360})
      })
    )

    this.camera.lookAt(
      this.vectorFromSpherical({
        radius: BASKET_RADIUS * Random.rand({max: 0.50}),
        theta:  Random.rand({max: 180}),
        phi: Random.rand({max: 360})
      })
    )
  }

  load() {
    return this.loader.parse(Basket)
      .then(gltf => {
        this.basket = gltf.scene.children[0]
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

        this.layout()
      })
      .catch((error) => {
        console.error(`An error happened ${error}`)
      })
  }

  vectorFromSpherical({radius, theta, phi}) {
    let spherical = new Spherical(radius, theta * DEGREES_TO_RADIANS, phi * DEGREES_TO_RADIANS).makeSafe()
    let vector = new Vector3().setFromSpherical(spherical)
    return vector
  }

  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife
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
  }
}
