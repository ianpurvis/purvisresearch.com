import { call } from '~/lambda/middleware/cache-control.js'

describe('call({ request, response })', () => {
  let request, response, result

  describe('given a request and a response', () => {
    describe('when request uri does not start with /_/', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/example.html'
        })
        response = {
          status: '200'
        }
      })
      it('returns the unmodified request', async () => {
        result = await call({ request, response })
        expect(result.request).toBe(request)
      })
      it('returns the response with a Cache-Control header, max-age zero', async () => {
        result = await call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "cache-control": [
              {
                "key": "Cache-Control",
                "value": "public, max-age=0",
              },
            ],
          }
        })
      })
    })
    describe('when request uri starts with /_/', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/_/images/example.png'
        }),
          response = {
            status: '200'
          }
      })
      it('returns the unmodified request', async () => {
        result = await call({ request, response })
        expect(result.request).toBe(request)
      })
      it('returns the response with a Cache-Control header, max-age 1 year', async () => {
        result = await call({ request, response })
        expect(result.response).toMatchObject({
          headers: {
            "cache-control": [
              {
                "key": "Cache-Control",
                "value": "public, max-age=31556952",
              },
            ],
          }
        })
      })
    })
  })
  describe('given a request only', () => {
    beforeEach(() => {
      request = Object.freeze({
        method: 'GET',
        uri: '/'
      }),
      response = undefined
    })
    it('returns the unmodified request', async () => {
      result = await call({ request, response })
      expect(result.request).toBe(request)
    })
    it('returns an undefined response', async () => {
      result = await call({ request, response })
      expect(result.response).toBeUndefined()
    })
  })
})

