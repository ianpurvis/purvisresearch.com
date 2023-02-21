import { MathUtils } from 'three'

class Animator {

  constructor() {
    Object.assign(this, {
      animations: [],
      elapsedTime: 0,
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
    this.elapsedTime += deltaTime

    this.animations.forEach((animation, index) => {
      const { startTime, duration, tick, resolve, reject } = animation
      const animationElapsedTime = Math.min(this.elapsedTime - startTime, duration)

      try {
        tick(animationElapsedTime)
      }
      catch (error) {
        if (reject)
          reject(error)
        else
          throw error
      }

      if (animationElapsedTime >= duration) {
        this.animations.splice(index, 1)
        if (resolve) resolve()
      }
    })
  }
}

function delay(duration) {
  return {
    duration,
    tick() {}
  }
}

function linear(t) {
  return t
}

function transition(target, property, endValue, duration = 1.0, ease = linear) {
  const startValue = target[property]
  return {
    duration,
    tick(t) {
      target[property] = MathUtils.lerp(startValue, endValue, ease(t/duration))
    }
  }
}

export { Animator, delay, transition }
