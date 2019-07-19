class App {

  constructor(middleware = []) {
    this.middleware = middleware
  }

  async call({ request, response }) {
    for (const call of this.middleware) {
      ({ request, response } = await call({ request, response }))
    }
    return response || request
  }
}

export { App }
