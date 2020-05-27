import _ExploderPhysicsWorker from '~/workers/exploder-physics-worker.worker.js'

class ExploderPhysicsWorker extends _ExploderPhysicsWorker {

  constructor() {
    super()

    // Prototype inheritance from _PhysicsWorker is broken
    // As a workaround, assign instance functions and props directly:
    Object.assign(this, {
      isReady: false,
      load() {
        this.postMessage({ name: 'load' })
      },
      step(deltaTime, positions, normals) {
        this.isReady = false
        this.postMessage({
          name: 'step',
          args: {
            deltaTime,
            positions,
            normals
          }
        },[
          positions.buffer,
          normals.buffer,
        ])
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

export { ExploderPhysicsWorker }
