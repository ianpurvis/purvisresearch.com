import { handler } from '~/lambda/middleware/index.js'
import { event } from '~/specs/fixtures'

describe('handler', () => {
  describe('given an event', () => {
    it('returns a response with status', async () => {
      const response = await handler(event)
      expect(response).toMatchObject({
        status: '200'
      })
    })
  })
})
