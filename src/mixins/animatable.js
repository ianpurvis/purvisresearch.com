export default {
  created() {
    // Non-reactive data:
    this.animations = []
    this.animationFrame = null
    this.elapsedTime = 0
    this.deltaTime = 0
  },
  methods: {
    animate() {
      this.update()
      this.render()
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    render() {
      throw new Error('Not implemented!')
    },
    startAnimating() {
      this.animationFrame = window.requestAnimationFrame(this.animate)
    },
    stopAnimating() {
      window.cancelAnimationFrame(this.animationFrame)
    },
    update() {
      this.animations.forEach((animation, index) => {
        const { startTime, duration, tick, resolve, reject } = animation
        const animationElapsedTime = Math.min(this.elapsedTime - startTime, duration)

        try {
          tick(animationElapsedTime, duration)
        } catch (error) {
          this.animations.splice(index, 1)
          if (reject) reject(error)
        }
        if (animationElapsedTime >= duration) {
          this.animations.splice(index, 1)
          if (resolve) resolve()
        }
      })
    },
  },
}
