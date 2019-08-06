export default class Oscillator {

  constructor({
    amplitude = 50, // pixels
    period = 10000  // milliseconds
  }) {
    this.amplitude = amplitude
    this.period = period
  }


  // https://www.khanacademy.org/computing/computer-programming/programming-natural-simulations/programming-oscillations/a/oscillation-amplitude-and-period
  sine(
    time = 0 // milliseconds
  ) {
    return this.amplitude * Math.sin((Math.PI*2) * time / this.period)
  }
}
