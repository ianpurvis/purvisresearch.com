/* global Ammo */
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

const ONE_THIRD = 1/3

class Wind {

  constructor() {
    this.bodies = []
    this.elapsedTime = 0
    this.maxVelocity = new Ammo.btVector3(1, 1, 1)
    this.minVelocity = new Ammo.btVector3(-1, -1, -1)
    this.noiseMaker = new SimplexNoise()
    this.timeScale = 1
    this.velocity = new Ammo.btVector3()

    // Private recyclables:
    this._force = new Ammo.btVector3()
  }

  destroy() {
    Ammo.destroy(this.maxVelocity)
    Ammo.destroy(this.minVelocity)
    Ammo.destroy(this.velocity)
    Ammo.destroy(this._force)
  }

  applyToSoftBody(body) {
    for (let i = 0, size = body.m_faces.size(), face, j, node; i < size; i++) {
      face = body.m_faces.at(i)

      // Calculate basic force
      this._force.setValue(
        face.m_normal.x(),
        face.m_normal.y(),
        face.m_normal.z()
      )
      this._force.op_mul(1 / (this._force.length() || 1)) // safe normalize
      this._force.op_mul(this._force.dot(this.velocity))

      // Distribute force among face vertices
      this._force.op_mul(ONE_THIRD)
      for (j = 0; j < 3; j++) {
        node = face.get_m_n(j)
        if (node.m_im > 0)
          node.m_f.op_add(this._force)
      }
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
      this.applyToSoftBody(body)
    }
  }
}

export { Wind }
