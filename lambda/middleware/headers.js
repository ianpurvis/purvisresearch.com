'use strict'

const { LambdaEdgeHeaders } = require('./util.js')

// Mean Gregorian calendar year:
const SECONDS_PER_YEAR = 31556952


function cacheControlFor({uri}) {
  let maxAge = uri.startsWith('/_/') ? SECONDS_PER_YEAR : 0
  return `public, max-age=${maxAge}`
}


async function call({ request, response }) {

  let headers = LambdaEdgeHeaders({
    'Cache-Control': cacheControlFor(request),
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Strict-Transport-Security': `max-age=${SECONDS_PER_YEAR}; includeSubdomains; preload`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  })

  headers = { ...response.headers, ...headers }

  return { ...response, headers }
}

module.exports = { call }
