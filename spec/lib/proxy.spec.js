import S3 from 'aws-sdk/clients/s3'
import { onRequest } from '~/lib/proxy'
import { proxyRequest, rootRequest } from '~/spec/fixtures/api-gateway'

jest.mock('aws-sdk/clients/s3')

describe('onRequest(request)', () => {
  let mocks, request, response

  beforeEach(() => {
    mocks = {
      data: {
        Body: 'mock-body',
        ContentType: 'mock-content-type'
      },
      env: {
        S3_DEFAULT_OBJECT_KEY: 'mock-object-key',
        S3_BUCKET: 'mock-bucket-name'
      },
      Request: {
        promise: jest.fn(async () => mocks.data)
      },
      S3: {
        getObject: jest.fn(() => mocks.Request)
      }
    }
    global.process.env = mocks.env
    S3.mockImplementation(() => mocks.S3)
  })

  describe('given a request from /{proxy+}', () => {
    beforeEach(() => {
      request = proxyRequest
    })
    describe('when object successfully fetched from S3', () => {
      beforeEach(async () => {
        response = await onRequest(request)

        // Ensure mocking was properly called:
        expect(mocks.S3.getObject).toHaveBeenCalledWith({
          Key: request.pathParameters.proxy,
          Bucket: mocks.env.S3_BUCKET
        })
        expect(mocks.Request.promise).toHaveBeenCalled()
      })
      it('returns a valid api gateway proxy response', () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('returns the base64-encoded object data in the response body', () => {
        const base64data = mocks.data.Body.toString('base64')
        expect(response.body).toBe(base64data)
        expect(response.isBase64Encoded).toBe(true)
      })
      it('returns the object Content-Type in the response headers', () => {
        expect(response.headers).toHaveProperty('Content-Type', mocks.data.ContentType)
      })
    })
  })
  describe('given a request from /', () => {
    beforeEach(() => {
      request = rootRequest
    })
    describe('when object successfully fetched from S3', () => {
      beforeEach(async () => {
        response = await onRequest(request)

        // Ensure mocking was properly called:
        expect(mocks.S3.getObject).toHaveBeenCalledWith({
          Key: mocks.env.S3_DEFAULT_OBJECT_KEY,
          Bucket: mocks.env.S3_BUCKET
        })
        expect(mocks.Request.promise).toHaveBeenCalled()
      })
      it('returns a valid api gateway proxy response', async () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('returns the base64-encoded object data in the response body', () => {
        const base64data = mocks.data.Body.toString('base64')
        expect(response.body).toBe(base64data)
        expect(response.isBase64Encoded).toBe(true)
      })
      it('returns the object Content-Type in the response headers', () => {
        expect(response.headers).toHaveProperty('Content-Type', mocks.data.ContentType)
      })
    })
  })
})
