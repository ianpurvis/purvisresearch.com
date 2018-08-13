import Oscillator from '~/assets/javascripts/oscillator.js'
import Random from '~/assets/javascripts/random.js'
import PixiDemo from '~/assets/javascripts/pixi_demo.js'

export default class Oct2017Demo extends PixiDemo {

  constructor(frame) {
    super(frame)

    this.oscillators = [
      new Oscillator({amplitude: 50, period: 10000}),
      new Oscillator({amplitude: 50, period: 5000})
    ]
  }

  load() {
    let self = this
    return super.load().then(new Promise((resolve, reject) => {

      let {height, width} = self.frame

      self.textures = [
        BezierTexture.create('0xff0000', height, width),
        BezierTexture.create('0x00ff00', height, width),
        BezierTexture.create('0x0000ff', height, width)
      ]

      self.textures
        .sort(() => Random.rand({max: 1, min: -1}))
        .forEach((texture) => self.app.stage.addChild(texture))
    }))
  }

  update() {
    let deltaTime = this.app.ticker.deltaTime * this.speedOfLife

    if (deltaTime == 0) return

    this.elapsedTime += deltaTime
    this.textures[1].x = this.oscillators[0].sine(this.elapsedTime)
    this.textures[2].x = this.oscillators[1].sine(this.elapsedTime)
  }
}

class BezierTexture {

  static create(color, height, width) {

    let lineWidth = Random.rand({max: 25, min: 1}) // pixels
    let lineSpace = Random.rand({max: 15}) // pixels
    let lineCount = width / (lineWidth + lineSpace)
    let lineAlpha = Random.rand({max: 0.4, min: 0.1})

    let bezier = new BezierCurve({
      start: new Point({
        x: Random.rand({max: 50, min: -50}),
        y: -10
      }),
      controlOne: new Point({
        x: Random.rand({max: 350, min: -350}),
        y: Random.rand({max: height/2})
      }),
      controlTwo: new Point({
        x: -Random.rand({max: 350, min: -350}),
        y: Random.rand({max: height, min: height/2})
      }),
      end: new Point({
        x: Random.rand({max: 50, min: -50}),
        y: height + 10
      })
    })

    let graphics = new PIXI.Graphics()
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
