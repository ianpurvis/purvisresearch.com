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
import { Emitter } from 'pixi-particles'

install({ systems })
Renderer.registerPlugin('batch', BatchRenderer)

export {
  Container,
  Emitter,
  Renderer,
  RenderTexture,
  Text,
  Ticker
}
