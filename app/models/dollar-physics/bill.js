/* global Ammo */
const DISABLE_DEACTIVATION = 4
const CL_RS = 0x0002
const CL_SS = 0x0020
const CL_SELF = 0x0040

class Bill extends Ammo.btSoftBody {

  constructor({ mass, vertices, triangles, softBodyWorldInfo }) {
    super()

    const softBodyHelpers = new Ammo.btSoftBodyHelpers()
    const triangleCount = triangles.length / 3
    const body = softBodyHelpers.CreateFromTriMesh(
      softBodyWorldInfo,
      vertices,
      triangles,
      triangleCount,
      false
    )
    Object.assign(this, body)

    this.setTotalMass(mass)
    this.generateBendingConstraints(2)
    this.generateClusters(triangleCount / 6)
    this.setActivationState(DISABLE_DEACTIVATION)

    Object.assign(this.m_cfg, {
      collisions: CL_SS | CL_RS | CL_SELF,
      piterations: 1,  // position solver iterations
      viterations: 1,  // velocity solver iterations
      timescale: 0.1
    })

    Ammo.destroy(softBodyHelpers)
  }

  extractVertices(vertices) {
    for (
      let i = 0, j = 0, size = this.m_nodes.size(), node;
      i < size;
      i++, j += 3
    ) {
      node = this.m_nodes.at(i)
      vertices[j+0] = node.m_x.x()
      vertices[j+1] = node.m_x.y()
      vertices[j+2] = node.m_x.z()
    }
  }
}

export { Bill }
