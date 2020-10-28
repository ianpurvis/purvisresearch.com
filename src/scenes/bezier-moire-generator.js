import { Animator } from '../models/animator.js'
import { BezierPattern } from '../models/bezier-pattern.js'
import { SECONDS_TO_MILLISECONDS } from '../models/constants.js'
import { sin } from '../models/oscillators.js'
import { Random } from '../models/random.js'
import { Container } from '../shims/pixi.js'


class BezierMoireGenerator extends Container {

  constructor(width, height) {
    super()

    const colors = [
      '0xff0000',
      '0x00ff00',
      '0x0000ff'
    ]

    const textures = colors
      .map(color => BezierPattern.create(color, height, width))
      .sort(Random.comparison)

    this.addChild(...textures)

    const animations = textures.slice(-2).map(texture => ({
      target: texture,
      startTime: 0,
      duration: Number.MAX_VALUE,
      amplitude: 50, //pixels
      period: Random.rand({ min: 50, max: 100 }) * SECONDS_TO_MILLISECONDS,
      tick(t) {
        this.target.x = sin(t, this.period, this.amplitude)
      }
    }))

    const animator = new Animator({ animations, speed: 0.4 })

    Object.assign(this, { animator, textures })
  }

  update(deltaTime) {
    this.animator.update(deltaTime)
  }
}

export { BezierMoireGenerator }
