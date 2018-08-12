import * as THREE from 'three'
import Random from '~/assets/javascripts/random.js'

let alphabet = Array.from("abcdefghijklmnopqrstuvwxyz0123456789")
let renderer, scene, camera, clock
let speedOfLife = 0.4 // Slow motion
let particles = []


function animate() {
  window.requestAnimationFrame(animate)

  let deltaTime = clock.getDelta() * speedOfLife
  if (deltaTime > 0) {
    particles.forEach(p => update(p, deltaTime))
  }

  renderer.render(scene, camera)
}


function update(particle, deltaTime) {
  particle.acceleration.multiplyScalar(1 / particle.mass)
  particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime))
  particle.velocity.add(particle.acceleration.multiplyScalar(deltaTime))
  particle.acceleration.setScalar(0)
}


function fullSize() {
  return {
    height: Math.max(document.body.clientHeight, window.innerHeight),
    width: Math.max(document.body.clientWidth, window.innerWidth)
  }
}


export function maximizeGraphics() {
  let {width, height} = fullSize()
  console.debug(`PR: Resizing graphics to ${width}x${height}`)

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}


export function startGraphics() {
  console.debug("PR: Starting graphics...")

  let {width, height} = fullSize()

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement)

  // Create scene
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
  camera.position.z = Random.rand({min: 100, max: 150})
  camera.lookAt(scene.position)

  // Add content
  let font = new THREE.Font(require("~/assets/fonts/Inconsolata_Regular.json"))
  
  alphabet.forEach(character => {
    let geometry = new THREE.TextBufferGeometry(character, {
      font: font
    })
    geometry.center()
    
    let material = new THREE.MeshNormalMaterial({
      depthFunc: THREE.LessDepth,
      opacity: 0.7,
      transparent: false,
      wireframe: true,
      wireframeLinewidth: 2.0,
    })

    let mesh = new THREE.Mesh(geometry, material)
    let radius = 60
    let acceleration = new THREE.Vector3(
      Random.rand({min: -radius, max: radius}),
      Random.rand({min: -radius, max: radius}),
      Random.rand({min: -radius, max: radius})
    )
    let scale = Random.rand({min: 0.25, max: 1})

    // Give each particle a jump start:
    mesh.position.copy(acceleration)

    mesh.rotation.set(
      Random.rand({max: 2 * Math.PI}),
      Random.rand({max: 2 * Math.PI}),
      Random.rand({max: 2 * Math.PI})
    )
    mesh.scale.setScalar(scale)

    let particle = new Particle({
      mesh: mesh,
      acceleration: acceleration,
      mass: scale
    })

    particles.push(particle)
    scene.add(mesh)
  })

  clock = new THREE.Clock()
  animate()
}

class Particle {
  constructor({
    acceleration = new THREE.Vector3(0, 0, 0),
    mass = 1,
    mesh = null,
    velocity = new THREE.Vector3(0, 0, 0)
  }) {
    this.acceleration = acceleration
    this.mass = mass
    this.mesh = mesh
    this.velocity = velocity
  }

  get position() {
    return this.mesh.position
  }

  set position(p) {
    this.mesh.position = p
  }

  get rotation() {
    return this.mesh.rotation
  }

  set rotation(r) {
    this.mesh.rotation = r
  }

  toString() {
    return `m: ${this.mass}`
      + `\ta: ${this.acceleration.toArray()}`
      + `\tv: ${this.velocity.toArray()}`
      + `\tp: ${this.position.toArray()}`
      + `\tr: ${this.rotation.toArray()}`
  }
}
