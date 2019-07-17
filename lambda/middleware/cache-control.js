import { LambdaEdgeHeaders, SECONDS_PER_YEAR } from './util.js'

function cacheControlFor({uri}) {
  const maxAge = uri.startsWith('/_/') ? SECONDS_PER_YEAR : 0
  return `public, max-age=${maxAge}`
}

async function call({ request, response }) {

  if (response) {
    const headers = LambdaEdgeHeaders({
      'Cache-Control': cacheControlFor(request),
    })
    response.headers = { ...response.headers, ...headers }
  }

  return { request, response }
}

export { call }
