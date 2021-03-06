import _DollarPhysicsWorker from './dollar-physics-worker.worker.js'

class DollarPhysicsWorker extends _DollarPhysicsWorker {

  constructor() {
    super()

    // Inheritance for workers seems broken...
    // As a workaround, assign instance functions and props directly:
    Object.assign(this, {
      isReady: false,
      load({ mass, vertices, triangles }) {
        this.isReady = false
        this.postMessage({
          name: 'load',
          args: {
            mass,
            vertices,
            triangles
          }
        }, [
          vertices.buffer,
          triangles.buffer
        ])
      },
      step({ deltaTime, vertices }) {
        this.isReady = false
        this.postMessage({
          name: 'step',
          args: {
            deltaTime,
            vertices,
          }
        }, [
          vertices.buffer,
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

export { DollarPhysicsWorker }
