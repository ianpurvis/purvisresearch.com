import { Emitter } from 'pixi-particles'
import { SECONDS_TO_MILLISECONDS } from '../models/constants.js'
import { Container } from '../shims/pixi.js'


class EmojiParticleFlowScene extends Container {

  constructor(width, height) {
    super()

    const textures = [ ...'💾📀' ]
      .map(emoji => `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          <text font-size="32px" y="90%">${emoji}</text>
        </svg>
      `)
      .map(encodeURIComponent)
      .map(encoded => `data:image/svg+xml;charset=utf-8,${encoded}`)

    const speed = 40 // approx px per second

    // Set lifetime to be a little less than width / avg speed
    const lifetime = width / (speed * 1.8)

    this.emitter = new Emitter(this, textures, {
      autoUpdate: false,
      frequency: 0.05,
      lifetime: {
        min: lifetime,
        max: lifetime
      },
      pos: {
        x: 0,
        y: 0
      },
      rotationSpeed: {
        min: 40,
        max: 100
      },
      scale: {
        list: [
          {
            value: 0.5,
            time: 0
          },{
            value: 1.25,
            time: 1
          }
        ],
      },
      spawnRect: {
        h: height
      },
      spawnType: 'rect',
      speed: {
        list: [
          {
            value: speed,
            time: 0
          },{
            value: speed * 3.0,
            time: 1
          }
        ],
      },
      startRotation: {
        min: -5,
        max: 5
      }
    })
  }

  destroy() {
    this.emitter.particleImages.forEach(texture => texture.destroy(true))
    this.emitter.destroy()
    super.destroy(true)
  }

  update(deltaTime) {
    this.emitter.update(deltaTime / SECONDS_TO_MILLISECONDS)
  }

}

export { EmojiParticleFlowScene }
