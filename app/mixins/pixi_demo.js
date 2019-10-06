import { WebGL } from '~/models/webgl.js'
import Graphix from '~/mixins/graphix.js'

export default {
  beforeDestroy() {
    this.stopAnimating()
    this.dispose()
  },
  data() {
    return {
      animations: [],
      animationFrame: null,
      clock: null,
      elapsedTime: 0,
      renderer: null,
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
      })
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
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    stopAnimating() {
      this.clock && this.clock.stop()
      window.cancelAnimationFrame(this.animationFrame)
    },
    update() {
      if (!this.clock || !this.clock.started) return
      this.elapsedTime += (this.clock.elapsedMS * this.speedOfLife)

      // Update animations
      let globalElapsedTime = this.elapsedTime
      this.animations.forEach((animation, index) => {
        let {startTime, duration, tick, resolve, reject} = animation
        let elapsedTime = Math.min(globalElapsedTime - startTime, duration)
        try {
          tick(elapsedTime, duration)
        } catch (error) {
          this.animations.splice(index, 1)
          if (reject) reject(error)
        }
        if (elapsedTime >= duration) {
          this.animations.splice(index, 1)
          if (resolve) resolve()
        }
      })
    },
  },
  mixins: [
    Graphix
  ],
}

