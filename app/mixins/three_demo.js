import {
  Clock,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
}  from 'three'
import { WebGL } from '~/models/webgl.js'
import graphix from '~/mixins/graphix.js'

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
  data() {
    return {
      animations: [],
      animationFrame: null,
      camera: new PerspectiveCamera(60),
      clock: new Clock(false),
      renderer: null,
      scene: new Scene(),
      speedOfLife: 1.0,
    }
  },
  methods: {
    animate() {
      this.update()
      this.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
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
    deltaTime() {
      return this.clock.getDelta() * this.speedOfLife
    },
    elapsedTime() {
      return this.clock.getElapsedTime() * this.speedOfLife
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
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    stopAnimating() {
      this.clock && this.clock.stop()
      window.cancelAnimationFrame(this.animationFrame)
    },
    update() {
      if (!this.clock.running) return

      // Update animations
      let globalElapsedTime = this.elapsedTime()
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
    graphix
  ],
}
