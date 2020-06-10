import Ammo from 'ammo.js/builds/ammo.wasm.js'
import ammoWasmBinaryPath from 'ammo.js/builds/ammo.wasm.wasm'

async function loadAmmo() {
  const moduleConfig = {
    locateFile: () => ammoWasmBinaryPath
  }
  // Emscripten module functions return a psuedo-promise does not support
  // catch or async/await.  As a workaround, wrap it in a real promise:
  return new Promise(resolve =>
    Ammo(moduleConfig).then(() => resolve()))
}

export { loadAmmo }
