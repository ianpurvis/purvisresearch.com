import Demo from '~/assets/javascripts/demo.js'

export default class PixiDemo extends Demo {

  constructor(frame) {
    super()
    this.elapsedTime = 0
    this.speedOfLife = 0.4 // Slow motion
    this._frame = frame
  }

  get element() {
    return this.app ? this.app.view : null
  }

  get frame() {
    return this._frame
  }

  set frame(value) {
    console.debug(`PR: Resizing graphics to ${value.width}x${value.height}`)
    this._frame = value
    this.app.view.style.width = `${value.width}px`
    this.app.view.style.height = `${value.height}px`
    this.app.renderer.resize(value.width, value.height)
  }

  load() {
    return Promise.all([
      import(/* webpackMode: "eager" */"@pixi/app"),
      import(/* webpackMode: "eager" */'@pixi/core'),
      import(/* webpackMode: "eager" */"@pixi/settings"),
      import(/* webpackMode: "eager" */"@pixi/ticker"),
    ]).then(([{Application}, {Renderer, BatchRenderer}, {settings}, {TickerPlugin}]) => {
      Renderer.registerPlugin('batch', BatchRenderer)
      Application.registerPlugin(TickerPlugin)
      this.app = new Application({
        height: this.frame.height,
        width: this.frame.width,
        transparent: true,
      })
      this.settings = settings
    })
  }

  render() {
    this.app.renderer.render(this.app.stage)
  }
}
