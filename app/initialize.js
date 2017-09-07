const emoji = '💾📀'

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here
  console.log('Initialized app');

  initializePIXI();
});


function initializePIXI() {

  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container.
  var app = new PIXI.Application();

  // The application will create a canvas element for you that you
  // can then insert into the DOM.
  document.body.appendChild(app.view);

  // Create text objects and pre-render them for the emitter
  var texts = Array.from(emoji).map(e => new PIXI.Text(e));
  texts.forEach(t => app.renderer.render(t));

  // The PIXI.Container to put the emitter in
  // if using blend modes, it's important to put this
  // on top of a bitmap, and not use the root stage Container
  var emitterContainer = new PIXI.Container();
  app.stage.addChild(emitterContainer);

  // Create a new emitter
  var emitter = new PIXI.particles.Emitter(

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
        y: app.screen.height
      },
      rotationSpeed: {
        min: 0.5,
        max: 2.0
      },
      scale: {
        start: 0.5,
        end: 2.0,
      },
      spawnType: "rect",
      spawnRect: {
        x: 0,
        y: 0,
        w: app.screen.width,
        h: 0
      },
      speed: {
        start: 0.5,
        end: 1.5
      },
      startRotation: {
        min: 265,
        max: 275
      }
    }
  );

  app.ticker.add(function(elapsedSeconds) {
    emitter.update(elapsedSeconds);
  });
}
