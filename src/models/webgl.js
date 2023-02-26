/* WebGL detection module
 * Based on code from three.js examples:
 *  https://github.com/mrdoob/three.js/blob/dev/examples/jsm/WebGL.js
 */

const MESSAGE_NO_WEBGL =
  'Your device does not seem to support WebGL.\n' +
  'Learn more at http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'

function detectWebGL(canvas, {
  logger = console.warn,
  message = MESSAGE_NO_WEBGL
} = {}) {
  const present = isWebGLAvailable(canvas)
  if (!present && logger && message) logger(message)
  return present
}

function isWebGLAvailable(canvas) {
  try {
    return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export { detectWebGL, isWebGLAvailable }
