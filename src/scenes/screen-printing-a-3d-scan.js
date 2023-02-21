import {
  Color,
  DoubleSide,
  LineSegments,
  Scene,
  Vector3,
  WireframeGeometry,
} from 'three'
import { Animator, delay, transition } from '../models/animator.js'
import { DEGREES_TO_RADIANS } from '../models/constants.js'
import { DRACOLoader } from '../models/draco-loader.js'
import { GLTFLoader } from '../models/gltf-loader.js'
import { PerspectiveCamera } from '../models/perspective-camera.js'
import { Random } from '../models/random.js'
import basketPath from '../assets/models/basket.draco.glb'

const BASKET_RADIUS = 64 // Pre-computed from basket.geometry.boundingSphere.radius

class ScreenPrintingA3DScan extends Scene {

  constructor() {
    super()
    this.colors = [
      new Color(0xff00ff),
      new Color(0xffff00)
    ]
    this.animator = new Animator()
    this.camera = new PerspectiveCamera(60)
    this.add(this.camera)
    this.printing = false
  }

  async delay(duration) {
    await this.animator.resolve(delay(duration))
  }

  hide() {
    this.basket.material.opacity =
      this.clone.material.opacity = 0
  }

  async fadeIn(duration) {
    const objects = [ this.basket, this.clone ]
    const animations =
      objects.map(({ material }) =>
        transition(material, 'opacity',
          Random.rand({min: 0.25, max: 0.90}), duration))
    await this.animator.resolve(...animations)
  }

  async fadeOut(duration) {
    const objects = [ this.basket, this.clone ]
    const animations =
      objects.map(({ material, material: { opacity } }) =>
        transition(material, 'opacity', 0.0, duration * opacity))
    await this.animator.resolve(...animations)
  }

  layout() {
    const { basket, camera, clone, colors } = this

    colors.sort(Random.comparison)
    basket.material.color = colors[0]
    clone.material.color = colors[1]

    let radius, theta, phi

    radius = Random.rand({max: 8})
    phi = Random.rand({max: 360}) * DEGREES_TO_RADIANS
    theta = Random.rand({max: 180}) * DEGREES_TO_RADIANS
    clone.position.setFromSphericalCoords(radius, phi, theta)

    // TODO restore mobile scale?
    // let orbitScale = Random.rand({min: 1.20, max: 1.70})
    // if (this.frame().width >= 568) {
    //   orbitScale = Random.rand({min: 0.90, max: 1.40})
    // }
    const orbitScale = Random.rand({min: 0.90, max: 1.40})
    radius = BASKET_RADIUS * orbitScale
    phi = Random.rand({max: 360}) * DEGREES_TO_RADIANS
    theta = Random.rand({min: 30, max: 140}) * DEGREES_TO_RADIANS
    camera.position.setFromSphericalCoords(radius, phi, theta)

    radius = Random.rand({max: 8})
    phi = Random.rand({max: 360}) * DEGREES_TO_RADIANS
    theta =  Random.rand({max: 180}) * DEGREES_TO_RADIANS
    camera.up.setFromSphericalCoords(radius, phi, theta)
    camera.up.normalize()

    radius = BASKET_RADIUS * Random.rand({max: 0.25})
    phi = Random.rand({max: 360}) * DEGREES_TO_RADIANS
    theta = Random.rand({max: 180}) * DEGREES_TO_RADIANS
    camera.lookAt(new Vector3().setFromSphericalCoords(radius, phi, theta))
  }

  async load() {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    gltfLoader.dracoLoader = dracoLoader
    const gltf = await gltfLoader.load(basketPath)
    dracoLoader.dispose()

    const [ basket ] = gltf.scene.children
    basket.position.set(0,0,0)
    basket.geometry.center()
    basket.material.depthTest = false
    basket.material.transparent = true
    this.add(basket)

    const wireframe = new WireframeGeometry(basket.geometry)
    const clone = new LineSegments(wireframe)
    clone.rotation.copy(basket.rotation)
    clone.material.side = DoubleSide
    clone.material.depthTest = false
    clone.material.transparent = true
    this.add(clone)

    Object.assign(this, { basket, clone })
  }

  async print() {
    this.printing = true
    this.hide()
    this.layout()
    await this.fadeIn(250)
    await this.fadeOut(30000)
    await this.delay(3000)
    this.printing = false
  }

  resize(width, height) {
    this.camera.cover(width, height)
  }

  update(deltaTime) {
    this.animator.update(deltaTime)

    if (!this.printing) {
      this.print().catch(console.error)
    }

    if (this.camera.needsUpdate)
      this.camera.updateProjectionMatrix()
  }
}

export { ScreenPrintingA3DScan }
