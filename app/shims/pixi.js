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

export {
  Container,
  Renderer,
  RenderTexture,
  Text,
  Ticker
}
