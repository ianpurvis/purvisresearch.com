import { Mesh, Vector3 } from 'three'

class Particle extends Mesh {

  constructor(geometry, material) {
    super(geometry, material)
    this.acceleration = new Vector3()
    this.mass = 1
    this.velocity = new Vector3()
    this._aux = new Vector3()
  }

  toString() {
    return `m: ${this.mass}`
      + `\ta: ${this.acceleration.toArray()}`
      + `\tv: ${this.velocity.toArray()}`
      + `\tp: ${this.position.toArray()}`
      + `\tr: ${this.rotation.toArray()}`
  }

  applyForce(force) {
    this._aux.copy(force).multiplyScalar(1 / this.mass)
    this.acceleration.add(this._aux)
  }

  update(deltaTime) {
    this._aux.copy(this.acceleration).multiplyScalar(deltaTime)
    this.velocity.add(this._aux)
    this._aux.copy(this.velocity).multiplyScalar(deltaTime)
    this.position.add(this._aux)
    if (deltaTime > 0)
      this.acceleration.setScalar(0)
  }
}

export { Particle }
