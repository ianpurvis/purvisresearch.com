import { App } from './app.js'
import { Redirection } from './redirection.js'
import { Headers } from './headers.js'
import { CacheControl } from './cache-control.js'
import { ContentSecurityPolicy } from './content-security-policy.js'


async function handler(event) {
  const { request, response } = event.Records[0].cf

  const app = new App([
    new Redirection(),
    new Headers(),
    new CacheControl(),
    new ContentSecurityPolicy()
  ])

  return app.call({ request, response })
}

export { handler }
