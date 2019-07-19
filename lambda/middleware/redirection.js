import { LambdaEdgeHeaders } from './util.js'

const REDIRECTS = [
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

class Redirection {

  constructor(redirects = REDIRECTS) {
    this.redirects = redirects
  }

  async call({ request, response }) {
    const { uri } = request
    const { location } = this.redirects.find(({ path }) => uri.match(path)) || {}

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
}

export { Redirection }
