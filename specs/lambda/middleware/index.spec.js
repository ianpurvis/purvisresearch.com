jest.mock('~/lambda/middleware/app.js')

import { App } from '~/lambda/middleware/app.js'
import { call as cacheControl } from '~/lambda/middleware/cache-control.js'
import { call as contentSecurityPolicy } from '~/lambda/middleware/content-security-policy.js'
import { call as headers } from '~/lambda/middleware/headers.js'
import { call as redirection } from '~/lambda/middleware/redirection.js'
import { handler } from '~/lambda/middleware/index.js'
import { originRequestEvent } from '~/specs/fixtures'

describe('handler(event)', () => {
  let event, result

  beforeEach(() => {
    App.mockClear()
  })

  describe('given a cloudfront origin request event', () => {
    beforeEach(() => {
      event = originRequestEvent
    })

    it([
      'creates an app with default middleware',
      'calls the app with the event request and response',
      'and returns the result'
    ].join(', '), async () => {
      const { request, response } = event.Records[0].cf
      App.prototype.call.mockResolvedValue(request)
      result = handler(event)
      await expect(result).resolves.toBe(request)
      expect(App)
        .toHaveBeenCalledWith(expect.arrayContaining([
          redirection,
          headers,
          cacheControl,
          contentSecurityPolicy
        ]))
      expect(App.prototype.call)
        .toHaveBeenCalledWith({ request, response })
    })
  })
})
