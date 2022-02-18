import { Scene, WebGLRenderer } from 'three'

function safeDispose(object) {
  if (object != null && typeof object.dispose === 'function') {
    object.dispose()
  }
}

class ThreeEngine {

  constructor(canvas, { maxFPS = 0 } = {}) {
    const {
      clientHeight,
      clientWidth,
      ownerDocument: {
        defaultView: {
          devicePixelRatio
        }
      }
    } = canvas

    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas
    })
    this.renderer.setSize(clientWidth, clientHeight, false)
    this.renderer.setPixelRatio(devicePixelRatio)
    this.scene = new Scene()
    this.canvas = canvas
    this.deltaTime = 0
    this.elapsedTime = 0
    this.time = 0
    this.maxFPS = maxFPS
    this.paused = true
  }

  dispose() {
    this.pause()
    this.scene.traverse(node => {
      if (node == this.scene) return
      [].concat(node.material).forEach(material => {
        if (material == null) return
        Object.values(material).forEach(safeDispose)
        safeDispose(material)
      })
      safeDispose(node.geometry)
      safeDispose(node)
    })
    const renderTarget = this.renderer.getRenderTarget()
    safeDispose(renderTarget)
    safeDispose(this.renderer)
  }

  pause() {
    this.paused = true
  }

  async play() {
    const minMSPF = this.maxFPS == 0 ? 0 : 1000 / this.maxFPS
    this.paused = false
    this.time = performance.now()
    for (let now = this.time; !this.paused; now = await this.tick()) {
      this.deltaTime = now - this.time
      if (this.deltaTime >= minMSPF) {
        this.elapsedTime += this.deltaTime
        this.time = now
        this.update()
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.scene.camera)
  }

  resize() {
    const { _height, _width } = this.renderer
    const { clientHeight, clientWidth } = this.canvas
    if (clientHeight != _height || clientWidth != _width) {
      this.renderer.setSize(clientWidth, clientHeight, false)
      this.scene.resize(clientWidth, clientHeight)
    }
  }

  async tick() {
    return new Promise(this.canvas.ownerDocument.defaultView.requestAnimationFrame)
  }

  update() {
    this.scene.update(this.deltaTime, this.elapsedTime)
    this.resize()
    this.render()
  }
}

export { ThreeEngine }
