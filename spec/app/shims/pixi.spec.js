jest.mock('pixi.js', () => ({
  BatchRenderer: jest.fn(),
  Renderer: {
    registerPlugin: jest.fn()
  },
  systems: jest.fn(),
  Ticker: {
    shared: {
      stop: jest.fn()
    },
    system: {
      stop: jest.fn()
    }
  }
}))
jest.mock('@pixi/unsafe-eval')

import { BatchRenderer, Renderer, systems, Ticker } from 'pixi.js'
import { install } from '@pixi/unsafe-eval'


describe('shims/pixi', () => {
  beforeEach(async () => {
    await import('~/shims/pixi.js')
  })
  it('installs @pixi/unsafe-eval', () => {
    expect(install).toHaveBeenCalledWith({ systems })
  })
  it('registers the batch renderer plugin', () => {
    expect(Renderer.registerPlugin)
      .toHaveBeenCalledWith('batch', BatchRenderer)
  })
  it('disables auto start for Ticker.shared', () => {
    expect(Ticker.shared).toHaveProperty('autoStart', false)
    expect(Ticker.shared.stop).toHaveBeenCalled()
  })
  it('disables auto start for Ticker.system', () => {
    expect(Ticker.system).toHaveProperty('autoStart', false)
    expect(Ticker.system.stop).toHaveBeenCalled()
  })
})
