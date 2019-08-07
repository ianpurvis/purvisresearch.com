import { WEBGL } from 'three/examples/jsm/WebGL.js'
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
      if (!WEBGL.isWebGLAvailable()) {
        let message = [
          'Your device does not seem to support WebGL.',
          'Learn more at http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'
        ].join('\n')
        console.warn(message)
        return
      }
      return Promise.resolve(
        import('~/shims/pixi.js')
      ).then(({ Container, Renderer, Ticker }) => {
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
      }).then(
        this.startAnimating
      )
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

