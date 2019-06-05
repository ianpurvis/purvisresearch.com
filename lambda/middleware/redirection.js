'use strict'

const redirects = [
  {
    path: /sept_2017.html$/,
    location: '/2017/sept.html',
  }, {
    path: /oct_2017.html$/,
    location: '/2017/oct.html',
  }, {
    path: /nov_2017.html$/,
    location: '/2017/nov.html',
  }
]

function filterReadOnlyHeaders(headers) {
  // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-header-restrictions
  let matcher = /^(Via|Transfer-Encoding)$/i

  return Object.entries(headers)
    .filter(([key, ]) => matcher.test(key))
    .reduce((result, [key, value]) => ({
      ...result, [key]: value
    }), {})
}

async function call({ request, response }) {
  const redirect = redirects.find(({path}) => request.uri.match(path))

  if (!redirect) return response

  let headers = {
    'Location': redirect.location
  }

  // Prepare structured header object:
  headers = Object.entries(headers)
    .reduce((result, [key, value]) => ({
      ...result, [key.toLowerCase()]: [{ key, value }]
    }), {})

  return {
    status: '301',
    headers: {
      ...filterReadOnlyHeaders(response.headers || {}),
      ...headers,
    }
  }
}

module.exports = { call }
