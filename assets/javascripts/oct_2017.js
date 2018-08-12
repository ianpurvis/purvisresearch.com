import Random from '~/assets/javascripts/random.js'

export function initializePIXI() {
  let {width, height} = fullSize()

  var app = document.app = new PIXI.Application({
    transparent: true,
    width: width,
    height: height
  })

  document.body.appendChild(app.view)

  let textures = [
    createBezierTexture('0xff0000', height, width),
    createBezierTexture('0x00ff00', height, width),
    createBezierTexture('0x0000ff', height, width)
  ]

  textures
    .sort(() => Random.rand({max: 1, min: -1}))
    .forEach(texture => app.stage.addChild(texture))

  var time = 0
  app.ticker.add(deltaTime => {
    time += deltaTime
    textures[1].x = oscillation({
      time: time,
      period: 10000
    })
    textures[2].x = oscillation({
      time: time,
      period: 5000
    })
  })
}


function createBezierTexture(color, height, width) {

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


// https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-oscillations/a/oscillation-amplitude-and-period
function oscillation({
  time = 0,       // milliseconds
  amplitude = 50, // pixels
  period = 10000  // milliseconds
}) {
  return amplitude * Math.sin((Math.PI*2) * time / period)
}


export function maximizeGraphics() {
  let {width, height} = fullSize()
  let app = document.app

  app.view.style.width = `${width}px`
  app.view.style.height = `${height}px`
  app.renderer.resize(width, height)
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


function fullSize() {
  return {
    height: Math.max(document.body.clientHeight, window.innerHeight),
    width: Math.max(document.body.clientWidth, window.innerWidth)
  }
}
