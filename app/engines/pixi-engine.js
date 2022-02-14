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
    const resolution = Math.max(devicePixelRatio, 2)

    this.renderer = new Renderer({
      height: clientHeight,
      resolution,
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

  onUpdate() {
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
    const { clientHeight, clientWidth } = this.renderer.view
    this.renderer.resize(clientWidth, clientHeight)
  }

  update() {
    const deltaTime = this.clock.elapsedMS * this.speedOfLife
    this.elapsedTime += deltaTime
    this.onUpdate(deltaTime, this.elapsedTime)
    this.resize()
    this.render()
    this.animationFrame = window.requestAnimationFrame(this.onFrame)
  }

}

export { PixiEngine }
