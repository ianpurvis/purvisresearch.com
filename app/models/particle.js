import { Mesh, Vector3 } from 'three'

class Particle extends Mesh {

  constructor(geometry, material) {
    super(geometry, material)
    this.acceleration = new Vector3(0, 0, 0)
    this.mass = 1
    this.velocity = new Vector3(0, 0, 0)
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

export { Particle }
