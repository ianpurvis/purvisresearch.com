'use strict'

// Mean Gregorian calendar year:
const SECONDS_PER_YEAR = 31556952


function cacheControlFor({uri}) {
  let maxAge = uri.startsWith('/_/') ? SECONDS_PER_YEAR : 0
  return `public, max-age=${maxAge}`
}


exports.handler = async function(event) {
  const { request, response } = event.Records[0].cf

  let headers = {
    'Cache-Control': cacheControlFor(request),
    'Content-Security-Policy': [
      "base-uri 'none'",
      "connect-src 'self' https://www.google-analytics.com",
      "default-src 'none'",
      "frame-ancestors 'none'",
      "font-src 'self' data:",
      "form-action 'none'",
      "img-src 'self' https://www.google-analytics.com",
      "manifest-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "script-src 'self' 'sha256-V/WaLGhSS+tTPAMDVjFgErm2VGPm+tNBC1rdDJHVkZ0=' https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
    ].join('; '),
    'Referrer-Policy': 'no-referrer-when-downgrade',
    'Strict-Transport-Security': `max-age=${SECONDS_PER_YEAR}; includeSubdomains; preload`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  }

  // Prepare structured header object:
  headers = Object.entries(headers)
    .reduce((result, [key, value]) => ({
      ...result, [key.toLowerCase()]: [{ key, value }]
    }), {})

  headers = { ...response.headers, ...headers }

  return { ...response, headers }
}
