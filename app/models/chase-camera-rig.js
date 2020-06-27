import { Object3D, Vector3, Quaternion } from 'three'


class ChaseCameraRig extends Object3D {

  constructor(camera, target) {
    super()

    this.add(camera)

    this.camera = camera
    this.offset = new Vector3()
    this.target = target
    this.smoothing = 0.5

    // Recyclables:
    this._step = 0
    this._position = new Vector3()
    this._target = new Vector3()
    this._quaternionA = new Quaternion()
    this._quaternionB = new Quaternion()
  }

  update(deltaTime) {
    this._step = 1 - Math.pow(this.smoothing, deltaTime)

    this.target.geometry.computeBoundingBox()
    this.target.geometry.boundingBox.getCenter(this._target)
    this._position.addVectors(this._target, this.offset)
    this.position.lerp(this._position, this._step)

    this._quaternionA.copy(this.camera.quaternion)
    this.camera.lookAt(this._target)
    this._quaternionA.copy(this.camera.quaternion)
    Quaternion.slerp(
      this._quaternionA,
      this._quaternionB,
      this.camera.quaternion,
      this._step
    )
  }
}

export { ChaseCameraRig }
