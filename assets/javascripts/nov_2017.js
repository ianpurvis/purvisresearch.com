import * as THREE from 'three'
import Random from '~/assets/javascripts/random.js'
import Demo from '~/assets/javascripts/demo.js'

export default class Nov2017Demo extends Demo {

  constructor(options) {
    super(options)
    this.alphabet = Array.from("abcdefghijklmnopqrstuvwxyz0123456789")
    this.particles = []
    this.camera.far = 10000
    this.camera.position.z = Random.rand({min: 100, max: 150})
  }

  load() {
    let self = this
    return super.load().then(new Promise((resolve, reject) => {
      // Add content
      let font = new THREE.Font(require("~/assets/fonts/Inconsolata_Regular.json"))

      self.alphabet.forEach(character => {
        let geometry = new THREE.TextBufferGeometry(character, {
          font: font
        })
        geometry.center()

        let material = new THREE.MeshNormalMaterial({
          depthFunc: THREE.LessDepth,
          opacity: 0.7,
          transparent: false,
          wireframe: true,
          wireframeLinewidth: 2.0,
        })

        let mesh = new THREE.Mesh(geometry, material)
        let radius = 60
        let acceleration = new THREE.Vector3(
          Random.rand({min: -radius, max: radius}),
          Random.rand({min: -radius, max: radius}),
          Random.rand({min: -radius, max: radius})
        )
        let scale = Random.rand({min: 0.25, max: 1})

        // Give each particle a jump start:
        mesh.position.copy(acceleration)

        mesh.rotation.set(
          Random.rand({max: 2 * Math.PI}),
          Random.rand({max: 2 * Math.PI}),
          Random.rand({max: 2 * Math.PI})
        )
        mesh.scale.setScalar(scale)

        let particle = new Particle({
          mesh: mesh,
          acceleration: acceleration,
          mass: scale
        })

        self.particles.push(particle)
        self.scene.add(mesh)
      })
    }))
  }

  update() {
    let deltaTime = this.clock.getDelta() * this.speedOfLife

    if (deltaTime == 0) return

    this.particles.forEach(p => p.update(deltaTime))
  }
}


class Particle {
  constructor({
    acceleration = new THREE.Vector3(0, 0, 0),
    mass = 1,
    mesh = null,
    velocity = new THREE.Vector3(0, 0, 0)
  }) {
    this.acceleration = acceleration
    this.mass = mass
    this.mesh = mesh
    this.velocity = velocity
  }

  get position() {
    return this.mesh.position
  }

  set position(p) {
    this.mesh.position = p
  }

  get rotation() {
    return this.mesh.rotation
  }

  set rotation(r) {
    this.mesh.rotation = r
  }

  toString() {
    return `m: ${this.mass}`
      + `\ta: ${this.acceleration.toArray()}`
      + `\tv: ${this.velocity.toArray()}`
      + `\tp: ${this.position.toArray()}`
      + `\tr: ${this.rotation.toArray()}`
  }


  update(deltaTime) {
    this.acceleration.multiplyScalar(1 / this.mass)
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime))
    this.velocity.add(this.acceleration.multiplyScalar(deltaTime))
    this.acceleration.setScalar(0)
  }
}
