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
    let basket = gltf.scene.children[0]
    basket.material = this.randomMaterial({color: 0xff00ff})
    basket.geometry.center()
    this.scene.add(basket)

    let clone = basket.clone()
    while (clone.material.type == basket.material.type) {
      clone.material = this.randomMaterial({color: 0xffff00})
    }
    clone.position.x += Random.sample([0, 1, 2, 4, 6, 8]) * Random.sample([-1, 1])
    this.scene.add(clone)

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


  randomMaterial({color}) {
    let Material = Random.sample([
      THREE.MeshBasicMaterial,
      THREE.LineBasicMaterial
    ])
    let options = {
      color: color,
      opacity: Random.rand({min: 0.25, max: 0.95}),
      transparent: true
    }
    if (Material == THREE.MeshBasicMaterial) {
      options.wireframe = true
    }
    return new Material(options)
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
