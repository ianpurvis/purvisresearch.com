import { App } from './app.js'
import { Redirection } from './redirection.js'
import { Headers } from './headers.js'
import { ContentSecurityPolicy } from './content-security-policy.js'


async function handler(event) {
  const { request, response } = event.Records[0].cf

  const app = new App([
    new Redirection(),
    new Headers(),
    new ContentSecurityPolicy()
  ])

  return app.call({ request, response })
}

export { handler }
