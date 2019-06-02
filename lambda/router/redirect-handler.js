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

exports.handler = async function(event) {
  const { request, response } = event.Records[0].cf

  const redirect = redirects.find(({path}) => request.uri.match(path))

  if (redirect) {
    return {
      status: '301',
      headers: {
        Location: redirect.location
      }
    }
  }

  return response
}
