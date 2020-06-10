import { loadAmmo } from '~/shims/ammo.js'

class FlagPhysicsWorker {

  constructor(scope) {
    this.scope = scope
    this.scope.onmessage = this.onmessage.bind(this)
  }

  async load() {
    await loadAmmo()
    this.scope.postMessage({ name: 'onload' })
  }

  onmessage({ data: { name, args }}) {
    this[name](args)
  }

  step({ deltaTime }) {
    console.log(`Stepped: ${ deltaTime }`)
    this.scope.postMessage({ name: 'onstep' })
  }
}

new FlagPhysicsWorker(self)
