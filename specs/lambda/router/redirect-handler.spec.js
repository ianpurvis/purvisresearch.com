import { handler } from '~/lambda/router/redirect-handler.js'

describe('handler', () => {
  describe('given a redirectable request', () => {
    const given = {
      Records: [{
        cf: {
          request: {
            method: 'GET',
            uri: '/sept_2017.html'
          },
          response: {
            status: '200'
          }
        }
      }]
    }
    it('returns a response with 301 status', async () => {
      const response = await handler(given)
      expect(response).toMatchObject({
        status: '301'
      })
    })
    it('returns a response with empty body', async () => {
      const response = await handler(given)
      expect(response).not.toHaveProperty('body')
    })
    it('returns a response with empty body', async () => {
      const response = await handler(given)
      expect(response).toMatchObject({
        headers: {
          "Location": "/2017/sept.html"
        }
      })
    })
  })

  describe('given a non-redirectable request', () => {
    const given = {
      Records: [{
        cf: {
          request: {
            method: 'GET',
            uri: '/'
          },
          response: {
            status: '200'
          }
        }
      }]
    }
    it('returns the upstream response', async () => {
      const response = await handler(given)
      expect(response).toMatchObject(given.Records[0].cf.response)
    })
  })
})
