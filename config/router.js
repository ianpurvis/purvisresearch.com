export default config => {
  config.router = {
    extendRoutes(routes) {
      routes.forEach(route => {
        if (route.path === '/') {
          route.alias = '/index.html'
        } else {
          route.alias = `${route.path}.html`
        }
      })
      // Return array to replace nuxt generated routes:
      return routes
    }
  }
}
