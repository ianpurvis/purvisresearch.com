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
  }

  layoutScene(gltf) {
    let colors = [
      new Color(0xff00ff),
      new Color(0xffff00)
    ].sort(Random.comparison)

    let basket = gltf.scene.children[0]
    basket.material.color = colors[0]
    basket.material.depthTest = false
    basket.material.opacity = Random.rand({min: 0.25, max: 0.95})
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
    clone.position.copy(this.sampleSphere(Random.sample([0, 1, 2, 4, 6, 8])))

    let objects = [basket, clone].sort(Random.comparison)
    this.scene.add(...objects)
    this.scene.rotateZ(Random.sample([0, 1, 2, 4, 6, 8]) * DEGREES_TO_RADIANS)

    let basketRadius = 64 // Pre-computed from basket.geometry.boundingSphere.radius
    let orbitRadius = basketRadius * Random.sample([1, 1.20])
    this.camera.position.copy(this.sampleSphere(orbitRadius))
    let targetRadius = basketRadius * Random.sample([0, 0.20, 0.40])
    this.camera.lookAt(this.sampleSphere(targetRadius))
  }

  load() {
    return this.loader.parse(basket)
      .then(this.layoutScene.bind(this))
      .catch((error) => {
        console.error(`An error happened ${error}`)
      })
  }


  sampleSphere(radius) {
    let thetas = Array.from({length: 5}, (_, index) => 45 + index * 18)
    let phis = Array.from({length: 18}, (_, index) => index * 20)
    let spherical = new Spherical(
      radius,
      Random.sample(thetas) * DEGREES_TO_RADIANS,
      Random.sample(phis) * DEGREES_TO_RADIANS,
    ).makeSafe()

    return new Vector3().setFromSpherical(spherical)
  }
}
