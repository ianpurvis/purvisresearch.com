import { call as redirection } from './redirection.js'
import { call as headers } from './headers.js'
import { call as cacheControl } from './cache-control.js'
import { call as contentSecurityPolicy } from './content-security-policy.js'

const middleware = [
  redirection,
  headers,
  cacheControl,
  contentSecurityPolicy
]

async function handler(event) {
  let { request, response } = event.Records[0].cf

  for (const call of middleware) {
    ({ request, response } = await call({ request, response }))
  }

  return response || request
}

export { handler }
