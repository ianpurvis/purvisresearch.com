class Animator {

  constructor({ speed = 1.0 } = {}) {
    Object.assign(this, {
      animations: [],
      elapsedTime: 0,
      speed
    })
  }

  queue(...animations) {
    for (const { startTime = this.elapsedTime, ...props } of animations) {
      this.animations.push({ startTime, ...props })
    }
  }

  async resolve(...animations) {
    const queued = []
    for (const animation of animations) {
      queued.push(new Promise((resolve, reject) =>
        this.queue({ ...animation, resolve, reject })))
    }
    return Promise.all(queued)
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime * this.speed

    this.animations.forEach((animation, index) => {
      const { startTime, duration, tick, resolve, reject } = animation
      const animationElapsedTime = Math.min(this.elapsedTime - startTime, duration)

      try {
        tick(animationElapsedTime)
      }
      catch (error) {
        this.animations.splice(index, 1)
        if (reject) reject(error)
        return
      }
      if (animationElapsedTime >= duration) {
        this.animations.splice(index, 1)
        if (resolve) resolve()
      }
    })
  }
}

export { Animator }
