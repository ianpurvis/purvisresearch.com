import { LambdaEdgeHeaders } from './util.js'

const NUXT_ROOT_SCRIPT_HASH = 'sha256-V/WaLGhSS+tTPAMDVjFgErm2VGPm+tNBC1rdDJHVkZ0='

function isHtml(response) {
  if (!response.headers || !response.headers['content-type']) return false
  const contentType = response.headers['content-type'][0].value
  const matcher = /^text\/html/i
  return matcher.test(contentType)
}

function policyForNuxt(scriptHash = NUXT_ROOT_SCRIPT_HASH) {
  return [
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
    `script-src 'self' '${scriptHash}' https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline'",
  ].join('; ')
}

async function call({ request, response }) {

  if (response && isHtml(response)) {
    const headers = LambdaEdgeHeaders({
      'Content-Security-Policy': policyForNuxt()
    })

    response.headers = { ...response.headers, ...headers }
  }

  return { request, response }
}

export {
  call,
  isHtml,
  policyForNuxt,
}
