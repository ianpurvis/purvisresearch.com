jest.mock('~/lambda/middleware/cache-control.js')
jest.mock('~/lambda/middleware/content-security-policy.js')
jest.mock('~/lambda/middleware/headers.js')
jest.mock('~/lambda/middleware/redirection.js')

import cacheControl from '~/lambda/middleware/cache-control.js'
import contentSecurityPolicy from '~/lambda/middleware/content-security-policy.js'
import headers from '~/lambda/middleware/headers.js'
import redirection from '~/lambda/middleware/redirection.js'
import { handler } from '~/lambda/middleware/index.js'
import { originRequestEvent } from '~/specs/fixtures'

describe('handler(event)', () => {
  let event, mocks, result

  describe('given a cloudfront origin request event', () => {
    beforeEach(() => {
      event = originRequestEvent
      mocks = {
        request: {
          example: 0
        },
        response: {
          example: 0
        }
      }

      ;[
        redirection,
        headers,
        cacheControl,
        contentSecurityPolicy,
      ].forEach(middleware => {
        middleware.call.mockResolvedValue(mocks)
      })
    })

    it('calls each middleware', async () => {
      await handler(event)
      const { request, response } = event.Records[0].cf
      expect(redirection.call).toHaveBeenCalledWith({ request, response })
      expect(headers.call).toHaveBeenCalledWith(mocks)
      expect(cacheControl.call).toHaveBeenCalledWith(mocks)
      expect(contentSecurityPolicy.call).toHaveBeenCalledWith(mocks)
    })

    describe('when the last middleware returns a request and a response', () => {
      it('returns the response', async () => {
        contentSecurityPolicy.call.mockResolvedValue({
          request: mocks.request,
          response: mocks.response
        })
        result = handler(event)
        await expect(result).resolves.toBe(mocks.response)
      })
    })

    describe('when the last middleware returns only a request', () => {
      it('returns the request', async () => {
        contentSecurityPolicy.call.mockResolvedValue({
          request: mocks.request,
          response: undefined
        })
        result = handler(event)
        await expect(result).resolves.toBe(mocks.request)
      })
    })
  })
})
