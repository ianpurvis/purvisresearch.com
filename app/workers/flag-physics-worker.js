import _FlagPhysicsWorker from './flag-physics-worker.worker.js'

class FlagPhysicsWorker extends _FlagPhysicsWorker {

  constructor() {
    super()

    // Inheritance for workers seems broken...
    // As a workaround, assign instance functions and props directly:
    Object.assign(this, {
      isReady: false,
      load({ vertices, triangles }) {
        this.isReady = false
        this.postMessage({
          name: 'load',
          args: {
            vertices,
            triangles
          }
        }, [
          vertices.buffer,
          triangles.buffer
        ])
      },
      step({ deltaTime, vertices, normals }) {
        this.isReady = false
        this.postMessage({
          name: 'step',
          args: {
            deltaTime,
            vertices,
            normals
          }
        }, [
          vertices.buffer,
          normals.buffer
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

export { FlagPhysicsWorker }
