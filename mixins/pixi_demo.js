export default {
  beforeDestroy() {
    this.stopAnimating()
    this.dispose()
  },
  data() {
    return {
      renderer: null,
      animationFrame: null,
      clock: null,
      elapsedTime: 0,
      scene: null,
      speedOfLife: 1.0
    }
  },
  methods: {
    animate() {
      this.update()
      this.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    dispose() {
      if (this.ticker) this.ticker.destroy()
      if (this.scene) this.scene.destroy(true)
      if (this.renderer) this.renderer.destroy()
    },
    deltaTime() {
      return this.clock.elapsedMS * this.speedOfLife
    },
    frame() {
      let { clientHeight: height, clientWidth: width } = this.$refs.canvas
      return {
        height: height,
        width: width,
        aspect: width / height,
      }
    },
    importPIXI() {
      return Promise.all([
        import(/* webpackMode: "eager" */'@pixi/core'),
        import(/* webpackMode: "eager" */"@pixi/display"),
        import(/* webpackMode: "eager" */"@pixi/ticker"),
        import(/* webpackMode: "eager" */"@pixi/unsafe-eval")
      ]).then(([
        {BatchRenderer, Renderer, systems},
        {Container},
        {Ticker},
        {install}
      ]) => {
        install({ systems: systems })
        Renderer.registerPlugin('batch', BatchRenderer)
        return { Container, Renderer, Ticker }
      })
    },
    load() {
      return this.importPIXI()
        .then(({Container, Renderer, Ticker}) => {
          let { height, width } = this.frame()
          this.renderer = new Renderer({
            height: height,
            transparent: true,
            view: this.$refs.canvas,
            width: width,
          })
          this.clock = new Ticker()
          this.scene = new Container()
        })
        .then(this.startAnimating)
    },
    render() {
      this.resize()
      this.renderer.render(this.scene)
    },
    resize() {
      let {height, width} = this.frame()
      this.renderer.resize(width, height)
    },
    startAnimating() {
      this.clock.start()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    stopAnimating() {
      if (!this.animationFrame) return
      this.clock.stop()
      window.cancelAnimationFrame(this.animationFrame)
    },
    update() {
      // To be overriden by mixing class
    },
  }
}

