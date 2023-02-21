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

export { Point }
