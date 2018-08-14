import PixiDemo from '~/assets/javascripts/pixi_demo.js'

export default class Sept2017Demo extends PixiDemo {

  constructor(frame) {
    super(frame)
    this.speedOfLife = 1.0
  }

  load() {
    let self = this
    return super.load().then(new Promise((resolve, reject) => {

      // Create text objects and pre-render them for the emitter
      let texts = Array.from("💾📀").map(e => new PIXI.Text(e, {fontSize: '48pt'}))
      texts.forEach(t => self.app.renderer.render(t))

      // The PIXI.Container to put the emitter in
      // if using blend modes, it's important to put this
      // on top of a bitmap, and not use the root stage Container
      let emitterContainer = new PIXI.Container()
      self.app.stage.addChild(emitterContainer)

      // Create a new emitter
      self.emitter = new PIXI.particles.Emitter(

        emitterContainer,

        // The collection of particle images to use
        texts.map(t => t.texture),

        // Emitter configuration, edit this to change the look of the emitter
        {
          color: {
            start: "ffffff",
            end: "ffffff"
          },
          frequency: 4,
          lifetime: {
            min: 2000.0,
            max: 2000.0
          },
          maxParticles: 1000,
          pos: {
            x: 0,
            y: 0
          },
          rotationSpeed: {
            min: 0.5,
            max: 2.0
          },
          scale: {
            start: 0.25,
            end: 0.75,
          },
          spawnType: "rect",
          spawnRect: {
            x: 0,
            y: 0,
            w: 0,
            h: self.frame.height
          },
          speed: {
            start: 0.5,
            end: 1.5
          },
          startRotation: {
            min: -5,
            max: 5
          }
        }
      )
    }))
  }

  update() {
    let deltaTime = this.app.ticker.elapsedMS * PIXI.settings.TARGET_FPMS * this.speedOfLife

    if (deltaTime == 0) return

    this.emitter.update(deltaTime)
  }
}
