'use strict'

const { handler: headerHandler } = require('./header-handler.js')

exports.handler = async function(event) {

  let response = await headerHandler(event)
  return response
}
