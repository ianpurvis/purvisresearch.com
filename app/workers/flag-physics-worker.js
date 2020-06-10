import _FlagPhysicsWorker from './flag-physics-worker.worker.js'

class FlagPhysicsWorker extends _FlagPhysicsWorker {

  constructor() {
    super()

    // Inheritance for workers seems broken...
    // As a workaround, assign instance functions and props directly:
    Object.assign(this, {
      isReady: false,
      load() {
        this.isReady = false
        this.postMessage({ name: 'load' })
      },
      step(deltaTime) {
        this.isReady = false
        this.postMessage({ name: 'step', args: { deltaTime } })
      },
      onload() {},
      onmessage({ data: { name, args }}) {
        this[name](args)
        this.isReady = true
      },
      onstep() {}
    })
  }
}

export { FlagPhysicsWorker }
