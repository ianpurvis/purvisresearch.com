import { handler } from '~/lambda/middleware/index.js'
import { event, eventThatNeedsRedirection } from '~/specs/fixtures'

describe('handler', () => {
  describe('given an event', () => {
    const given = event
    it('returns a response with status', async () => {
      const response = await handler(given)
      expect(response).toMatchObject({
        status: '200'
      })
    })
  })
  describe('given an event that needs redirection', () => {
    const given = eventThatNeedsRedirection
    it('returns a response with status', async () => {
      const response = await handler(given)
      expect(response).toMatchObject({
        status: '301'
      })
    })
  })
})
