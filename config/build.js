import { dirname, join, relative } from 'path'

export default async config => {

  config.build = {

    babel: {
      configFile: true
    },

    extend(config, context) {

      const { chunk, other, wasm } =
        this.buildContext.options.build.filenames

      config.node = {
        fs: 'empty'
      }

      // Load web-workers
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: chunk(context)
        },
        exclude: /(node_modules)/
      })

      // Load glb models as arraybuffer
      config.module.rules.push({
        test: /\.glb$/,
        loader: 'arraybuffer-loader',
        exclude: /(node_modules)/
      })

      // Load glsl models as string
      config.module.rules.push({
        test: /\.glsl$/,
        loader: 'raw-loader',
        exclude: /(node_modules)/
      })

      // Optimize svg files
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeViewBox: false },
            {
              addAttributesToSVGElement: {
                attribute: {
                  fill: '#363636'
                }
              }
            }
          ]
        },
        exclude: /(node_modules)/
      })

      config.module.rules.push({
        test: [
          /manifest\.json$/,
          /browserconfig\.xml$/,
        ],
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: other(context)
            }
          },{
            loader: 'extract-loader'
          },{
            loader: 'frack-loader'
          }
        ],
        exclude: /(node_modules)/
      })

      config.module.rules.push({
        test: /\.wasm$/,
        type: 'javascript/auto',
        include: /(node_modules)\/ammo.js/,
        loader: 'file-loader',
        options: {
          name: wasm(context)
        },
      })
    },

    filenames: {
      img: ({ isDev }) =>
        (resourcePath) => {
          const nestedPath = relative('app/assets/images', dirname(resourcePath))
          return isDev
            ? '[path][name].[ext]'
            : join('img', nestedPath, '[name].[ext]?[contenthash:7]')
        },
      other: ({ isDev }) => isDev
        ? '[name].[ext]'
        : '[name].[contenthash:7].[ext]',
      wasm: ({ isDev, isModern }) => isDev
        ? `${isModern ? 'modern-' : ''}[name].[ext]`
        : 'wasm/[contenthash:7].[ext]'
    },

    loaders: {
      imgUrl: {
        limit: 0 // Never transform files into data urls
      }
    },

    publicPath: '/_/',

    // Transpile npm packages lacking ES5 compatibility:
    transpile: [
      'vue-analytics',
      /^three\/examples\/jsm/
    ],
  }
}
