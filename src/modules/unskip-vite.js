// Workaround for https://github.com/nuxt/bridge/issues/734

const unskipViteMiddleware = {
  route: '',
  handle(request, response, next) {
    request.url = request.url.replace('/__skip_vite/', '/')
    next()
  }
}

export default function setup() {
  const { nuxt } = this
  let viteServer = null
  nuxt.hook('vite:serverCreated', (server) => {
    viteServer = server
  })
  nuxt.hook('server:devHandler', () => {
    const { middlewares: { stack } } = viteServer

    const i = stack.findIndex(({ handle }) => (
      handle instanceof Function &&
      handle.name === 'viteTransformMiddleware'
    ))

    stack.splice(i, 0, unskipViteMiddleware)
  })
}
