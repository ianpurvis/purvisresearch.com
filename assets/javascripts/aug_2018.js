import * as THREE from 'three'
import DracoDecoderModule from 'three/examples/js/libs/draco/gltf/draco_decoder.js'
import DRACOLoader from '~/assets/javascripts/DRACOLoader.js'
import GLTFLoader from 'three-gltf-loader'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'

export default class Aug2018Demo extends ThreeDemo {

  layoutScene(basket) {
    basket.material = this.randomMaterial({color: 0xff00ff})
    this.scene.add(basket)

    let clone = basket.clone()
    clone.material = this.randomMaterial({color: 0xffff00})
    clone.position.x += Random.rand({min: -10, max: 10})
    this.scene.add(clone)

    this.randomizePointOfView({subject: basket})
  }

  load() {
    return super.load()
      .then(this.loadBasket.bind(this))
      .then(this.layoutScene.bind(this))
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

  loadBasket() {
    THREE.DRACOLoader.decoderModulePromise = this.loadDracoDecoder()
    let loader = new GLTFLoader()
    loader.setDRACOLoader(new THREE.DRACOLoader())
    return new Promise((resolve, reject) => {
      loader.load(
        '/models/basket.draco.glb',
        (gltf) => {
          let basket = gltf.scene.children[0]
          basket.geometry.center()
          resolve(basket)
        },
        (xhr) => {
          console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
        },
        (exception) => {
          console.error(`An error happened ${exception}`)
          reject(exception)
        }
      )
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


  randomizePointOfView({subject}) {
    if (!subject.geometry.boundingSphere) {
      subject.geometry.computeBoundingSphere()
    }
    let sphere = new THREE.Spherical(
      subject.geometry.boundingSphere.radius + Random.rand({max: 10}),
      Random.rand({min: -360, max: 360}),
      Random.rand({min: -360, max: 360})
    )
    this.camera.position.setFromSpherical(sphere)
    this.camera.lookAt(subject.position)
  }


  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife

    if (deltaTime == 0) return

    this.scene.rotateZ(.05 * deltaTime)

    let basket = this.scene.children[0]
    let clone = this.scene.children[1]

    basket.rotateX(.001 * deltaTime)
    clone.rotateX(-.001 * deltaTime)
  }
}
