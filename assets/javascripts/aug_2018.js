import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'
import ThreeDemo from '~/assets/javascripts/three_demo.js'

export default class Aug2018Demo extends ThreeDemo {

  load() {
    let self = this
    return super.load().then(new Promise((resolve, reject) => {
      new GLTFLoader().load(
        '/models/basket/asset.gltf',
        (gltf) => {
          let basket = gltf.scene.children[0]
          basket.geometry.computeFaceNormals()
          basket.geometry.computeVertexNormals()
          //basket.material = new THREE.MeshNormalMaterial({
            //wireframe: true,
          //})
          basket.material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
          })

          self.scene.add(basket)

          // If using basket texture, supply light:
          //let light = new THREE.AmbientLight(0xffffff)
          //this.scene.add(light)

          resolve(self)
        },
        (xhr) => {
          console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
        },
        (exception) => {
          console.error(`An error happened ${exception}`)
          reject(exception)
        }
      )
    }))
  }
}
