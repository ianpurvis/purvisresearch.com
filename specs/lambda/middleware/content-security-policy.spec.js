import { call, policyForNuxt } from '~/lambda/middleware/content-security-policy.js'

describe('call({ request, response })', () => {
  let request, response, result
  describe('given a request and an html response', () => {
    beforeEach(() => {
      request = Object.freeze({
        method: 'GET',
        uri: '/example.html'
      })
      response = {
        status: '200',
        headers: {
          'content-type': [{
            key: 'Content-Type',
            value: 'text/html; charset=utf-8'
          }]
        }
      }
    })
    it('returns the unmodified request', async () => {
      result = await call({ request, response })
      expect(result.request).toBe(request)
    })
    it('returns the response with a Content-Security-Policy header', async () => {
      const policy = policyForNuxt()
      result = await call({ request, response })
      expect(result.response).toMatchObject(response)
      expect(result.response).toMatchObject({
        headers: {
          "content-security-policy": [
            {
              "key": "Content-Security-Policy",
              "value": policy
            },
          ],
        }
      })
    })
  })
  describe('given a request and a non-html response', () => {
    beforeEach(() => {
      request = Object.freeze({
        method: 'GET',
        uri: '/example.png'
      })
      response = Object.freeze({
        status: '200',
        headers: {
          'content-type': [{
            key: 'Content-Type',
            value: 'image/png'
          }]
        }
      })
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

