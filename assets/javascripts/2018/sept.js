import * as THREE from 'three'
import 'imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js'
import ModelLoader from '~/assets/javascripts/model_loader.js'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'
import * as basket from '~/assets/models/basket.draco.glb'

const DEGREES_TO_RADIANS = (Math.PI / 180)

export default class Aug2018Demo extends ThreeDemo {

  constructor(frame, pixelRatio) {
    super(frame, pixelRatio)
    this.loader = new ModelLoader()
    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.04
    this.controls.enablePan = false
    this.controls.enableZoom = false
    this.controls.rotateSpeed = 0.06
  }

  layoutScene(gltf) {
    let colors = [
      new THREE.Color(0xff00ff),
      new THREE.Color(0xffff00)
    ].sort(Random.comparison)

    let basket = gltf.scene.children[0]
    basket.material.color = colors[0]
    basket.material.depthTest = false
    basket.material.opacity = Random.rand({min: 0.25, max: 0.95})
    basket.material.transparent = true
    basket.material.needsUpdate = true
    basket.geometry.center()

    let wireframe = new THREE.WireframeGeometry(basket.geometry)
    let clone = new THREE.LineSegments(wireframe)
    clone.rotation.copy(basket.rotation)
    clone.material.color = colors[1]
    clone.material.depthTest = false
    clone.material.opacity = Random.rand({min: 0.25, max: 0.95})
    clone.material.side = THREE.DoubleSide
    clone.material.transparent = true
    clone.material.needsUpdate = true
    clone.position.x += Random.sample([0, 1, 2, 4, 6, 8]) * Random.sample([-1, 1])

    let objects = [basket, clone].sort(Random.comparison)
    this.scene.add(...objects)

    basket.geometry.computeBoundingSphere()
    let basketRadius = basket.geometry.boundingSphere.radius
    let orbitRadius = basketRadius * Random.sample([1, 1.20])
    this.camera.position.copy(this.sampleSphere(orbitRadius))
    let targetRadius = basketRadius * Random.sample([0, 0.20, 0.40])
    this.controls.target = this.sampleSphere(targetRadius)
  }

  dispose() {
    this.controls.dispose()
    super.dispose()
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
    let spherical = new THREE.Spherical(
      radius,
      Random.sample(thetas) * DEGREES_TO_RADIANS,
      Random.sample(phis) * DEGREES_TO_RADIANS,
    ).makeSafe()

    return new THREE.Vector3().setFromSpherical(spherical)
  }


  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife
    if (deltaTime == 0) return

    this.controls.update()

    if (this.scene.children.length < 1) return
    let basket = this.scene.children[0]
    basket.rotateX(0.002 * deltaTime)
    let clone = this.scene.children[1]
    clone.rotateX(-0.002 * deltaTime)
  }
}
