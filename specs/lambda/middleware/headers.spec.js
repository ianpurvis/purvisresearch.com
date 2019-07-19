import { Headers } from '~/lambda/middleware/headers.js'

describe('Headers', () => {
  let subject

  beforeEach(() => {
    subject = new Headers()
  })

  describe('call({ request, response })', () => {
    let request, response, result

    describe('given a request and a response', () => {
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
        result = await subject.call({ request, response })
        expect(result.request).toBe(request)
      })
      it('returns the response with a Referrer-Policy header', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "referrer-policy": [
              {
                "key": "Referrer-Policy",
                "value": "no-referrer-when-downgrade",
              },
            ],
          }
        })
      })
      it('returns the response with a Strict-Transport-Policy header', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "strict-transport-security": [
              {
                "key": "Strict-Transport-Security",
                "value": "max-age=31556952; includeSubdomains; preload",
              },
            ],
          }
        })
      })
      it('returns the response with a X-Content-Type-Options header', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "x-content-type-options": [
              {
                "key": "X-Content-Type-Options",
                "value": "nosniff",
              },
            ],
          }
        })
      })
      it('returns the response with a X-Frame-Options header', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "x-frame-options": [
              {
                "key": "X-Frame-Options",
                "value": "DENY",
              },
            ],
          }
        })
      })
      it('returns the response with a X-XSS-Protection header', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "x-xss-protection": [
              {
                "key": "X-XSS-Protection",
                "value": "1; mode=block",
              },
            ],
          }
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
        result = await subject.call({ request, response })
        expect(result.request).toBe(request)
      })
      it('returns an undefined response', async () => {
        result = await subject.call({ request, response })
        expect(result.response).toBeUndefined()
      })
    })
  })
})

