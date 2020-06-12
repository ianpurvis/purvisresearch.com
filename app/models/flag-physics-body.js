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

  serialize({ vertices, normals }) {
    for (
      let i = 0, j = 0, size = this.m_nodes.size(), node;
      i < size;
      i++, j += 3
    ) {
      node = this.m_nodes.at(i)
      vertices[j+0] = node.m_x.x()
      vertices[j+1] = node.m_x.y()
      vertices[j+2] = node.m_x.z()
      normals[j+0] = node.m_n.x()
      normals[j+1] = node.m_n.y()
      normals[j+2] = node.m_n.z()
    }
  }
}

export { FlagPhysicsBody }
