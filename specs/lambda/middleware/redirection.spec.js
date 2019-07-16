import { call } from '~/lambda/middleware/redirection.js'

describe('call({ request, response })', () => {
  let request, response, result

  describe('given a redirectable request and no response', () => {
    beforeEach(() => {
      request = Object.freeze({
        method: 'GET',
        uri: '/sept_2017.html'
      })
      response = undefined
    })
    it('returns the unmodified request', async () => {
      result = await call({ request, response })
      expect(result.request).toBe(request)
    })
    it('returns a redirect response', async () => {
      result = await call({ request, response })
      expect(result.response).toStrictEqual({
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          'location': [{
            key: 'Location',
            value: '/2017/sept.html'
          }]
        }
        // Note, no body
      })
    })
  })

  describe('given a non-redirectable request only', () => {
    beforeEach(() => {
      request = Object.freeze({
        method: 'GET',
        uri: '/'
      })
      response = undefined
    })
    it('returns the unmodified request', async () => {
      result = await call({ request, response })
      expect(result.request).toBe(request)
    })
    it('returns the unmodified response', async () => {
      result = await call({ request, response })
      expect(result.response).toBe(response)
    })
  })
})
