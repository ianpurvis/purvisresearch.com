jest.mock('three', () => ({
  Scene: jest.fn(),
  WebGLRenderer: jest.fn(function() {
    this.render = jest.fn()
    this.resize = jest.fn()
    this.setSize = jest.fn()
    this.setPixelRatio = jest.fn()
    this.getRenderTarget = jest.fn()
  })
}))

import { ThreeEngine } from '~/engines/three-engine.js'
import { WebGLRenderer } from 'three'

describe('ThreeEngine', () => {
  let canvas, engine, scene

  beforeEach(() => {

    canvas = {
      clientHeight: Math.random(),
      clientWidth: Math.random(),
      ownerDocument: {
        defaultView: {
          devicePixelRatio: Math.random(),
          requestAnimationFrame: jest.fn()
        }
      }
    }
    scene = {
      camera: Math.random(),
      resize: jest.fn(),
      traverse: jest.fn(),
      update: jest.fn()
    }
    engine = new ThreeEngine(canvas)
    engine.scene = scene
  })

  describe('constructor(canvas)', () => {
    it('initializes .renderer', () => {
      expect(engine.renderer).toBe(WebGLRenderer.mock.instances[0])
      expect(WebGLRenderer.mock.calls[0][0]).toEqual({
        alpha: true,
        antialias: false,
        canvas,
      })
      expect(engine.renderer.setSize)
        .toHaveBeenCalledWith(canvas.clientWidth, canvas.clientHeight, false)
      expect(engine.renderer.setPixelRatio)
        .toHaveBeenCalledWith(canvas.ownerDocument.defaultView.devicePixelRatio)
    })
    it('assigns canvas to .canvas', () => {
      expect(engine.canvas).toBe(canvas)
    })
  })

  describe('dispose()', () => {
    beforeEach(() => {
      engine.pause = jest.fn()
      engine.scene.traverse = jest.fn()
    })
    it('pauses', () => {
      engine.dispose()
      expect(engine.pause).toHaveBeenCalled()
    })
    it('traverses the scene and disposes all objects', () => {
      engine.dispose()
      expect(engine.scene.traverse).toHaveBeenCalled()
    })
  })

  describe('pause()', () => {
    it('pauses', () => {
      engine.paused = false
      engine.pause()
      expect(engine.paused).toBe(true)
    })
  })

  describe('play()', () => {
    beforeEach(() => {
      engine.paused = true
      engine.update = jest.fn()
    })
    it('unpauses', () => {
      engine.play()
      expect(engine.paused).toBe(false)
    })
    it('calls update', () => {
      engine.play()
      expect(engine.update).toHaveBeenCalled()
    })
  })

  describe('render()', () => {
    it('renders the stage', () => {
      engine.render()
      expect(engine.renderer.render)
        .toHaveBeenCalledWith(engine.scene, engine.scene.camera)
    })
  })

  describe('resize()', () => {
    it('resizes the renderer to match the canvas', () => {
      engine.resize()
      expect(engine.renderer.setSize)
        .toHaveBeenCalledWith(canvas.clientWidth, canvas.clientHeight, false)
    })
    it('resizes the scene', () => {
      engine.resize()
      expect(engine.scene.resize)
        .toHaveBeenCalledWith(canvas.clientWidth, canvas.clientHeight)
    })
  })

  describe('tick()', () => {
    let timestamp, result

    beforeEach(() => {
      timestamp = Math.random()
      canvas.ownerDocument.defaultView.requestAnimationFrame =
        jest.fn(callback => callback(timestamp))
    })
    it('promises the next animation frame timestamp', async () => {
      result = await engine.tick()
      expect(result).toBe(timestamp)
      expect(canvas.ownerDocument.defaultView.requestAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('update()', () => {
    beforeEach(() => {
      engine.deltaTime = Math.random()
      engine.elapsedTime = Math.random()
      engine.resize = jest.fn()
      engine.render = jest.fn()
    })
    it('updates the scene with delta time and elapsed time', () => {
      engine.update()
      expect(engine.scene.update)
        .toHaveBeenCalledWith(engine.deltaTime, engine.elapsedTime)
    })
    it('resizes', () => {
      engine.update()
      expect(engine.resize).toHaveBeenCalled()
    })
    it('renders', () => {
      engine.update()
      expect(engine.render).toHaveBeenCalled()
    })
  })
})
