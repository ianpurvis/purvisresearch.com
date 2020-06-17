import { loadAmmo } from '~/shims/ammo.js'

class FlagPhysicsWorker {

  constructor(scope) {
    this.scope = scope
    this.scope.onmessage = this.onmessage.bind(this)
  }

  async load({ mass, vertices, triangles }) {
    await loadAmmo()
    const { FlagPhysicsWorld } =
      await import(/* webpackMode: "eager" */'~/models/flag-physics-world.js')

    this.world = new FlagPhysicsWorld()
    this.world.loadFlag({ mass, vertices, triangles })
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

  step({ deltaTime, vertices, normals }) {
    this.world.update(deltaTime)
    this.world.saveFlag({ vertices, normals })
    this.scope.postMessage({
      name: 'onstep',
      args: {
        vertices,
        normals
      }
    }, [
      vertices.buffer,
      normals.buffer
    ])
  }
}

new FlagPhysicsWorker(self)
