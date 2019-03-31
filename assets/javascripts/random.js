const SIGNS = [-1, 1]

function comparison() {
  return sign()
}

function rand({ max=1, min=0 } = {}) {
  return Math.random() * (max - min) + min
}

function sample(array) {
  return array[Math.floor(Math.random()*array.length)]
}

function sign() {
  return sample(SIGNS)
}

export { comparison, rand, sample, sign }
