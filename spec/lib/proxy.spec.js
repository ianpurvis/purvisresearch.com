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
        ContentType: 'mock-content-type',
        ETag: 'mock-etag',
        LastModified: new Date(),
      },
      env: {
        S3_DEFAULT_OBJECT_KEY: 'mock-object-key',
        S3_BUCKET: 'mock-bucket-name'
      },
      getObjectRequest: {
        promise: jest.fn(async () => mocks.data)
      },
      headObjectRequest: {
        promise: jest.fn(async () => mocks.data)
      },
      s3: {
        getObject: jest.fn(() => mocks.getObjectRequest),
        headObject: jest.fn(() => mocks.headObjectRequest)
      }
    }
    global.process.env = mocks.env
    S3.mockImplementation(() => mocks.s3)
  })

  describe('given a request from /{proxy+}', () => {
    beforeEach(() => {
      request = proxyRequest
    })
    describe('when object successfully fetched from S3', () => {
      beforeEach(async () => {
        response = await onRequest(request)

        // Ensure mocking was properly called:
        const s3params = {
          Key: request.pathParameters.proxy,
          Bucket: mocks.env.S3_BUCKET
        }
        expect(mocks.s3.headObject).toHaveBeenCalledWith(s3params)
        expect(mocks.headObjectRequest.promise).toHaveBeenCalled()
        expect(mocks.s3.getObject).toHaveBeenCalledWith(s3params)
        expect(mocks.getObjectRequest.promise).toHaveBeenCalled()
      })
      describe('returns a response where', () => {
        it('integrable with api gateway lambda proxy', () => {
          expect(response).toBeApiGatewayProxyResponse()
        })
        it('status code is 200', () => {
          expect(response).toHaveProperty('statusCode', 200)
        })
        it('body is the object data encoded as a base64 string', () => {
          const base64data = mocks.data.Body.toString('base64')
          expect(response.body).toBe(base64data)
          expect(response.isBase64Encoded).toBe(true)
        })
        it('Content-Type is the object content type', () => {
          expect(response.headers).toHaveProperty('Content-Type', mocks.data.ContentType)
        })
        it('ETag is the object ETag', () => {
          expect(response.headers).toHaveProperty('ETag', mocks.data.ETag)
        })
        it('Last-Modified is the object last modfified date formatted as an HTTP date', () => {
          const httpDate = mocks.data.LastModified.toUTCString()
          expect(response.headers).toHaveProperty('Last-Modified', httpDate)
        })
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
        const s3params = {
          Key: mocks.env.S3_DEFAULT_OBJECT_KEY,
          Bucket: mocks.env.S3_BUCKET
        }
        expect(mocks.s3.headObject).toHaveBeenCalledWith(s3params)
        expect(mocks.headObjectRequest.promise).toHaveBeenCalled()
        expect(mocks.s3.getObject).toHaveBeenCalledWith(s3params)
        expect(mocks.getObjectRequest.promise).toHaveBeenCalled()
      })
      describe('returns a response where', () => {
        it('integrable with api gateway lambda proxy', () => {
          expect(response).toBeApiGatewayProxyResponse()
        })
        it('status code is 200', () => {
          expect(response).toHaveProperty('statusCode', 200)
        })
        it('body is the object data encoded as a base64 string', () => {
          const base64data = mocks.data.Body.toString('base64')
          expect(response.body).toBe(base64data)
          expect(response.isBase64Encoded).toBe(true)
        })
        it('Content-Type is the object content type', () => {
          expect(response.headers).toHaveProperty('Content-Type', mocks.data.ContentType)
        })
        it('ETag is the object ETag', () => {
          expect(response.headers).toHaveProperty('ETag', mocks.data.ETag)
        })
        it('Last-Modified is the object last modfified date formatted as an HTTP date', () => {
          const httpDate = mocks.data.LastModified.toUTCString()
          expect(response.headers).toHaveProperty('Last-Modified', httpDate)
        })
      })
    })
  })
})
