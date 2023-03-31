import { jest } from '@jest/globals'
import { beforeEach, describe, expect, it } from 'jest-ctx'
import { PixiEngine } from '~/engines/pixi-engine.js'
import { Container, Renderer } from '~/shims/pixi.js'

jest.mock('~/shims/pixi.js', () => ({
  Container: jest.fn(function() {
    this.addChild = jest.fn(),
    this.destroy = jest.fn(),
    this.removeChildren = jest.fn()
  }),
  Renderer: jest.fn(function() {
    this.destroy = jest.fn(),
    this.render = jest.fn(),
    this.resize = jest.fn()
  }),
}))

describe('PixiEngine', () => {
  let canvas, engine, scene

  beforeEach(() => {
    Renderer.mockClear()
    Container.mockClear()

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
      update: jest.fn()
    }
    engine = new PixiEngine(canvas)
    engine.scene = scene
  })

  describe('constructor(canvas)', () => {
    it('initializes .renderer', () => {
      expect(engine.renderer).toBe(Renderer.mock.instances[0])
      expect(Renderer.mock.calls[0][0]).toEqual({
        height: canvas.clientHeight,
        resolution: canvas.ownerDocument.defaultView.devicePixelRatio,
        transparent: true,
        view: canvas,
        width: canvas.clientWidth,
      })
    })
    it('initializes .stage', () => {
      expect(engine.stage).toBe(Container.mock.instances[0])
    })
    it('assigns canvas to .canvas', () => {
      expect(engine.canvas).toBe(canvas)
    })
  })

  describe('dispose()', () => {
    beforeEach(() => {
      engine.pause = jest.fn()
    })
    it('pauses', () => {
      engine.dispose()
      expect(engine.pause).toHaveBeenCalled()
    })
    it('destroys the renderer', () => {
      engine.dispose()
      expect(engine.renderer.destroy).toHaveBeenCalled()
    })
    it('destroys the stage', () => {
      engine.dispose()
      expect(engine.stage.destroy).toHaveBeenCalledWith(true)
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
      expect(engine.renderer.render).toHaveBeenCalledWith(engine.stage)
    })
  })

  describe('resize()', () => {
    it('resizes the renderer to match the canvas', () => {
      engine.resize()
      expect(engine.renderer.resize)
        .toHaveBeenCalledWith(canvas.clientWidth, canvas.clientHeight)
    })
  })

  describe('set scene()', () => {
    it('removes current children from the stage', () => {
      engine.scene = scene
      expect(engine.stage.removeChildren).toHaveBeenCalled()
    })
    it('adds the scene to the stage children', () => {
      engine.scene = scene
      expect(engine.stage.addChild).toHaveBeenCalledWith(scene)
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
