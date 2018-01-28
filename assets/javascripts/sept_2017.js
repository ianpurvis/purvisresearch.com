export function initializePIXI() {
  let {width, height} = fullSize();

  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container.
  var app = document.app = new PIXI.Application({
    transparent: true,
    width: width,
    height: height
  });

  // The application will create a canvas element for you that you
  // can then insert into the DOM.
  document.body.appendChild(app.view);

  // Create text objects and pre-render them for the emitter
  var texts = Array.from("💾📀").map(e => new PIXI.Text(e, {fontSize: '48pt'}));
  texts.forEach(t => app.renderer.render(t));

  // The PIXI.Container to put the emitter in
  // if using blend modes, it's important to put this
  // on top of a bitmap, and not use the root stage Container
  var emitterContainer = new PIXI.Container();
  app.stage.addChild(emitterContainer);

  // Create a new emitter
  var emitter = document.emitter = new PIXI.particles.Emitter(

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
        h: app.screen.height
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
  );

  app.ticker.add(function(elapsedSeconds) {
    emitter.update(elapsedSeconds);
  });
}


export function maximizeGraphics() {
  let {width, height} = fullSize();
  let app = document.app;
  let emitter = document.emitter;

  app.view.style.width = `${width}px`;
  app.view.style.height = `${height}px`;
  app.renderer.resize(width, height);

  emitter.spawnRect.height = height;
}


function fullSize() {
  return {
    height: Math.max(document.body.clientHeight, window.innerHeight),
    width: Math.max(document.body.clientWidth, window.innerWidth)
  };
}
