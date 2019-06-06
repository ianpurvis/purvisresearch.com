
function LambdaEdgeHeaders(headers) {
  return Object.entries(headers)
    .reduce((result, [key, value]) => ({
      ...result, [key.toLowerCase()]: [{ key, value }]
    }), {})
}

module.exports = { LambdaEdgeHeaders }
