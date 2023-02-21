/* WebGL detection module
 * Based on code from three.js examples:
 *  https://github.com/mrdoob/three.js/blob/dev/examples/jsm/WebGL.js
 */

function  assertWebGLAvailable(canvas) {
  if (!WebGL.isWebGLAvailable(canvas)) throw new WebGL.WebGLNotAvailableError()
}

function isWebGLAvailable(canvas) {
  try {
    return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

class WebGLNotAvailableError extends Error {
  constructor() {
    super(`Your device does not seem to support WebGL.
Learn more at http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation`)
  }
}

export const WebGL = {
  assertWebGLAvailable,
  isWebGLAvailable,
  WebGLNotAvailableError
}
