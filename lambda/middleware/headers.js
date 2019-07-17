import { LambdaEdgeHeaders, SECONDS_PER_YEAR } from './util.js'

async function call({ request, response }) {

  if (response) {
    const headers = LambdaEdgeHeaders({
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'Strict-Transport-Security': `max-age=${SECONDS_PER_YEAR}; includeSubdomains; preload`,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    })
    response.headers = { ...response.headers, ...headers }
  }

  return { request, response }
}

export { call }
