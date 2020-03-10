jest.mock('~/lambda/middleware/app.js')

import { App } from '~/lambda/middleware/app.js'
import { ContentSecurityPolicy } from '~/lambda/middleware/content-security-policy.js'
import { Headers } from '~/lambda/middleware/headers.js'
import { Redirection } from '~/lambda/middleware/redirection.js'
import { handler } from '~/lambda/middleware/index.js'
import { originRequestEvent } from '~/spec/fixtures'

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
          expect.any(Redirection),
          expect.any(Headers),
          expect.any(ContentSecurityPolicy)
        ]))
      expect(App.prototype.call)
        .toHaveBeenCalledWith({ request, response })
    })
  })
})
