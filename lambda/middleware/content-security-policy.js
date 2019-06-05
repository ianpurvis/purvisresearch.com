'use strict'

const { LambdaEdgeHeaders } = require('./util.js')

function isHtml(response) {
  if (!response.headers || !response.headers['content-type']) return false
  const contentType = response.headers['content-type'][0].value
  const matcher = /^text\/html; charset=utf-8$/i
  return matcher.test(contentType)
}

async function call({ request, response }) {

  if (!isHtml(response)) return response

  let headers = LambdaEdgeHeaders({
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
  })

  headers = { ...response.headers, ...headers }

  return { ...response, headers }
}

module.exports = { call }
