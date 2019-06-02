import { handler } from '~/lambda/router/redirect-handler.js'
import { event, eventThatNeedsRedirection } from '~/specs/fixtures'

describe('handler', () => {
  describe('given a redirectable request', () => {
    const given = eventThatNeedsRedirection

    it('returns a response with 301 status', async () => {
      const response = await handler(given)
      expect(response).toMatchObject({
        statusCode: 301
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
    const given = event

    it('returns the upstream response', async () => {
      const response = await handler(given)
      expect(response).toMatchObject(given.Records[0].cf.response)
    })
  })
})
