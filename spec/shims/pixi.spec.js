jest.mock('pixi.js', () => ({
  BatchRenderer: jest.fn(),
  ENV: {
    WEBGL: 1
  },
  Renderer: {
    registerPlugin: jest.fn()
  },
  Ticker: {
    shared: {
      stop: jest.fn()
    },
    system: {
      stop: jest.fn()
    }
  },
  settings: {
    PREFER_ENV: 2
  },
  systems: jest.fn(),
}))
jest.mock('@pixi/unsafe-eval')

import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import {
  BatchRenderer,
  ENV,
  Renderer,
  Ticker,
  settings,
  systems,
} from 'pixi.js'
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
  it('configures global settings to prefer WebGL 1', () => {
    expect(settings.PREFER_ENV).toBe(ENV.WEBGL)
  })
})
