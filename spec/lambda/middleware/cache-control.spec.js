import { CacheControl } from '~/lambda/middleware/cache-control.js'

describe('CacheControl', () => {
  let subject

  beforeEach(() => {
    subject = new CacheControl()
  })
  describe('call({ request, response })', () => {
    let request, response, result

    beforeEach(() => {
      jest.spyOn(subject, 'cacheControlFor')
    })
    describe('given a request and a response', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/example.html'
        })
        response = {
          status: '200'
        }
        subject.cacheControlFor.mockReturnValue('example')
      })
      it('returns the unmodified request', async () => {
        result = await subject.call({ request, response })
        expect(subject.cacheControlFor).toBeCalled()
        expect(result.request).toBe(request)
      })
      it('returns the response with a Cache-Control header', async () => {
        result = await subject.call({ request, response })
        expect(subject.cacheControlFor).toBeCalled()
        expect(result.response).toMatchObject({
          status: '200',
          headers: {
            "cache-control": [
              {
                "key": "Cache-Control",
                "value": "example",
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

  describe('cacheControlFor({ request, response })', () => {
    let request, response, result
    describe('given a request where uri starts with /_/', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/_/images/example.png'
        })
        response = Object.freeze({
          status: '200'
        })
      })
      it('returns public, max-age=31556952', () => {
        result = subject.cacheControlFor({ request, response })
        expect(result).toBe("public, max-age=31556952")
      })
    })
    describe('given a request where uri does not start with /_/', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/example.html'
        })
        response = Object.freeze({
          status: '200'
        })
      })
      it('returns public, max-age=0', () => {
        result = subject.cacheControlFor({ request, response })
        expect(result).toBe("public, max-age=0")
      })
    })
    describe('given a response where status is 301', () => {
      beforeEach(() => {
        request = Object.freeze({
          method: 'GET',
          uri: '/example.html'
        })
        response = Object.freeze({
          status: '301'
        })
      })
      it('returns public, max-age=31556952', () => {
        result = subject.cacheControlFor({ request, response })
        expect(result).toBe("public, max-age=31556952")
      })
    })
  })
})
