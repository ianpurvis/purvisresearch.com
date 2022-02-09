import { Container, Renderer } from '../shims/pixi.js'

class PixiEngine {

  constructor(canvas) {
    const {
      clientHeight,
      clientWidth,
      ownerDocument: {
        defaultView: {
          devicePixelRatio
        }
      }
    } = canvas

    this.renderer = new Renderer({
      height: clientHeight,
      resolution: devicePixelRatio,
      transparent: true,
      view: canvas,
      width: clientWidth,
    })
    this.stage = new Container()
    this.canvas = canvas
    this.deltaTime = 0
    this.elapsedTime = 0
    this.time = 0
    this.paused = true
  }

  dispose() {
    this.pause()
    this.stage.destroy(true)
    this.renderer.destroy()
  }

  pause() {
    this.paused = true
  }

  async play() {
    this.paused = false
    this.time = performance.now()
    for (let now = this.time; !this.paused; now = await this.tick()) {
      this.deltaTime = now - this.time
      this.elapsedTime += this.deltaTime
      this.time = now
      this.update()
    }
  }

  render() {
    this.renderer.render(this.stage)
  }

  resize() {
    const { height, width } = this.renderer
    const { clientHeight, clientWidth } = this.canvas
    if (clientHeight != height || clientWidth != width) {
      this.renderer.resize(clientWidth, clientHeight)
    }
  }

  get scene() {
    return this._scene
  }

  set scene(scene) {
    this.stage.removeChildren()
    this.stage.addChild(scene)
    this._scene = scene
  }

  async tick() {
    return new Promise(this.canvas.ownerDocument.defaultView.requestAnimationFrame)
  }

  update() {
    this._scene.update(this.deltaTime, this.elapsedTime)
    this.resize()
    this.render()
  }
}

export { PixiEngine }
