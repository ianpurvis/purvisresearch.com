// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
      'app.js': /^app/
    }
  },
  stylesheets: {
    joinTo: {
      'vendor.css': /^(?!app)/, // Files that are not in `app` dir.
      'app.css': /^app/
    }
  }
};

exports.plugins = {
  babel: {presets: ['latest']}
};

exports.npm = {
  globals: {
    PIXI: 'pixi.js'
  },
  static: [
    'node_modules/pixi.js/dist/pixi.min.js',
    'node_modules/pixi-particles/dist/pixi-particles.min.js'
  ],
  styles: {
    bulma: ['css/bulma.css']
  }
};
