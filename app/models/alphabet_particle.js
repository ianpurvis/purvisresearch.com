import { Vector3 } from 'three'

export default class AlphabetParticle {
  constructor({
    acceleration = new Vector3(0, 0, 0),
    mass = 1,
    mesh = null,
    velocity = new Vector3(0, 0, 0)
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
