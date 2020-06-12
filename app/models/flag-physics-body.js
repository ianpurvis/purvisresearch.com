/* global Ammo */
const DISABLE_DEACTIVATION = 4

class FlagPhysicsBody extends Ammo.btSoftBody {

  constructor({ mass = 1.0, vertices, triangles, softBodyWorldInfo }) {
    super()

    const softBodyHelpers = new Ammo.btSoftBodyHelpers()
    const body = softBodyHelpers.CreateFromTriMesh(
      softBodyWorldInfo,
      vertices,
      triangles,
      triangles.length / 3,
      false
    )
    Object.assign(this, body)

    // Scale must come before transform:
    this.setTotalMass(mass)
    this.generateBendingConstraints(2)
    this.setActivationState(DISABLE_DEACTIVATION)

    Object.assign(this.m_cfg, {
      piterations: 1,  // position solver iterations
      viterations: 1,  // velocity solver iterations
      timescale: 0.1
    })

    Ammo.destroy(softBodyHelpers)
  }

  serialize({ vertices }) {
    for (
      let i = 0, j = 0, size = this.m_nodes.size(), vertex;
      i < size;
      i++, j += 3
    ) {
      vertex = this.m_nodes.at(i).m_x
      vertices[j+0] = vertex.x()
      vertices[j+1] = vertex.y()
      vertices[j+2] = vertex.z()
    }
  }
}

export { FlagPhysicsBody }
