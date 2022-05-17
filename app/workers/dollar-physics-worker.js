import { expose, transfer } from 'comlink'
import { loadAmmo } from '../shims/ammo.js'

class DollarPhysicsWorker {

  async load({ mass, vertices, triangles }) {
    await loadAmmo()
    const { World } =
      await import(/* webpackMode: "eager" */'~/models/dollar-physics/world.js')

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
    this.world.bill.extractVertices(vertices)
    return transfer(vertices, [ vertices.buffer ])
  }
}

expose(new DollarPhysicsWorker())
