import { loadAmmo } from '~/shims/ammo.js'

class FlagPhysicsWorker {

  constructor(scope) {
    this.scope = scope
    this.scope.onmessage = this.onmessage.bind(this)
  }

  async load({ vertices, triangles }) {
    await loadAmmo()
    const { FlagPhysicsWorld } =
      await import(/* webpackMode: "eager" */'~/models/flag-physics-world.js')

    this.world = new FlagPhysicsWorld()
    this.world.loadFlag({ vertices, triangles })
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
    this.world.saveFlag({ vertices })
    this.scope.postMessage({
      name: 'onstep',
      args: {
        vertices
      }
    }, [
      vertices.buffer
    ])
  }
}

new FlagPhysicsWorker(self)
