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
}


function startGraphics() {
  let {width, height} = fullSize()

  console.debug("PR: Starting graphics...")
}

