'use strict'

const middleware = [
  './headers.js',
  './redirection.js'
].map(require)

exports.handler = async function(event) {
  let { request, response } = event.Records[0].cf

  for (const { call } of middleware) {
    response = await call({ request, response })
  }

  return response
}
