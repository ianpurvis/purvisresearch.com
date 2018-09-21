export default class Random {

  static rand({
    max = 1,
    min = 0
  } = {
    max: 1,
    min: 0
  }) {
    return Math.random() * (max - min) + min
  }

  static sample(array) {
    return array[Math.floor(Math.random()*array.length)]
  }

  static comparison() {
    return Random.rand({max: 1, min: -1})
  }
}
