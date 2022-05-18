import { expose, transfer } from 'comlink'
import { World } from '../models/dollar-physics/world.js'
import { loadAmmo } from '../shims/ammo.js'

class DollarPhysicsWorker {

  async load({ mass, vertices, triangles }) {
    await loadAmmo()
    this.world = new World()
    this.world.loadBill({ mass, vertices, triangles })

    return transfer({
      triangles,
      vertices
    }, [
      vertices.buffer,
      triangles.buffer
    ])
  }

  step({ deltaTime, vertices }) {
    this.world.update(deltaTime)
    this.world.render(vertices)
    return transfer(vertices, [ vertices.buffer ])
  }
}

expose(new DollarPhysicsWorker())
