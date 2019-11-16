import { S6 } from '~/lib/s6'
import { onRequest } from '~/lib/proxy'
import * as fixtures from '~/spec/fixtures/api-gateway'

jest.mock('~/lib/s6')

const requests = Object.values(fixtures)
  .map(request => [ request.resource, request ])

describe('onRequest(request)', () => {
  describe.each(requests)('given a %s resource request', (resource, request) => {
    let mocks, result

    beforeEach(() => {
      mocks = {
        error: new Error('mock-error'),
        response: 'mock-response'
      }
      mocks.s6 = {
        handle: jest.fn().mockReturnValue(mocks.response)
      }
      S6.mockImplementation(() => mocks.s6)
    })
    describe('when environment defines S3_BUCKET and S3_DEFAULT_OBJECT_KEY', () => {
      beforeEach(() => {
        global.process.env = {
          S3_BUCKET: 'mock-bucket-name',
          S3_DEFAULT_OBJECT_KEY: 'mock-object-key'
        }
      })
      it('creates a new instance of S6', async () => {
        await onRequest(request)
        const {
          S3_BUCKET: bucketName,
          S3_DEFAULT_OBJECT_KEY: defaultObjectKey
        } = global.process.env
        expect(S6).toHaveBeenCalledWith({ bucketName, defaultObjectKey })
      })
      it('calls the S6 handler with the request', async () => {
        await onRequest(request)
        const { httpMethod, path, headers } = request
        expect(mocks.s6.handle)
          .toHaveBeenCalledWith({ httpMethod, path, headers })
      })
      describe('when the S6 handler resolves with a response', () => {
        it('returns the response', async () => {
          result = onRequest(request)
          await expect(result).resolves.toBe(mocks.response)
        })
      })
      describe('when the S6 handler rejects with an error', () => {
        it('rejects with the error', async () => {
          mocks.s6.handle.mockImplementation(() => { throw mocks.error })
          result = onRequest(request)
          await expect(result).rejects.toThrow(mocks.error)
        })
      })
    })
    describe('when environment does not define S3_BUCKET', () => {
      beforeEach(() => {
        global.process.env = {
          S3_DEFAULT_OBJECT_KEY: 'mock-object-key'
        }
      })
      it('rejects with an error', async () => {
        result = onRequest(request)
        await expect(result).rejects.toThrow()
      })
    })
    describe('when environment does not define S3_DEFAULT_OBJECT_KEY', () => {
      beforeEach(() => {
        global.process.env = {
          S3_BUCKET: 'mock-bucket-name'
        }
      })
      it('rejects with an error', async () => {
        result = onRequest(request)
        await expect(result).rejects.toThrow()
      })
    })
  })
})
