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
      // Deallocates three memory:
      //    https://github.com/mrdoob/three.js/issues/5175
      //    https://stackoverflow.com/a/40178723
      let isDisposable = (object) => {
        return (typeof object.dispose === 'function')
      }

      this.scene.traverse((node) => {
        if (node.geometry) {
          node.geometry.dispose()
        }
        if (node.material) {
          [].concat(node.material).forEach(material => {
            Object.values(material)
              .filter(value => value)
              .filter(value => isDisposable(value))
              .forEach(value => value.dispose())
            material.dispose()
          })
        }
        if (isDisposable(node)) {
          node.dispose()
        }
      })
      let renderTarget = this.renderer.getRenderTarget()
      if (renderTarget) {
        renderTarget.dispose()
      }
      this.renderer.dispose()
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

