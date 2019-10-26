import {
  BatchRenderer,
  Container,
  Renderer,
  RenderTexture,
  Text,
  Ticker,
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

export {
  Container,
  Renderer,
  RenderTexture,
  Text,
  Ticker
}
