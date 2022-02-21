// See https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-oscillations/a/oscillation-amplitude-and-period

const TWO_PI = 2 * Math.PI

function sin(t) {
  return Math.sin(TWO_PI * t)
}

function cos(t) {
  return Math.cos(TWO_PI * t)
}

export { sin, cos }
