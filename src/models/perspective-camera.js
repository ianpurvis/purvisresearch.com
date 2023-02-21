import { PerspectiveCamera as _PerspectiveCamera } from 'three'
import { DEGREES_TO_RADIANS, RADIANS_TO_DEGREES } from './constants.js'

class PerspectiveCamera extends _PerspectiveCamera {

  get aspect() {
    return this._aspect
  }

  set aspect(aspect) {
    if (this._aspect != aspect) {
      this._aspect = aspect
      this.needsUpdate = true
    }
  }

  get fov() {
    return this._fov
  }

  set fov(fov) {
    if (this._fov != fov) {
      this._fov = fov
      this._tanHalfFov = Math.tan(fov * 0.5 * DEGREES_TO_RADIANS)
      this.needsUpdate = true
    }
  }

  cover(width, height) {
    const scale = this.height ? height / this.height : 1
    this.fov = Math.atan(this._tanHalfFov * scale) * RADIANS_TO_DEGREES * 2
    this.aspect = width / height
    this.height = height
    this.width = width
  }

  updateProjectionMatrix() {
    super.updateProjectionMatrix()
    this.needsUpdate = false
  }
}

export { PerspectiveCamera }
