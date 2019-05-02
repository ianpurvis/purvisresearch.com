import {
  Clock,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
}  from 'three'
import { isWebGLAvailable } from 'exports-loader?WEBGL!three/examples/js/WebGL.js'

export default {
  beforeDestroy() {
    this.stopAnimating()
    if (!this.renderer) return
    this.dispose()
    document.body.removeChild(this.renderer.domElement)
  },
  data() {
    return {
      animationFrame: null,
      camera: new PerspectiveCamera(60),
      clock: new Clock(false),
      renderer: null,
      scene: new Scene(),
      speedOfLife: 0.4, // Slow motion
    }
  },
  methods: {
    animate() {
      this.update()
      this.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    dispose() {
      const safeDispose = (object) => {
        if (object != null && typeof object.dispose === 'function') {
          object.dispose()
        }
      }
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
      let renderTarget = this.renderer.getRenderTarget()
      safeDispose(renderTarget)
      safeDispose(this.renderer)
    },
    deltaTime() {
      return this.clock.getDelta() * this.speedOfLife
    },
    render() {
      this.resize()
      this.renderer.render(this.scene, this.camera)
    },
    resize() {
      let {height, width, aspect} = this.frame()

      if (this.camera.isPerspectiveCamera) {
        let {height: oldHeight} = this.renderer.getSize(new Vector2())
        let oldTanFOV = Math.tan(((Math.PI/180) * this.camera.fov/2))
        let fov = (360/Math.PI) * Math.atan(oldTanFOV * (height/oldHeight))
        Object.assign(this.camera, {
          aspect: aspect,
          fov: fov,
        })
        this.camera.updateProjectionMatrix()
      }

      this.renderer.setSize(width, height)
    },
    frame() {
      let height = Math.max(document.body.clientHeight, window.innerHeight)
      let width = Math.max(document.body.clientWidth, window.innerWidth)
      let pixelRatio = Math.max(window.devicePixelRatio, 2)
      return {
        height: height,
        width: width,
        aspect: width / height,
        pixelRatio: pixelRatio
      }
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
  },
  mounted() {
    if (!isWebGLAvailable()) {
      let message = [
        'Your device does not seem to support WebGL.',
        'Learn more at http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'
      ].join('\n')
      console.warn(message)
      return
    }
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
    })
    let { height, width, pixelRatio } = this.frame()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(pixelRatio)
    document.body.appendChild(this.renderer.domElement)
    this.startAnimating()
  }
}

