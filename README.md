[![Build Status](https://github.com/ianpurvis/purvisresearch.com/workflows/CI/badge.svg)](https://github.com/ianpurvis/purvisresearch.com)
[![codecov](https://codecov.io/gh/ianpurvis/purvisresearch.com/branch/trunk/graph/badge.svg)](https://codecov.io/gh/ianpurvis/purvisresearch.com)

[![Purvis Research](app/assets/images/qr-logo-200x280.svg)](https://purvisresearch.com)

# [purvisresearch.com](https://purvisresearch.com)

Welcome to the source for my freelance site, built with [Nuxt](https://nuxtjs.org).

Everything gets hosted using a **serverless** back-end built with AWS Route53, S3, CloudFront, and Lambda.

Please take a look around and [get in touch](mailto:ian@purvisresearch.com) if you have any questions!

## Points Of Interest

- [**app/pages/index.vue**](app/pages/index.vue#L12-L21)
  maximizes semantic value by eliminating decoration at the HTML level. To see
  this in action, visit the [live site](https://purvisresearch.com) and disable
  CSS in your browser. It also uses [**vue-tight**](https://github.com/ianpurvis/vue-tight)
  to help preserve readability while controlling whitespace at render.

- [**app/components/autoscaled-div.vue**](app/components/autoscaled-div.vue)
  is a Vue component that watches the DOM to automatically scale its children
  to fit its own width.

- [**app/mixins/pixi-demo.js**](app/mixins/pixi-demo.js#L30-L45)
  imports PixiJS dynamically upon component mount, when the necessary browser
  context has been ensured.

- [**app/shims/pixi.js**](app/shims/pixi.js) is a module shim that bundles a
  subset of PixiJS and patches it with
  [@pixi/unsafe-eval](https://github.com/pixijs/pixi.js/tree/dev/packages/unsafe-eval)
  for compatibility with strict Content Security Policy.

- [**app/models/gltf-loader.js**](app/models/gltf-loader.js) and
  [**app/models/texture-loader.js**](app/models/texture-loader.js) extend their
  callback-based three.js counterparts with a simple promise API.

- [**app/models/draco-loader.js**](app/models/draco-loader.js) overrides the
  default three.js `DRACOLoader` so that it can use a custom decoder module
  from the webpack build. The javascript interface for the decoder is loaded as
  a normal webpack chunk while the webassembly binary is loaded as a file asset
  with hashed url.

- [**lib/draco**](lib/draco) is a custom WebAssembly build of Google's
  [DRACO](https://github.com/google/draco) decoder that uses a fixed 16MB
  memory space to avoid dynamic allocation costs. It also discards emscripten's
  legacy browser polyfilling in favor of webpack-managed babel transpilation.
  Uncompressed, it's about 52K smaller than the copy of DRACO included with
  three.js. With gzip it's about 20K smaller.

- [**bin/fetch-libre-barcode-128-text**](bin/fetch-libre-barcode-128-text)
  fetches the font's optimized `.woff` file from the Google Font API so that it
  can be included as a webpack build asset. Only glyphs used in page content are
  included.

- [**app/mixins/debug.js**](app/mixins/debug.js) provides a layout debug mode
  that can be enabled by hitting the 'd' key on any page.

- [**spec/app/mixins/animatable.spec.js**](spec/app/mixins/animatable.spec.js)
  is the behavior spec for [**app/mixins/animatable.js**](app/mixins/animatable.js),
  a vue mixin that provides a simple render loop interface with interpolated
  animations. The spec is nothing special, just an example of BDD, unit
  testing, and mocking with [Jest](https://jestjs.io).

- [**app/assets/stylesheets/app.scss**](app/assets/stylesheets/app.scss)
  imports a subset of [Bulma](https://bulma.io) for simple style reset and
  basic design structure.

- [**app/assets/shaders/halftone_filter.frag.glsl**](app/assets/shaders/halftone_filter.frag.glsl)
  is a GLSL shader that creates a simple CYMK halftone effect. Based on Stefan
  Gustavson's [WebGL Halftone Shader Tutorial](http://weber.itn.liu.se/~stegu/webglshadertutorial/shadertutorial.html)
  with some modifications for use with three.js.

- [**app/assets/models/basket.draco.glb**](app/assets/models/basket.draco.glb)
  is a 3D model of a small mayan basket that I scanned with
  [Qlone](https://www.qlone.pro). I simplified the original ~30mb model with
  [Blender](https://www.blender.org)  and encoded it as a 128k binary GLTF with
  [DRACO](https://github.com/google/draco) compression.

- [**lambda/middleware/index.js**](lambda/middleware/index.js) handles
  CloudFront Lambda@Edge events to provide redirection and HTTP header
  management.

- [**infra/**](infra/) contains the terraform configuration that manages the
  AWS infrastructure for this site.  It orchestrates a number of AWS resources
  including Route53, Certificate Manager, S3, Cloudfront, and Lambda@Edge.
  Everything is organized and tagged with a human-friendly in the style of
  heroku.

- [**.github/workflows/ci.yml**](.github/workflows/ci.yml) checks the codebase
  with [ESLint](https://github.com/eslint/eslint) and
  [StyleLint](https://stylelint.io), generates the static site with Nuxt, and
  then executes the Jest test suites and sends code coverage to
  [CodeCov](https://codecov.io/gh/ianpurvis/purvisresearch.com). All build checks
  are required to pass before a PR is merged.

- [**app/workers/dollar-physics-worker.js**](app/workers/dollar-physics-worker.js)
  is a Web Worker interface for managing the [ammo.js](https://github.com/kripken/ammo.js)
  physics simulation found in [**app/workers/dollar-physics-worker.worker.js**](app/workers/dollar-physics-worker.worker.js).
  Messages between the worker thread and main thread use `Transferable` buffers
  to maximize performance.


## WebGL Experiments

- [**app/pages/2020/jul.js**](app/pages/2020/jul.js) is the runtime for [2020
  Jul: A Banknote In Simplex Wind](https://purvisresearch.com/2020/jul.html)

    > This banknote is animated with natural physics!
    I used Emscripten to create a micro version of the ammo.js physics library for
    this project. The simulation runs in a web worker that shares geometry data
    with the main thread via fast transferable buffers. For the wind, I mixed three
    channels of simplex noise to create a constantly changing force across each of
    the primary axes.  Harriet Tubman will be a great face for the $20 bill.

- [**app/pages/2019/apr.js**](app/pages/2019/apr.js) is the runtime for [2019
  Apr: Surreal WebRTC Television](https://purvisresearch.com/2019/apr.html).

    > When I’m in Tokyo, I love working out of the space at STUDIA. Check out this
    cool collaboration with illustrator Hankiti Maeda. Open it in your native
    browser so that you can use the webcam. You can be on TV day and night!

- [**app/pages/2018/oct.js**](app/pages/2018/oct.js) is the runtime for
  [2018 Oct: Screen Printing A 3D Scan](https://purvisresearch.com/2018/oct.html).

    > After a long break, I've made some new graphics! Recently I've been obsessed
    with a small Mayan basket that I bought while traveling in Belize. This project
    takes a 3D scan of the basket and processes it into a random CMYK print. You
    can watch it change or get something new each time you load the page.

- [**app/pages/2017/nov.js**](app/pages/2017/nov.js) is the runtime for
  [2017 Nov: A 3D Character Exploder](https://purvisresearch.com/2017/nov.html).

    > This month was busy, but I was finally able to get a new project done! Better
    late than never, I guess...  Check out these slow motion hypercolor text
    explosions: each time you load the page you can get a new one.

- [**app/pages/2017/oct.js**](app/pages/2017/oct.js) is the runtime for
  [2017 Oct: A Bézier Moiré Generator](https://purvisresearch.com/2017/oct.html).

    > This month I built a Bézier curve generator that creates random moiré patterns.
    You can get something new each time you load the page. This project was
    inspired by the paintings of Anoka Faruqee, check her out!

- [**app/pages/2017/sept.js**](app/pages/2017/sept.js) is the runtime for
  [2017 Sep: An Emoji Particle Flow](https://purvisresearch.com/2017/sept.html).

    > Finally have some free time for fun projects! Stay tuned, I am going to try
    to put something small up each month.
