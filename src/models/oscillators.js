// See https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-oscillations/a/oscillation-amplitude-and-period

const TWO_PI = 2 * Math.PI

function sin(x, period = 1, amplitude = 1, xshift = 0, yshift = 0) {
  return Math.sin(TWO_PI * (x + xshift) / period) * amplitude + yshift
}

function cos(x, period = 1, amplitude = 1, xshift = 0, yshift = 0) {
  return Math.cos(TWO_PI * (x + xshift) / period) * amplitude + yshift
}

export { sin, cos }
