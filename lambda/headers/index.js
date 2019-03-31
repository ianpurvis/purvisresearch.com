'use strict'

function cacheControlFor({uri}) {
  let maxAge = 0
  if (uri.startsWith('/_/')) {
    maxAge = 31536000 // 365 days
  }
  else if (uri.startsWith('/favicons/')) {
    maxAge = 86400 // 1 day
  }
  return `public, max-age=${maxAge}`
}

exports.handler = async (event) => {

  const { request, response } = event.Records[0].cf

  response.headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubdomains; preload'
  }]

  response.headers['content-security-policy'] = [{
    key: 'Content-Security-Policy',
    value: [
      "base-uri 'none'",
      "connect-src 'self' https://www.google-analytics.com",
      "default-src 'none'",
      "frame-ancestors 'none'",
      "font-src 'self' data:",
      "form-action 'none'",
      "img-src 'self' https://www.google-analytics.com",
      "media-src 'self'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-eval' 'sha256-V/WaLGhSS+tTPAMDVjFgErm2VGPm+tNBC1rdDJHVkZ0=' https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
    ].join('; ')
  }]
  response.headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }]
  response.headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'DENY'
  }]
  response.headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }]
  response.headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'same-origin'
  }]
  response.headers['cache-control'] = [{
    key: 'Cache-Control',
    value: cacheControlFor(request)
  }]

  return response
}
