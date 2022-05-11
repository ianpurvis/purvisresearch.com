import { OrthographicCamera as _OrthographicCamera } from 'three'

class OrthographicCamera extends _OrthographicCamera {

  get bottom() {
    return this._bottom
  }

  set bottom(bottom) {
    if (this._bottom != bottom) {
      this._bottom = bottom
      this.needsUpdate = true
    }
  }

  get left() {
    return this._left
  }

  set left(left) {
    if (this._left != left) {
      this._left = left
      this.needsUpdate = true
    }
  }

  get right() {
    return this._right
  }

  set right(right) {
    if (this._right != right) {
      this._right = right
      this.needsUpdate = true
    }
  }

  get top() {
    return this._top
  }

  set top(top) {
    if (this._top != top) {
      this._top = top
      this.needsUpdate = true
    }
  }

  cover(width, height, targetWidth, targetHeight) {
    const aspect = width / height
    this.top = targetHeight / 2
    this.right = targetWidth * aspect / 2
    this.bottom = targetHeight / -2
    this.left = targetWidth * aspect / -2
  }

  updateProjectionMatrix() {
    super.updateProjectionMatrix()
    this.needsUpdate = false
  }
}

export { OrthographicCamera }
