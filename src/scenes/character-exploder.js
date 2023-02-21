import {
  Font,
  LessDepth,
  MeshNormalMaterial,
  Scene,
  TextBufferGeometry,
  Vector3
} from 'three'
import Inconsolata from '../assets/models/Inconsolata_Regular.json'
import { Particle } from '../models/particle.js'
import { PerspectiveCamera } from '../models/perspective-camera.js'
import { Random } from '../models/random.js'

class CharacterExploderScene extends Scene {

  constructor() {
    super()

    const material = new MeshNormalMaterial({
      depthFunc: LessDepth,
      opacity: 0.7,
      transparent: false,
      wireframe: true,
      wireframeLinewidth: 2.0,
    })
    const font = new Font(Inconsolata)
    const particles = [...'abcdefghijklmnopqrstuvwxyz0123456789']
      .map(character => new TextBufferGeometry(character, { font }).center())
      .map(geometry => new Particle(geometry, material))

    particles.forEach(particle => {
      particle.scale.setScalar(
        Random.rand({min: 0.25, max: 1})
      )
      particle.rotation.set(
        Random.rand({max: 2 * Math.PI}),
        Random.rand({max: 2 * Math.PI}),
        Random.rand({max: 2 * Math.PI})
      )
    })

    const blastRadius = 60
    const force = new Vector3()
    particles.forEach(particle => {
      particle.mass = particle.scale.x
      force.set(
        Random.rand({min: -blastRadius, max: blastRadius}),
        Random.rand({min: -blastRadius, max: blastRadius}),
        Random.rand({min: -blastRadius, max: blastRadius})
      )
      particle.applyForce(force)
      // Give each particle a jump start:
      particle.position.copy(force)
    })

    this.add(...particles)

    const camera = Object.assign(new PerspectiveCamera(), {
      fov: 60,
      far: 10000
    })
    camera.position.z = Random.rand({min: 100, max: 150})

    Object.assign(this, { camera, particles })
  }

  resize(width, height) {
    this.camera.cover(width, height)
  }

  update(deltaTime) {
    deltaTime *= 0.002 // slow motion

    this.particles.forEach(p => p.update(deltaTime))

    if (this.camera.needsUpdate)
      this.camera.updateProjectionMatrix()
  }
}

export { CharacterExploderScene }
