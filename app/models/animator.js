class Animator {

  constructor({ animations = [], speed = 1.0 } = {}) {
    Object.assign(this, {
      animations,
      elapsedTime: 0,
      speed
    })
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime * this.speed

    this.animations.forEach((animation, index) => {
      const { startTime, duration, tick, resolve, reject } = animation
      const animationElapsedTime = Math.min(this.elapsedTime - startTime, duration)

      try {
        tick.call(animation, animationElapsedTime, duration)
      } catch (error) {
        this.animations.splice(index, 1)
        if (reject) reject(error)
      }
      if (animationElapsedTime >= duration) {
        this.animations.splice(index, 1)
        if (resolve) resolve()
      }
    })
  }
}

export { Animator }
