import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'

export class Demo {

  constructor(frame, pixelRatio = null) {
    // Initialize renderer:
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false
    })

    if (pixelRatio) {
      this.renderer.setPixelRatio(devicePixelRatio)
    }

    // Initialize scene and camera:
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60)
    this.camera.position.z = 100
    this.camera.lookAt(this.scene.position)

    this.clock = new THREE.Clock()
    this.speedOfLife = 0.4 // Slow motion
    this.frame = frame
  }

  get element() {
    return this.renderer.domElement
  }

  set frame(value) {
    this._frame = value

    let {width, height} = value
    console.debug(`PR: Resizing graphics to ${width}x${height}`)
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }


  load() {
    console.debug("PR: Loading graphics...")

    let self = this
    return new Promise((resolve, reject) => {
      new GLTFLoader().load(
        '/models/basket/asset.gltf',
        (gltf) => {
          self.scene.add(gltf.scene)
          resolve(self)
        },
        (xhr) => {
          console.log(`${xhr.loaded / xhr.total * 100}% loaded`)
        },
        (exception) => {
          console.log(`An error happened ${exception}`)
          reject()
        }
      )
    })
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife

    if (deltaTime == 0) return

    // Update all objects
  }
}
