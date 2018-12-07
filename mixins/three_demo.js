import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
}  from 'three'

export default {
  beforeDestroy() {
    this.stopAnimating()
    this.dispose()
    document.body.removeChild(this.renderer.domElement)
  },
  data() {
    return {
      animationFrame: null,
      camera: new PerspectiveCamera(60),
      clock: new Clock(false),
      needsAspectFit: true,
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
          safeDispose(material.dispose())
        })
        safeDispose(node.geometry)
        safeDispose(node)
      })
      let renderTarget = this.renderer.getRenderTarget()
      safeDispose(renderTarget)
      safeDispose(this.renderer)
    },
    deltaTime() {
      return this.clock.getDelta() * this.speedOfLife
    },
    render() {
      let {height, width, aspect} = this.frame()
      let {height: oldHeight, width: oldWidth} = this.renderer.getSize()

      if (height != oldHeight || width != oldWidth || this.needsAspectFit) {
        if (this.camera.isPerspectiveCamera) {
          let oldTanFOV = Math.tan(((Math.PI/180) * this.camera.fov/2))
          Object.assign(this.camera, {
            aspect: aspect,
            fov: (360/Math.PI) * Math.atan(oldTanFOV * (height/oldHeight)),
          })
        }
        else if (this.camera.isOrthographicCamera) {
          let frustumHeight = this.camera.top - this.camera.bottom
          Object.assign(this.camera, {
            left: frustumHeight * aspect / -2,
            right: frustumHeight * aspect / 2,
            top: frustumHeight / 2,
            bottom: frustumHeight / -2,
          })
        }
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
        this.needsAspectFit = false
      }

      this.renderer.render(this.scene, this.camera)
    },
    frame() {
      let height = Math.max(document.body.clientHeight, window.innerHeight)
      let width = Math.max(document.body.clientWidth, window.innerWidth)
      return {
        height: height,
        width: width,
        aspect: width / height,
      }
    },
    pixelRatio() {
      return Math.max(window.devicePixelRatio, 2)
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
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
    })
    this.renderer.setPixelRatio(this.pixelRatio())
    let {height, width} = this.frame()
    this.renderer.setSize(height, width)
    document.body.appendChild(this.renderer.domElement)

    this.startAnimating()
  }
}

