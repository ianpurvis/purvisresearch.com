import { Graphics } from '~/shims/pixi.js'
import { Random } from '~/models/random.js'

// Alias Random.rand as rand
const { rand } = Random

class BezierCurve {
  constructor({
    start = new Point(),
    controlOne = new Point(),
    controlTwo = new Point(),
    end = new Point()
  }) {
    this.start = start
    this.controlOne = controlOne
    this.controlTwo = controlTwo
    this.end = end
  }

  translate(point) {
    return new BezierCurve({
      start: this.start.add(point),
      controlOne: this.controlOne.add(point),
      controlTwo: this.controlTwo.add(point),
      end: this.end.add(point)
    })
  }
}


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


class Point {
  constructor({
    x = 0,
    y = 0
  } = {
    x: 0,
    y: 0
  }) {
    this.x = x
    this.y = y
  }

  add(other) {
    return new Point({
      x: this.x + other.x,
      y: this.y + other.y
    })
  }
}


export {
  BezierCurve,
  BezierTexture,
  Point
}
