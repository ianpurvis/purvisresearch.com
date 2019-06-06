import { call } from '~/lambda/middleware/redirection.js'

describe('call', () => {
  describe('given a redirectable request', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/sept_2017.html'
      },
      response: {
        status: '200'
      }
    }
    it('returns a response with 301 status', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        status: '301',
        statusDescription: 'Moved Permanently'
      })
    })
    it('returns a response with empty body', async () => {
      const response = await call(given)
      expect(response).not.toHaveProperty('body')
    })
    it('returns a response with Location header', async () => {
      const response = await call(given)
      expect(response).toMatchObject({
        headers: {
          'location': [{
            key: 'Location',
            value: 'https://purvisresearch.com/2017/sept.html'
          }]
        }
      })
    })
    describe('given read-only headers for cloudfront origin response events', () =>{
      it('returns a response with untouched read-only headers', async () => {
        const eventWithReadonlyHeaders = {
          ...given,
          response: {
            ...given.response,
            headers: {
              ...given.response.headers,
              'transfer-encoding': [{
                key: 'Transfer-Encoding',
                value: 'exmaple'
              }],
              'via': [{
                key: 'Via',
                value: 'example'
              }]
            }
          }
        }
        const response = await call(eventWithReadonlyHeaders)
        expect(response).toMatchObject({
          headers: eventWithReadonlyHeaders.response.headers
        })
      })
    })
  })

  describe('given a non-redirectable request', () => {
    const given = {
      request: {
        method: 'GET',
        uri: '/'
      },
      response: {
        status: '200'
      }
    }
    it('returns the upstream response', async () => {
      const response = await call(given)
      expect(response).toMatchObject(given.response)
    })
  })
})
