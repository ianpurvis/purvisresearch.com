'use strict'

const middleware = require('./middleware')

exports.handler = async function(event) {
  let { request, response } = event.Records[0].cf

  for (const { call } of Object.values(middleware)) {
    response = await call({ request, response })
  }

  return response
}
