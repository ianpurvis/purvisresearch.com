import * as THREE from 'three'
import DracoDecoderModule from 'three/examples/js/libs/draco/gltf/draco_decoder.js'
import DRACOLoader from '~/assets/javascripts/DRACOLoader.js'
import GLTFLoader from 'three-gltf-loader'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'

export default class Aug2018Demo extends ThreeDemo {

  layoutScene(gltf) {
    let basket = gltf.scene.children[0]
    basket.material = this.randomMaterial({color: 0xff00ff})
    basket.geometry.center()
    this.scene.add(basket)

    let clone = basket.clone()
    clone.material = this.randomMaterial({color: 0xffff00})
    clone.position.x += Random.rand({min: -10, max: 10})
    this.scene.add(clone)

    this.camera.position.copy(this.randomPointOfView({subject: basket}))
    this.camera.lookAt(basket.position)
  }


  load() {
    return import('~/assets/models/basket.draco.glb')
      .then(module => module.default)
      .then(this.parseGLTF.bind(this))
      .then(this.layoutScene.bind(this))
      .catch((error) => {
        console.error(`An error happened ${error}`)
      })
  }


  loadDracoDecoder() {
    return new Promise((resolve) => {
      let config = {
        onModuleLoaded: (decoder) => {
          // Module is Promise-like. Wrap before resolving to avoid loop.
          resolve({decoder: decoder})
        }
      }
      DracoDecoderModule(config)
    })
  }


  parseGLTF(buffer) {
    THREE.DRACOLoader.decoderModulePromise = this.loadDracoDecoder()
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader()
      loader.setDRACOLoader(new THREE.DRACOLoader())
      loader.parse(buffer, '/', resolve, reject)
    })
  }


  randomMaterial({color}) {
    let options = {
      color: color,
      opacity: Random.rand({min: 0.25, max: 0.95}),
      transparent: true,
      wireframe: true,
    }
    let Material = Random.sample([
      THREE.MeshBasicMaterial,
      THREE.LineBasicMaterial
    ])
    return new Material(options)
  }


  randomPointOfView({subject}) {
    if (!subject.geometry.boundingSphere) {
      subject.geometry.computeBoundingSphere()
    }
    let sphere = new THREE.Spherical(
      subject.geometry.boundingSphere.radius + Random.rand({max: 10}),
      Random.rand({min: -360, max: 360}),
      Random.rand({min: -360, max: 360})
    )
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
