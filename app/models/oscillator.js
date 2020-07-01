// See https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-oscillations/a/oscillation-amplitude-and-period

const TWO_PI = 2 * Math.PI

class Oscillator {

  constructor(attributes = {}) {
    Object.assign(this, Oscillator.defaultAttributes, attributes)
  }

  sin(x = 0) {
    return Math.sin(TWO_PI * (x + this.xshift) / this.period) * this.amplitude + this.yshift
  }

  cos(x = 0) {
    return Math.cos(TWO_PI * (x + this.xshift) / this.period) * this.amplitude + this.yshift
  }
}

Oscillator.defaultAttributes = {
  amplitude: 1,
  period: 1,
  xshift: 0,
  yshift: 0
}

export { Oscillator }
