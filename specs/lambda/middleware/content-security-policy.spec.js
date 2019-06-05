import { call } from '~/lambda/middleware/content-security-policy.js'

describe('call', () => {
  describe('given an html response', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/'
      },
      response: {
        status: '200',
        headers: {
          'content-type': [{
            key: 'Content-Type',
            value: 'text/html; charset=utf-8'
          }]
        }
      }
    }
    it('returns a response with status', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        status: '200'
      })
    })
    it('returns a response with Content-Security-Policy', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        headers: {
          "content-security-policy": [
            {
              "key": "Content-Security-Policy",
              "value": "base-uri 'none'; connect-src 'self' https://www.google-analytics.com; default-src 'none'; frame-ancestors 'none'; font-src 'self' data:; form-action 'none'; img-src 'self' https://www.google-analytics.com; manifest-src 'self'; media-src 'self'; object-src 'none'; script-src 'self' 'sha256-V/WaLGhSS+tTPAMDVjFgErm2VGPm+tNBC1rdDJHVkZ0=' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'",
            },
          ],
        }
      })
    })
  })
  describe('given a non-html response', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/example.png'
      },
      response: {
        status: '200',
        headers: {
          'content-type': [{
            key: 'Content-Type',
            value: 'image/png'
          }]
        }
      }
    }
    it('returns a response with status', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        status: '200'
      })
    })
    it('returns a response with Content-Security-Policy', async () => {
      const response = await call(given)
      expect(response.headers).not.toHaveProperty('content-security-policy')
    })
  })
})

