import { call } from '~/lambda/middleware/headers.js'

describe('call', () => {
  describe('given a request', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/'
      },
      response: {
        status: '200'
      }
    }
    it('returns a response with status', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        status: '200'
      })
    })
    it('returns a response with Cache-Control', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

    it('returns a response with Referrer-Policy', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

    it('returns a response with Strict-Transport-Policy', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

    it('returns a response with X-Content-Type-Options', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

    it('returns a response with X-Frame-Options', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

    it('returns a response with X-XSS-Protection', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

  describe('given an asset request', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/_/images/example.png'
      },
      response: {
        status: '200'
      }
    }
    it('returns a response with Cache-Control', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
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

