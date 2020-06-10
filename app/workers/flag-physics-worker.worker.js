import { loadAmmo } from '~/shims/ammo.js'

class FlagPhysicsWorker {

  constructor(scope) {
    this.scope = scope
    this.scope.onmessage = this.onmessage.bind(this)
    this.flagBody = {}
  }

  async load(flagBody) {
    await loadAmmo()
    const { FlagPhysicsWorld } = await import(
      /* webpackMode: "eager" */
      '~/models/flag-physics-world.js'
    )
    this.world = new FlagPhysicsWorld()
    this.world.loadFlagBody(flagBody)
    this.flagBody = flagBody
    this.scope.postMessage({ name: 'onload' })
  }

  onmessage({ data: { name, args }}) {
    this[name](args)
  }

  step({ deltaTime }) {
    this.world.update(deltaTime)
    this.world.serialize(this.flagBody)
    this.scope.postMessage({ name: 'onstep', args: this.flagBody })
  }
}

new FlagPhysicsWorker(self)
