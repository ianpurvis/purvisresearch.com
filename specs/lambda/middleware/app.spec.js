import { App } from '~/lambda/middleware/app.js'

describe('App', () => {
  let app

  describe('constructor()', () => {
    it('initializes middleware to an empty array', () => {
      app = new App()
      expect(app.middleware).toEqual([])
    })
  })

  describe('constructor(middleware)', () => {
    it('initializes middleware as specified', () => {
      const middleware = [ 'test' ]
      app = new App(middleware)
      expect(app.middleware).toBe(middleware)
    })
  })

  describe('call({ request, response })', () => {
    let request, response, result

    beforeEach(() => {
      request = { example: 1 }
      response = { example: 2 }
      app = new App([
        jest.fn().mockReturnValue({ request, response })
      ])
    })

    describe('given a request and a response', () => {
      it('calls the first middleware with the request and response', async () => {
        result = app.call({ request, response })
        await expect(result).resolves
        expect(app.middleware[0])
          .toHaveBeenCalledWith({ request, response })
      })

      describe('when the last middleware returns a response', () => {
        it('returns the response', async () => {
          app.middleware[0].mockResolvedValue({ request, response })
          result = app.call({ request, response })
          await expect(result).resolves.toBe(response)
        })
      })

      describe('when the last middleware returns only a request', () => {
        it('returns the request', async () => {
          app.middleware[0].mockResolvedValue({ request })
          result = app.call({ request, response })
          await expect(result).resolves.toBe(request)
        })
      })
    })
  })
})
