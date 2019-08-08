import { WebGL } from '~/models/webgl.js'
import Graphix from '~/mixins/graphix.js'

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
      speedOfLife: 1.0,
      ticker: null
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
    load() {
      return Promise.resolve().then(() => {
        WebGL.assertWebGLAvailable(this.$refs.canvas)
        return import('~/shims/pixi.js')
      }).then(({ Container, Renderer, Ticker }) => {
        let { height, width } = this.frame()
        let pixelRatio = Math.max(window.devicePixelRatio, 2)
        this.renderer = new Renderer({
          height: height,
          resolution: pixelRatio,
          transparent: true,
          view: this.$refs.canvas,
          width: width,
        })
        this.clock = new Ticker()
        this.scene = new Container()
        this.startAnimating()
      }).catch(error => {
        if (error instanceof WebGL.WebGLNotAvailableError) {
          console.warn(error.message)
        } else {
          throw error
        }
      })
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
      this.clock.stop()
      if (!this.animationFrame) return
      window.cancelAnimationFrame(this.animationFrame)
    },
    update() {
      // To be overriden by mixing class
    },
  },
  mixins: [
    Graphix
  ],
}

