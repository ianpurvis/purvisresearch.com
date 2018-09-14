import * as THREE from 'three'
import Demo from '~/assets/javascripts/demo.js'

export default class ThreeDemo extends Demo {

  constructor(frame, pixelRatio = null) {
    super()

    // Initialize renderer:
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false
    })
    this.renderer.setSize(frame.width, frame.height)

    if (pixelRatio) {
      this.renderer.setPixelRatio(pixelRatio)
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
    console.debug(`PR: Resizing graphics to ${value.width}x${value.height}`)
    let oldValue = this.renderer.getSize()
    let oldTanFOV = Math.tan(((Math.PI/180) * this.camera.fov/2))

    this.camera.aspect = value.width / value.height
    this.camera.fov = (360/Math.PI) * Math.atan(oldTanFOV * (value.height/oldValue.height))
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(value.width, value.height)
    this.render()
  }

  dispose() {
    // Deallocates three memory:
    //    https://github.com/mrdoob/three.js/issues/5175
    //    https://stackoverflow.com/a/40178723
    this.scene.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return

      if (node.geometry) {
        node.geometry.dispose()
      }

      if (node.material) {
        if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
          node.material.materials.forEach((mtrl) => {
            if (mtrl.map)         mtrl.map.dispose()
            if (mtrl.lightMap)    mtrl.lightMap.dispose()
            if (mtrl.bumpMap)     mtrl.bumpMap.dispose()
            if (mtrl.normalMap)   mtrl.normalMap.dispose()
            if (mtrl.specularMap) mtrl.specularMap.dispose()
            if (mtrl.envMap)      mtrl.envMap.dispose()
            mtrl.dispose()    // disposes any programs associated with the material
          })
        }
        else {
          if (node.material.map)          node.material.map.dispose()
          if (node.material.lightMap)     node.material.lightMap.dispose()
          if (node.material.bumpMap)      node.material.bumpMap.dispose()
          if (node.material.normalMap)    node.material.normalMap.dispose()
          if (node.material.specularMap)  node.material.specularMap.dispose()
          if (node.material.envMap)       node.material.envMap.dispose()
          node.material.dispose()   // disposes any programs associated with the material
        }
      }
    })
    this.scene = null

    this.renderer.dispose()
    this.renderer = null
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
