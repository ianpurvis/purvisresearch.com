/* global Ammo */
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

class Wind {

  constructor() {
    this.bodies = []
    this.elapsedTime = 0
    this.maxVelocity = new Ammo.btVector3(1, 1, 1)
    this.minVelocity = new Ammo.btVector3(-1, -1, -1)
    this.noiseMaker = new SimplexNoise()
    this.timeScale = 1
    this.velocity = new Ammo.btVector3()

    // Recycled by hitFace:
    this._force = new Ammo.btVector3()
  }

  destroy() {
    Ammo.destroy(this.maxVelocity)
    Ammo.destroy(this.minVelocity)
    Ammo.destroy(this.velocity)
    Ammo.destroy(this._force)
  }

  // Hit face with a cheap wind force
  //  F = normal * area * orthogonal velocity
  hitFace(face, velocity) {
    const { _force } = this
    _force.op_mul(0)
    _force.op_add(face.m_normal)
    _force.op_div(_force.length() || 1) // safe normalize
    _force.op_mul(face.m_ra)
    _force.op_mul(_force.dot(velocity)) // orthogonality
    _force.op_div(3)
    face.get_m_n(0).m_f.op_add(_force)
    face.get_m_n(1).m_f.op_add(_force)
    face.get_m_n(2).m_f.op_add(_force)
  }

  hitSoftBody(body, velocity) {
    for (let i = 0, size = body.m_faces.size(); i < size; i++) {
      this.hitFace(body.m_faces.at(i), velocity)
    }
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime * this.timeScale

    for (let i = 0, max, min, v; i < 3; i++) {
      max = this.maxVelocity.get_m_floats(i)
      min = this.minVelocity.get_m_floats(i)
      v = this.noiseMaker.noise(i, this.elapsedTime)
      v = v * (max - min) / 2 + (max + min) / 2
      this.velocity.set_m_floats(i, v)
    }

    for (let body of this.bodies) {
      this.hitSoftBody(body, this.velocity)
    }
  }
}

export { Wind }
