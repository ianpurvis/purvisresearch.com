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
      this.scene.traverse((node) => {
        if (node.geometry) {
          node.geometry.dispose()
        }
        if (node.material) {
          [].concat(node.material).forEach((material) => {
            if (material.map)         material.map.dispose()
            if (material.lightMap)    material.lightMap.dispose()
            if (material.bumpMap)     material.bumpMap.dispose()
            if (material.normalMap)   material.normalMap.dispose()
            if (material.specularMap) material.specularMap.dispose()
            if (material.envMap)      material.envMap.dispose()
            material.dispose()
          })
        }
      })
      this.renderer.dispose()
    },
    deltaTime() {
      return this.clock.getDelta() * this.speedOfLife
    },
    render() {
      let {height, width} = this.frame()
      let {height: oldHeight, width: oldWidth} = this.renderer.getSize()

      if (height != oldHeight || width != oldWidth) {
        let oldTanFOV = Math.tan(((Math.PI/180) * this.camera.fov/2))

        this.camera.aspect = width / height
        this.camera.fov = (360/Math.PI) * Math.atan(oldTanFOV * (height/oldHeight))
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
      }

      this.renderer.render(this.scene, this.camera)
    },
    frame() {
      return {
        height: Math.max(document.body.clientHeight, window.innerHeight),
        width: Math.max(document.body.clientWidth, window.innerWidth)
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

