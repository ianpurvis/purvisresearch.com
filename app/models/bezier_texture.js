import { Graphics } from '../shims/pixi.js'
import { BezierCurve } from './bezier-curve.js'
import { Point } from './point.js'
import { Random } from './random.js'

// Alias Random.rand as rand
const { rand } = Random

class BezierTexture {

  static create(color, height, width) {

    let lineWidth = rand({max: 25, min: 1}) // pixels
    let lineSpace = rand({max: 15}) // pixels
    let lineCount = width / (lineWidth + lineSpace)
    let lineAlpha = rand({max: 0.4, min: 0.1})

    let bezier = new BezierCurve({
      start: new Point({
        x: rand({max: 50, min: -50}),
        y: -10
      }),
      controlOne: new Point({
        x: rand({max: 350, min: -350}),
        y: rand({max: height/2})
      }),
      controlTwo: new Point({
        x: -rand({max: 350, min: -350}),
        y: rand({max: height, min: height/2})
      }),
      end: new Point({
        x: rand({max: 50, min: -50}),
        y: height + 10
      })
    })


    let graphics = new Graphics()
    graphics.lineStyle(lineWidth, color, lineAlpha)

    let offset, clone
    for (var i = 0; i < lineCount; i++) {
      offset = new Point({
        x: i * (lineWidth + lineSpace)
      })
      clone = bezier.translate(offset)

      graphics.moveTo(
        clone.start.x,
        clone.start.y
      )
      graphics.bezierCurveTo(
        clone.controlOne.x,  clone.controlOne.y,
        clone.controlTwo.x,  clone.controlTwo.y,
        clone.end.x,         clone.end.y
      )
    }

    return graphics
  }
}

export { BezierTexture }
