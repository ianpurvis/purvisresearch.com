'use strict'

const middleware = [
  './redirection.js',
  './headers.js',
  './content-security-policy.js',
].map(require)

exports.handler = async function(event) {
  let { request, response } = event.Records[0].cf

  for (const { call } of middleware) {
    ({ request, response } = await call({ request, response }))
  }

  return response || request
}
