import { Color, WireframeGeometry, LineSegments, DoubleSide, Spherical, Vector3 } from 'three'
import ModelLoader from '~/assets/javascripts/model_loader.js'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'
import basket from '~/assets/models/basket.draco.glb'

const DEGREES_TO_RADIANS = (Math.PI / 180)

export default class Oct2018Demo extends ThreeDemo {

  constructor(frame, pixelRatio) {
    super(frame, pixelRatio)
    this.loader = new ModelLoader()
    this.speedOfLife = 0.05
  }

  layoutScene(gltf) {
    let colors = [
      new Color(0xff00ff),
      new Color(0xffff00)
    ].sort(Random.comparison)

    let basket = gltf.scene.children[0]
    basket.material.color = colors[0]
    basket.material.depthTest = false
    basket.material.opacity = Random.rand({min: 0.25, max: 0.90})
    basket.material.transparent = true
    basket.material.needsUpdate = true
    basket.geometry.center()

    let wireframe = new WireframeGeometry(basket.geometry)
    let clone = new LineSegments(wireframe)
    clone.rotation.copy(basket.rotation)
    clone.material.color = colors[1]
    clone.material.depthTest = false
    clone.material.opacity = Random.rand({min: 0.25, max: 0.95})
    clone.material.side = DoubleSide
    clone.material.transparent = true
    clone.material.needsUpdate = true

    let objects = [basket, clone].sort(Random.comparison)
    this.scene.add(...objects)

    let clonePosition = this.vectorFromSpherical({
      radius: Random.rand({max: 8}),
      theta:  Random.rand({max: 180}),
      phi: Random.rand({max: 360})
    })
    clone.position.copy(clonePosition)

    let sceneRotation = this.vectorFromSpherical({
      radius: Random.rand({max: 8}),
      theta:  Random.rand({max: 180}),
      phi: Random.rand({max: 360})
    })
    this.scene.lookAt(sceneRotation)

    let basketRadius = 64 // Pre-computed from basket.geometry.boundingSphere.radius

    let orbitPosition = this.vectorFromSpherical({
      radius: basketRadius * Random.rand({min: 0.90, max: 1.20}),
      theta:  Random.rand({min: 50, max: 140}),
      phi: Random.rand({max: 360})
    })
    this.camera.position.copy(orbitPosition)

    let targetPosition = this.vectorFromSpherical({
      radius: basketRadius * Random.rand({max: 0.50}),
      theta:  Random.rand({max: 180}),
      phi: Random.rand({max: 360})
    })
    this.camera.lookAt(targetPosition)
  }

  load() {
    return this.loader.parse(basket)
      .then(this.layoutScene.bind(this))
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
    if (this.scene.children.length < 1) return

    let basket = this.scene.children[0]
    basket.material.opacity -= deltaTime

    let clone = this.scene.children[1]
    clone.material.opacity -= deltaTime
  }
}
