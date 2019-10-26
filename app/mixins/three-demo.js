import {
  Clock,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
}  from 'three'
import Animatable from '~/mixins/animatable.js'
import Graphix from '~/mixins/graphix.js'
import { WebGL } from '~/models/webgl.js'

const safeDispose = (object) => {
  if (object != null && typeof object.dispose === 'function') {
    object.dispose()
  }
}

export default {
  beforeDestroy() {
    this.stopAnimating()
    this.dispose()
  },
  created() {
    // Non-reactive data:
    this.camera = new PerspectiveCamera(60)
    this.clock = new Clock(false)
    this.renderer = null
    this.scene = new Scene()
    this.speedOfLife = 1.0
  },
  methods: {
    dispose() {
      if (this.scene) {
        this.scene.traverse((node) => {
          [].concat(node.material).forEach(material => {
            if (material == null) return
            Object.values(material).forEach(safeDispose)
            safeDispose(material)
          })
          safeDispose(node.geometry)
          safeDispose(node)
        })
        safeDispose(this.scene)
      }
      if (this.renderer) {
        let renderTarget = this.renderer.getRenderTarget()
        safeDispose(renderTarget)
        safeDispose(this.renderer)
      }
    },
    load() {
      return Promise.resolve().then(() => {
        WebGL.assertWebGLAvailable(this.$refs.canvas)
        this.renderer = new WebGLRenderer({
          alpha: true,
          antialias: false,
          canvas: this.$refs.canvas,
        })
        let pixelRatio = Math.max(window.devicePixelRatio, 2)
        this.renderer.setPixelRatio(pixelRatio)
        let { height, width } = this.frame()
        this.renderer.setSize(width, height, false)
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
      this.renderer.render(this.scene, this.camera)
    },
    resize() {
      let { height, width, aspect } = this.frame()
      let { height: oldHeight, width: oldWidth } = this.renderer.getSize(new Vector2())

      if (this.camera.isPerspectiveCamera) {
        let oldTanFOV = Math.tan(((Math.PI/180) * this.camera.fov/2))
        let fov = (360/Math.PI) * Math.atan(oldTanFOV * (height/oldHeight))
        Object.assign(this.camera, {
          aspect: aspect,
          fov: fov,
        })
        this.camera.updateProjectionMatrix()
      }

      // Prevent runaway growth when unstyled:
      let pixelRatio = this.renderer.getPixelRatio()
      if (width / pixelRatio == oldWidth || height / pixelRatio == oldHeight) return

      this.renderer.setSize(width, height, false)
    },
    frame() {
      let { clientHeight: height, clientWidth: width } = this.$refs.canvas
      return {
        height: height,
        width: width,
        aspect: width / height,
      }
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
      if (!this.clock.running) return
      this.deltaTime = this.clock.getDelta() * this.speedOfLife
      this.elapsedTime += this.deltaTime
      Animatable.methods.update.call(this)
    },
  },
  mixins: [
    Animatable,
    Graphix
  ],
}
