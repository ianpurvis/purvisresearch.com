import { loadAmmo } from '~/shims/ammo.js'

class DollarPhysicsWorker {

  constructor(scope) {
    this.scope = scope
    this.scope.onmessage = this.onmessage.bind(this)
  }

  async load({ mass, vertices, triangles }) {
    await loadAmmo()
    const { World } =
      await import(/* webpackMode: "eager" */'~/models/dollar-physics/world.js')

    this.world = new World()
    this.world.loadBill({ mass, vertices, triangles })
    this.scope.postMessage({
      name: 'onload',
      args: {
        vertices,
        triangles
      }
    }, [
      vertices.buffer,
      triangles.buffer
    ])
  }

  onmessage({ data: { name, args }}) {
    this[name](args)
  }

  step({ deltaTime, vertices }) {
    this.world.update(deltaTime)
    this.world.bill.extractVertices(vertices)
    this.scope.postMessage({
      name: 'onstep',
      args: {
        vertices,
      }
    }, [
      vertices.buffer,
    ])
  }
}

new DollarPhysicsWorker(self)
