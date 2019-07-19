import { App } from './app.js'
import { call as redirection } from './redirection.js'
import { call as headers } from './headers.js'
import { call as cacheControl } from './cache-control.js'
import { call as contentSecurityPolicy } from './content-security-policy.js'


async function handler(event) {
  const { request, response } = event.Records[0].cf

  const app = new App([
    redirection,
    headers,
    cacheControl,
    contentSecurityPolicy
  ])

  return app.call({ request, response })
}

export { handler }
