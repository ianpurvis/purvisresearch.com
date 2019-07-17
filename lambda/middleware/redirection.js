import { LambdaEdgeHeaders } from './util.js'

const redirects = [
  {
    path: /\/sept_2017.html/,
    location: '/2017/sept.html',
  }, {
    path: /\/oct_2017.html/,
    location: '/2017/oct.html',
  }, {
    path: /\/nov_2017.html/,
    location: '/2017/nov.html',
  }
]

async function call({ request, response }) {
  const { uri } = request
  const { location } = redirects.find(({ path }) => uri.match(path)) || {}

  if (location) {
    response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: LambdaEdgeHeaders({
        'Location': location
      })
    }
  }

  return { request, response }
}

export { call }
