class Random {

  static comparison() {
    return Random.sign()
  }

  static rand({ max=1, min=0 } = {}) {
    return Math.random() * (max - min) + min
  }

  static sample(array) {
    return array[Math.floor(Math.random()*array.length)]
  }

  static sign() {
    return Random.sample([-1, 1])
  }
}

export { Random }
