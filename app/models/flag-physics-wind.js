/* global Ammo */
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

class FlagPhysicsWind {

  constructor() {
    this.force = new Ammo.btVector3()
    this.noiseMaker = new SimplexNoise()
    this.velocity = new Ammo.btVector3()
  }

  destroy() {
    Ammo.destroy(this.force)
    Ammo.destroy(this.velocity)
  }

  applyToSoftBody(body) {
    for (let i = 0, size = body.m_nodes.size(), vertex, noise; i < size; i++) {
      this.force.setValue(
        this.velocity.x(),
        this.velocity.y(),
        this.velocity.z()
      )
      vertex = body.m_nodes.at(i).m_x
      noise = this.noiseMaker.noise3d(
        vertex.x(),
        vertex.y(),
        this.deltaTime
      )
      this.force.op_mul(noise)
      body.addForce(this.force, i)
    }
  }

  update(deltaTime) {
    this.deltaTime = deltaTime
  }
}

export { FlagPhysicsWind }
