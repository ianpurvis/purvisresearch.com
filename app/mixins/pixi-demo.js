import Animatable from '~/mixins/animatable.js'
import Graphix from '~/mixins/graphix.js'
import { WebGL } from '~/models/webgl.js'

export default {
  beforeDestroy() {
    this.stopAnimating()
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.clock = null
    this.renderer = null
    this.scene = null
  },
  methods: {
    dispose() {
      if (this.clock) this.clock.destroy()
      if (this.scene) this.scene.destroy(true)
      if (this.renderer) this.renderer.destroy()
    },
    frame() {
      let { clientHeight: height, clientWidth: width } = this.$refs.canvas
      return {
        height: height,
        width: width,
        aspect: width / height,
      }
    },
    async load() {
      WebGL.assertWebGLAvailable(this.$refs.canvas)
      const { Container, Renderer, Ticker } = await import('~/shims/pixi.js')
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
    },
    logError(error) {
      if (error instanceof WebGL.WebGLNotAvailableError) {
        console.warn(error.message)
      } else {
        this.$sentry.captureException(error)
        console.error(error)
      }
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
      Animatable.methods.startAnimating.call(this)
    },
    stopAnimating() {
      this.clock && this.clock.stop()
      Animatable.methods.stopAnimating.call(this)
    },
    update() {
      if (!this.clock || !this.clock.started) return
      this.deltaTime = this.clock.elapsedMS * this.speedOfLife
      this.elapsedTime += this.deltaTime
      Animatable.methods.update.call(this)
    },
  },
  mixins: [
    Animatable,
    Graphix
  ],
}

