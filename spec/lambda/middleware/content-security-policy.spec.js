import { ContentSecurityPolicy } from '~/lambda/middleware/content-security-policy.js'

describe('ContentSecurityPolicy', () => {
  let subject

  beforeEach(() => {
    subject = new ContentSecurityPolicy()
  })

  describe('call({ request, response })', () => {
    let request, response, result

    describe('given a request and a response', () => {
      describe('when response is html', () => {
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
          subject.formatPolicy = jest.fn().mockReturnValue('mockFormattedPolicy')
        })
        it('returns the unmodified request', async () => {
          result = await subject.call({ request, response })
          expect(result.request).toBe(request)
        })
        it('returns the response with a Content-Security-Policy header', async () => {
          result = await subject.call({ request, response })
          expect(subject.formatPolicy).toHaveBeenCalledWith(subject.policy)
          expect(result.response).toMatchObject(response)
          expect(result.response).toMatchObject({
            headers: {
              'content-security-policy': [
                {
                  'key': 'Content-Security-Policy',
                  'value': 'mockFormattedPolicy'
                },
              ],
            }
          })
        })
      })
      describe('when response is not html', () => {
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
          result = await subject.call({ request, response })
          expect(result.request).toBe(request)
        })
        it('returns the unmodified response', async () => {
          result = await subject.call({ request, response })
          expect(result.response).toBe(response)
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

  describe('formatPolicy(policy)', () => {
    let policy, result

    it('collapses and trims whitespace', () => {
      policy = `
        base-uri
          'none';
      `
      result = subject.formatPolicy(policy)
      expect(result).toBe('base-uri \'none\';')
    })
  })

  describe('isHtml(response)', () => {
    let response, result
    describe('when response Content-Type is text/html; charset=utf-8', () => {
      it('returns true', () => {
        response = {
          status: '200',
          headers: {
            'content-type': [{
              key: 'Content-Type',
              value: 'text/html; charset=utf-8'
            }]
          }
        }
        result = subject.isHtml(response)
        expect(result).toBe(true)
      })
    })
    describe('when response Content-Type is text/html', () => {
      it('returns true', () => {
        response = {
          status: '200',
          headers: {
            'content-type': [{
              key: 'Content-Type',
              value: 'text/html'
            }]
          }
        }
        result = subject.isHtml(response)
        expect(result).toBe(true)
      })
    })
    describe('when response Content-Type is not html', () => {
      it('returns false', () => {
        response = {
          status: '200',
          headers: {
            'content-type': [{
              key: 'Content-Type',
              value: 'image/png'
            }]
          }
        }
        result = subject.isHtml(response)
        expect(result).toBe(false)
      })
    })
    describe('when response does not have a Content-Type', () => {
      it('returns false', () => {
        response = {
          status: '200'
        }
        result = subject.isHtml(response)
        expect(result).toBe(false)
      })
    })
  })
})
