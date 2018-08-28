if (process.browser) {
  const PIXI = require('pixi.js')
}
import Demo from '~/assets/javascripts/demo.js'

export default class PixiDemo extends Demo {

  constructor(frame) {
    super()

    this.app = new PIXI.Application({
      transparent: true,
      width: frame.width,
      height: frame.height
    })

    this.elapsedTime = 0
    this.speedOfLife = 0.4 // Slow motion
    this.frame = frame

    this.app.ticker.start()
  }

  get element() {
    return this.app.view
  }

  get frame() {
    return {
      width: this.app.renderer.width,
      height: this.app.renderer.height
    }
  }

  set frame(value) {
    console.debug(`PR: Resizing graphics to ${value.width}x${value.height}`)
    this.app.view.style.width = `${value.width}px`
    this.app.view.style.height = `${value.height}px`
    this.app.renderer.resize(value.width, value.height)
  }

  render() {
    this.app.renderer.render(this.app.stage)
  }
}
