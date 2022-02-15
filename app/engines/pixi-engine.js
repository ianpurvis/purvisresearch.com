import { Container, Renderer, Ticker } from '../shims/pixi.js'

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
    this.clock = new Ticker()
    this.stage = new Container()
    this.elapsedTime = 0
    this.speedOfLife = 1.0
    this.canvas = canvas
    this.onFrame = () => this.update()
  }

  dispose() {
    this.pause()
    this.stage.destroy(true)
    this.clock.destroy()
    this.renderer.destroy()
  }

  pause() {
    window.cancelAnimationFrame(this.animationFrame)
    this.clock.stop()
  }

  play() {
    this.clock.start()
    this.update()
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

  update() {
    const deltaTime = this.clock.elapsedMS * this.speedOfLife
    this.elapsedTime += deltaTime
    this._scene.update(deltaTime, this.elapsedTime)
    this.resize()
    this.render()
    this.animationFrame = window.requestAnimationFrame(this.onFrame)
  }

}

export { PixiEngine }
