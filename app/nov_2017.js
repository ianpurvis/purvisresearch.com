var THREE = require('three')
var throttle = require('lodash.throttle')

var renderer, scene, camera, start

document.addEventListener('DOMContentLoaded', startGraphics)
window.addEventListener('resize', maximizeGraphics)


function fullSize() {
  return {
    height: Math.max(document.body.clientHeight, window.innerHeight),
    width: Math.max(document.body.clientWidth, window.innerWidth)
  }
}


function maximizeGraphics() {
  let {width, height} = fullSize()
  console.debug(`PR: Resizing graphics to ${width}x${height}`)

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}


function startGraphics() {
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
  camera.position.z = 100
  camera.lookAt(scene.position)

  // Add content
  let geometry = new THREE.SphereBufferGeometry(5, 32, 32)
  let material = new THREE.MeshBasicMaterial({color: 0xffff00})
  let mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  animate()
}

function animate() {
  window.requestAnimationFrame(throttledAnimate)
  console.debug(`PR: Rendering...${new Date()}`)
  renderer.render(scene, camera)
}

let throttledAnimate = throttle(animate, 250)
