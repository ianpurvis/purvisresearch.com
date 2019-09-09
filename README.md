[![Build Status](https://travis-ci.org/ianpurvis/purvisresearch.com.svg?branch=master)](https://travis-ci.org/ianpurvis/purvisresearch.com)
[![codecov](https://codecov.io/gh/ianpurvis/purvisresearch.com/branch/master/graph/badge.svg)](https://codecov.io/gh/ianpurvis/purvisresearch.com)

[![Purvis Research](app/assets/images/qr-logo-200x280.svg)](https://purvisresearch.com)

# [purvisresearch.com](https://purvisresearch.com)

Welcome to the source for my freelance site, built with [Nuxt](https://nuxtjs.org).

Everything gets hosted using a **serverless** back-end built with AWS Route53, S3, CloudFront, and Lambda.

Please take a look around and [get in touch](mailto:ian@purvisresearch.com) if you have any questions!

## Points Of Interest

- [**app/pages/index.vue**](https://github.com/ianpurvis/purvisresearch.com/blob/54f389298989a38d6539e45f3e25c6e3529ae844/app/pages/index.vue#L12-L21) maximizes semantic value by eliminating decoration at the HTML level. To see this in action, visit the [live site](https://purvisresearch.com) and disable CSS in your browser. It also uses [**vue-tight**](https://github.com/ianpurvis/vue-tight) to help preserve readability while controlling whitespace at render.

- [**app/components/autoscaled-div.vue**](app/components/autoscaled-div.vue) is a Vue component that watches the DOM to  automatically scale its children to fit its own width.

- [**app/mixins/pixi_demo.js**](https://github.com/ianpurvis/purvisresearch.com/blob/54f389298989a38d6539e45f3e25c6e3529ae844/app/mixins/pixi_demo.js#L42-L60) imports PixiJS dynamically upon component mount, when the necessary browser context has been ensured.

- [**app/shims/pixi.js**](app/shims/pixi.js) is a module shim that bundles a subset of PixiJS and patches it with [@pixi/unsafe-eval](https://github.com/pixijs/pixi.js/tree/dev/packages/unsafe-eval) for compatibility with strict Content Security Policy.

- [**app/models/gltf-loader.js**](app/models/gltf-loader.js) and	[**app/models/texture-loader.js**](app/models/texture-loader.js) extend their callback-based three.js counterparts with a simple promise API.

- [**bin/fetch-libre-barcode-128-text**](bin/fetch-libre-barcode-128-text) fetches the font's optimized `.woff` file from the Google Font API so that it can be included as a webpack build asset. Only glyphs used in page content are included.

- [**app/mixins/debug.js**](app/mixins/debug.js) provides a layout debug mode that can be enabled by hitting the 'd' key on any page.

- [**app/assets/stylesheets/app.scss**](app/assets/stylesheets/app.scss) imports a subset of [Bulma](https://bulma.io) for simple style reset and basic design structure.

- [**app/assets/shaders/halftone_filter.frag.glsl**](app/assets/shaders/halftone_filter.frag.glsl) is a GLSL shader that creates a simple CYMK halftone effect. Based on Stefan Gustavson's [WebGL Halftone Shader Tutorial](http://weber.itn.liu.se/~stegu/webglshadertutorial/shadertutorial.html) with some modifications for use with three.js.

- [**app/assets/models/basket.draco.glb**](app/assets/models/basket.draco.glb) is a 3D model of a small mayan basket that I scanned with [Qlone](https://www.qlone.pro). I simplified the original ~30mb model with [Blender](https://www.blender.org)  and encoded it as a 128k binary GLTF with [DRACO](https://github.com/google/draco) compression.

- [**lambda/middleware/index.js**](lambda/middleware/index.js) handles CloudFront Lambda@Edge events to provide redirection and HTTP header management.

- [**bin/push_lambda**](bin/push_lambda) uses Webpack to compile the lambda source tree into a [memory-fs](https://github.com/webpack/memory-fs) and then update the function in AWS if the checksum has changed.

- [**.travis.yml**](.travis.yml) checks the codebase with [ESLint](https://github.com/eslint/eslint) and [StyleLint](https://stylelint.io), generates the static site with Nuxt, and then executes the Jest test suites and sends code coverage to [CodeCov](https://codecov.io/gh/ianpurvis/purvisresearch.com). All build checks are required to pass before a PR is merged.


## WebGL Experiments

- [**app/pages/2019/apr.js**](app/pages/2019/apr.js) is the runtime for [2019 Apr: Surreal WebRTC Television](https://purvisresearch.com/2019/apr.html).

- [**app/pages/2018/oct.js**](app/pages/2018/oct.js) is the runtime for [2018 Oct: Screen Printing A 3D Scan](https://purvisresearch.com/2018/oct.html).

- [**app/pages/2017/nov.js**](app/pages/2017/nov.js) is the runtime for [2017 Nov: A 3D Character Exploder](https://purvisresearch.com/2017/nov.html).

- [**app/pages/2017/oct.js**](app/pages/2017/oct.js) is the runtime for [2017 Oct: A Bézier Moiré Generator](https://purvisresearch.com/2017/oct.html).

- [**app/pages/2017/sept.js**](app/pages/2017/sept.js) is the runtime for [2017 Sep: An Emoji Particle Flow](https://purvisresearch.com/2017/sept.html).
