import { LambdaEdgeHeaders } from './util.js'

const DEFAULT_POLICY = `
  base-uri
    'none';
  connect-src
    'self'
    https://www.google-analytics.com
    https://sentry.io;
  default-src
    'none';
  frame-ancestors
    'none';
  font-src
    'self'
    data:;
  form-action
    'none';
  img-src
    'self'
    https://www.google-analytics.com;
  manifest-src
    'self';
  media-src
    'self';
  object-src
    'none';
  script-src
    'self'
    'sha256-V/WaLGhSS+tTPAMDVjFgErm2VGPm+tNBC1rdDJHVkZ0='
    https://www.google-analytics.com
    https://sentry.io;
  style-src
    'self'
    'unsafe-inline';
`

class ContentSecurityPolicy {

  constructor(policy = DEFAULT_POLICY) {
    this.policy = policy
  }

  async call({ request, response }) {
    if (response && this.isHtml(response)) {
      const headers = LambdaEdgeHeaders({
        'Content-Security-Policy': this.formatPolicy(this.policy)
      })
      response.headers = { ...response.headers, ...headers }
    }
    return { request, response }
  }

  formatPolicy(policy) {
    return policy.replace(/\s+/g, ' ').trim()
  }

  isHtml(response) {
    if (!response.headers || !response.headers['content-type']) return false
    const contentType = response.headers['content-type'][0].value
    const matcher = /^text\/html/i
    return matcher.test(contentType)
  }
}

export { ContentSecurityPolicy }
