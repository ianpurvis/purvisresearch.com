var THREE = require('three')
var throttle = require('lodash.throttle')

let alphabet = Array.from("abcdefghijklmnopqrstuvwxyz0123456789")
let renderer, scene, camera

document.addEventListener('DOMContentLoaded', startGraphics)
window.addEventListener('resize', maximizeGraphics)


function animate() {
  window.requestAnimationFrame(throttledAnimate)
  renderer.render(scene, camera)
}
let throttledAnimate = throttle(animate, 250)


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
  camera.position.z = random({min: 1000, max: 2000})
  camera.lookAt(scene.position)


  // Add content
  var loader = new THREE.FontLoader()
  loader.load("Inconsolata_Regular.json", font => {
  
    alphabet.forEach(character => {
      let geometry = new THREE.TextBufferGeometry(character, {
        font: font
      })
      
      let material = new THREE.MeshNormalMaterial({
        opacity: 0.7,
        transparent: false,
        wireframe: true,
        wireframeLinewidth: 2.0,
      })

      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = random({min: -500, max: 500})
      mesh.position.y = random({min: -500, max: 500})
      mesh.position.z = random({min: -500, max: 500})
      mesh.rotation.x = random({max: 2 * Math.PI})
      mesh.rotation.y = random({max: 2 * Math.PI})
      mesh.scale.x = mesh.scale.y = mesh.scale.z = random({max: 10})
      mesh.matrixAutoUpdate = false
      mesh.updateMatrix()

      scene.add(mesh)
    })
  })

  animate()
}


function random({
  max = 1,
  min = 0
} = {
  max: 1,
  min: 0
}) {
  return Math.random() * (max - min) + min
}
