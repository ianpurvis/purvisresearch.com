// Mean Gregorian calendar year:
const SECONDS_PER_YEAR = 31556952

function LambdaEdgeHeaders(headers) {
  return Object.entries(headers)
    .reduce((result, [key, value]) => ({
      ...result, [key.toLowerCase()]: [{ key, value }]
    }), {})
}

module.exports = { LambdaEdgeHeaders, SECONDS_PER_YEAR }
