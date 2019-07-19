import { LambdaEdgeHeaders, SECONDS_PER_YEAR } from './util.js'

class CacheControl {

  cacheControlFor({ request, response }) {
    let maxAge
    if (response.status == '301' || request.uri.startsWith('/_/'))
      maxAge = SECONDS_PER_YEAR
    else
      maxAge = 0
    return `public, max-age=${maxAge}`
  }

  async call({ request, response }) {
    if (response) {
      const headers = LambdaEdgeHeaders({
        'Cache-Control': this.cacheControlFor({ request, response }),
      })
      response.headers = { ...response.headers, ...headers }
    }
    return { request, response }
  }
}

export { CacheControl }
