import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'
import DRACOLoader from '~/assets/javascripts/DRACOLoader.js'
import ThreeDemo from '~/assets/javascripts/three_demo.js'
import Random from '~/assets/javascripts/random.js'

export default class Aug2018Demo extends ThreeDemo {

  load() {
    let self = this
    return super.load()
      .then(self.loadBasket)
      .then((basket) => {
          basket.material = self.randomMaterial({color: 0xff00ff})
          self.scene.add(basket)

          let clone = basket.clone()
          clone.material = self.randomMaterial({color: 0xffff00})
          clone.position.x += Random.rand({min: -10, max: 10})
          self.scene.add(clone)

          self.randomizePointOfView({subject: basket})
      })
  }


  loadBasket() {
    THREE.DRACOLoader.setDecoderPath('/javascripts/')
    THREE.DRACOLoader.setDecoderConfig({type: 'js'})
    let dracoLoader = new THREE.DRACOLoader()

    let loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
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
}
