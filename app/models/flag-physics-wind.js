/* global Ammo */
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

class FlagPhysicsWind {

  constructor() {
    this.deltaTime = 0
    this.force = new Ammo.btVector3()
    this.noiseMaker = new SimplexNoise()
    this.velocity = new Ammo.btVector3()
  }

  destroy() {
    Ammo.destroy(this.force)
    Ammo.destroy(this.velocity)
  }

  applyToSoftBody(body) {
    for (
      let i = 0, size = body.m_nodes.size(), node, noise, impact;
      i < size;
      i++
    ) {
      node = body.m_nodes.at(i)

      this.force.setValue(
        this.velocity.x(),
        this.velocity.y(),
        this.velocity.z()
      )

      noise = this.noiseMaker.noise3d(
        node.m_x.x(),
        node.m_x.y(),
        this.deltaTime
      )
      this.force.op_mul(noise)

      impact = Math.abs(this.force.dot(node.m_n))
      this.force.op_mul(impact)

      body.addForce(this.force, i)
    }
  }

  update(deltaTime) {
    this.deltaTime = deltaTime
  }
}

export { FlagPhysicsWind }
