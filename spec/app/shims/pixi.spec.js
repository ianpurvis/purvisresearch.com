jest.mock('pixi.js', () => ({
  BatchRenderer: jest.fn(),
  Renderer: {
    registerPlugin: jest.fn()
  },
  systems: jest.fn()
}))
jest.mock('@pixi/unsafe-eval')

import { BatchRenderer, Renderer, systems } from 'pixi.js'
import { install } from '@pixi/unsafe-eval'


describe('shims/pixi', () => {
  it('installs @pixi/unsafe-eval', async () => {
    await import('~/shims/pixi.js')
    expect(install).toHaveBeenCalledWith({ systems })
  })

  it('registers the batch renderer plugin', async () => {
    await import('~/shims/pixi.js')
    expect(Renderer.registerPlugin)
      .toHaveBeenCalledWith('batch', BatchRenderer)
  })
})
