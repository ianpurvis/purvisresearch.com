var THREE = require('three')

let alphabet = Array.from("abcdefghijklmnopqrstuvwxyz0123456789")
let renderer, scene, camera
let meshes = []

document.addEventListener('DOMContentLoaded', startGraphics)
window.addEventListener('resize', maximizeGraphics)


function animate() {
  window.requestAnimationFrame(animate)

  meshes.forEach(mesh => {
    mesh.position.multiplyScalar(1.0001)
    mesh.rotation.x += 1.00002 * 2 * Math.PI
      * Math.sign(mesh.position.z) // Spin backward if z < 0
  })

  renderer.render(scene, camera)
}


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
  camera.position.z = random({min: 100, max: 150})
  camera.lookAt(scene.position)

  // Add content
  var loader = new THREE.FontLoader()
  loader.load("Inconsolata_Regular.json", font => {
  
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

      let radius = 60
      let mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = random({min: -radius, max: radius})
      mesh.position.y = random({min: -radius, max: radius})
      mesh.position.z = random({min: -radius, max: radius})
      mesh.rotation.x = random({max: 2 * Math.PI})
      mesh.rotation.y = random({max: 2 * Math.PI})
      mesh.rotation.z = random({max: 2 * Math.PI})
      mesh.scale.setScalar(random({max: 1}))

      meshes.push(mesh)
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
