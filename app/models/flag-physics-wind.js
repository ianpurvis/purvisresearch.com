/* global Ammo */
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js'

const ONE_THIRD = 1/3

class FlagPhysicsWind {

  constructor() {
    this.deltaTime = 0
    this.noiseMaker = new SimplexNoise()
    this.velocity = new Ammo.btVector3()

    // For applyToSoftBody:
    this.centroid = new Ammo.btVector3()
    this.force = new Ammo.btVector3()
  }

  destroy() {
    Ammo.destroy(this.centroid)
    Ammo.destroy(this.force)
    Ammo.destroy(this.velocity)
  }

  applyToSoftBody(body) {
    for (
      let i = 0, size = body.m_faces.size(), face, j, node, noise;
      i < size;
      i++
    ) {
      face = body.m_faces.at(i)

      // Calculate basic force
      this.force.setValue(
        face.get_m_normal().x(),
        face.get_m_normal().y(),
        face.get_m_normal().z()
      )
      this.force.op_mul(1 / (this.force.length() || 1)) // safe normalize
      this.force.op_mul(face.get_m_normal().dot(this.velocity))

      // Find centroid of face
      this.centroid.setValue(0, 0, 0)
      for (j = 0; j < 3; j++) {
        node = face.get_m_n(j)
        this.centroid.op_add(node.get_m_x())
      }
      this.centroid.op_mul(ONE_THIRD)

      // Introduce noise according to centroid position in x/y field
      noise = this.noiseMaker.noise3d(
        this.centroid.x(),
        this.centroid.y(),
        this.deltaTime
      )
      this.force.op_mul(noise)

      // Distribute force among face vertices
      this.force.op_mul(ONE_THIRD)
      for (j = 0; j < 3; j++) {
        node = face.get_m_n(j)
        if (node.get_m_im() > 0)
          node.get_m_f().op_add(this.force)
      }
    }
  }

  update(deltaTime) {
    this.deltaTime = deltaTime
  }
}

export { FlagPhysicsWind }
