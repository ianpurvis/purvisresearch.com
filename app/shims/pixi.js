import {
  BatchRenderer,
  Container,
  ENV,
  Graphics,
  Renderer,
  Ticker,
  settings,
  systems,
} from 'pixi.js'
import { install } from '@pixi/unsafe-eval'

install({ systems })
Renderer.registerPlugin('batch', BatchRenderer)

// The static Ticker intances automatically start an animation frame loop
// during lazy loading. As a workaround, eagerly load them and stop it:
Ticker.shared.autoStart = false
Ticker.shared.stop()
Ticker.system.autoStart = false
Ticker.system.stop()

// WebGL 2 -> 1 fallback seems broken on Safari.
// As a workaround, prefer WebGL 1:
settings.PREFER_ENV = ENV.WEBGL

export {
  Container,
  Graphics,
  Renderer,
  Ticker
}
