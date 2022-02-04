import { Point } from './point.js'

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

export { BezierCurve }
