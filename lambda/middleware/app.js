class App {

  constructor(middleware = []) {
    this.middleware = middleware
  }

  async call({ request, response }) {
    for (const m of this.middleware) {
      ({ request, response } = await m.call({ request, response }))
    }
    return response || request
  }
}

export { App }
