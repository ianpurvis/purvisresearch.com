import { dirname, join, relative } from 'path'

export default ({ baseDir }) => ({

  build: {

    babel: {
      configFile: true
    },

    extend(config, context) {

      const { chunk, other, wasm } =
        this.buildContext.options.build.filenames

      config.context = baseDir

      config.node = {
        fs: 'empty'
      }

      config.resolve.modules.unshift('lib')

      // Load web-workers
      config.module.rules.push({
        test: /src\/workers\/.*\.js$/,
        loader: 'worker-loader',
        options: {
          filename: chunk(context)
        },
        exclude: /(node_modules)/
      })

      // Load glb models as arraybuffer
      config.module.rules.push({
        test: /\.glb$/,
        loader: 'file-loader',
        options: {
          name: other(context)
        },
        exclude: /(node_modules)/
      })

      // Load glsl models as string
      config.module.rules.push({
        test: /\.glsl$/,
        loader: 'raw-loader',
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
        loader: 'file-loader',
        options: {
          name: wasm(context)
        }
      })

      // Load draco decoder module in the raw:
      config.module.rules.push({
        test: /\.js$/,
        loader: 'raw-loader',
        include: /lib\/draco/
      })
    },

    filenames: {
      img: ({ isDev }) =>
        (resourcePath) => {
          const nestedPath = relative('src/assets/images', dirname(resourcePath))
          return isDev
            ? '[path][name].[ext]'
            : join('img', nestedPath, '[name].[ext]?[contenthash:7]')
        },
      other: ({ isDev }) => isDev
        ? '[path][name].[ext]'
        : '[name].[contenthash:7].[ext]',
      wasm: ({ isDev }) => isDev
        ? '[path][name].[ext]'
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
      'd3-ease',
      /^three\/examples\/jsm/,
      'vue-analytics'
    ],
  }
})
