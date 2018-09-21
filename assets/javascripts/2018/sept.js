import * as THREE from 'three'
import ModelLoader from '~/assets/javascripts/model_loader.js'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'
import * as basket from '~/assets/models/basket.draco.glb'

const DEGREES_TO_RADIANS = (Math.PI / 180)

export default class Aug2018Demo extends ThreeDemo {

  constructor(frame, pixelRatio) {
    super(frame, pixelRatio)
    this.loader = new ModelLoader()
  }

  layoutScene(gltf) {
    let colors = [
      new THREE.Color(0xff00ff),
      new THREE.Color(0xffff00)
    ].sort(Random.comparison)

    let basket = gltf.scene.children[0]
    basket.material.color = colors[0]
    basket.material.depthTest = Random.sample([true, false])
    basket.material.opacity = Random.rand({min: 0.25, max: 0.95})
    basket.material.transparent = true
    basket.material.needsUpdate = true
    basket.geometry.center()

    let wireframe = new THREE.WireframeGeometry(basket.geometry)
    let clone = new THREE.LineSegments(wireframe)
    clone.rotation.copy(basket.rotation)
    clone.material.color = colors[1]
    clone.material.depthTest = Random.sample([true, false])
    clone.material.opacity = Random.rand({min: 0.25, max: 0.95})
    clone.material.transparent = true
    clone.material.needsUpdate = true
    clone.position.x += Random.sample([0, 1, 2, 4, 6, 8]) * Random.sample([-1, 1])

    let objects = [basket, clone].sort(Random.comparison)
    this.scene.add(...objects)

    this.camera.position.copy(this.randomPointOfView({subject: basket}))
    this.camera.lookAt(basket.position)
  }


  load() {
    return this.loader.parse(basket)
      .then(this.layoutScene.bind(this))
      .catch((error) => {
        console.error(`An error happened ${error}`)
      })
  }


  randomPointOfView({subject}) {
    if (!subject.geometry.boundingSphere) {
      subject.geometry.computeBoundingSphere()
    }
    let thetas = Array.from({length: 7}, (_, index) => 10 + index * 20)
    let phis = Array.from({length: 18}, (_, index) => index * 20)
    let sphere = new THREE.Spherical(
      subject.geometry.boundingSphere.radius + Random.rand({max: 10}),
      Random.sample(thetas) * DEGREES_TO_RADIANS,
      Random.sample(phis) * DEGREES_TO_RADIANS,
    ).makeSafe()
    let position = new THREE.Vector3()
    position.setFromSpherical(sphere)
    return position
  }


  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife

    if (deltaTime == 0) return
    if (this.scene.children.length < 1) return

    this.scene.rotateZ(0.004 * deltaTime)

    let basket = this.scene.children[0]
    let clone = this.scene.children[1]

    basket.rotateX(0.002 * deltaTime)
    clone.rotateX(-0.002 * deltaTime)
  }
}
