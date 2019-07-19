import { Redirection } from '~/lambda/middleware/redirection.js'

describe('Redirection', () => {
  let subject

  beforeEach(() => {
    subject = new Redirection()
  })

  describe('constructor(redirects)', () => {
    it('initializes redirects as specified', () => {
      const redirects = [ 'example' ]
      subject = new Redirection(redirects)
      expect(subject.redirects).toBe(redirects)
    })
  })

  describe('call({ request, response })', () => {
    let request, response, result

    describe('given a request only', () => {
      describe('when request is redirectable', () => {
        beforeEach(() => {
          request = Object.freeze({
            method: 'GET',
            uri: '/sept_2017.html'
          })
          response = undefined
        })
        it('returns the unmodified request', async () => {
          result = await subject.call({ request, response })
          expect(result.request).toBe(request)
        })
        it('returns a redirect response', async () => {
          result = await subject.call({ request, response })
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
      describe('when request is not redirectable', () => {
        beforeEach(() => {
          request = Object.freeze({
            method: 'GET',
            uri: '/'
          })
          response = undefined
        })
        it('returns the unmodified request', async () => {
          result = await subject.call({ request, response })
          expect(result.request).toBe(request)
        })
        it('returns the unmodified response', async () => {
          result = await subject.call({ request, response })
          expect(result.response).toBe(response)
        })
      })
    })
  })
})
