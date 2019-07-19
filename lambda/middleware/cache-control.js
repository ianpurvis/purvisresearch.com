import { LambdaEdgeHeaders, SECONDS_PER_YEAR } from './util.js'

class CacheControl {

  cacheControlFor({ uri }) {
    const maxAge = uri.startsWith('/_/') ? SECONDS_PER_YEAR : 0
    return `public, max-age=${maxAge}`
  }

  async call({ request, response }) {
    if (response) {
      const headers = LambdaEdgeHeaders({
        'Cache-Control': this.cacheControlFor(request),
      })
      response.headers = { ...response.headers, ...headers }
    }
    return { request, response }
  }
}

export { CacheControl }
