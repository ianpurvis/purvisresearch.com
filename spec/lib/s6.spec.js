import S3 from 'aws-sdk/clients/s3'
import { S6, S6Error } from '~/lib/s6'

jest.mock('aws-sdk/clients/s3')

describe('S6', () => {
  let s6, mocks

  beforeEach(() => {
    mocks = {
      bucketName: 'mock-bucket-name',
      defaultObjectKey: 'mock-default-object-key',
      data: {
        Body: 'mock-body',
        ContentType: 'mock-content-type',
        ETag: 'mock-etag',
        LastModified: new Date(),
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
    S3.mockImplementation(() => mocks.s3)
  })

  describe('constructor(options)', () => {
    describe('when options do not define bucketName', () => {
      it('throws an error', () => {
        delete mocks.bucketName
        expect(() => new S6(mocks)).toThrow(S6Error)
      })
    })
    describe('when options do not define defaultObjectKey', () => {
      it('throws an error', () => {
        delete mocks.defaultObjectKey
        expect(() => new S6(mocks)).toThrow(S6Error)
      })
    })
  })

  describe('get({ path, headers })', () => {
    let path, headers, response

    beforeEach(() => {
      path = 'mock-path'
      headers = {}
      mocks = {
        ...mocks,
        key: 'mock-key',
        headResponse: {
          statusCode: 200
        }
      }
      s6 = new S6(mocks)
      jest.spyOn(s6, 'keyForPath').mockReturnValue(mocks.key)
      jest.spyOn(s6, 'head').mockReturnValue(mocks.headResponse)
    })
    afterEach(() => {
      [
        s6.keyForPath,
        s6.head
      ].forEach(spy => spy.mockRestore())
    })
    describe('when object successfully fetched from S3', () => {
      beforeEach(async () => {
        response = await s6.get({ path, headers })

        // Ensure mocking was properly called:
        expect(s6.keyForPath).toHaveBeenCalledWith(path)
        expect(s6.head).toHaveBeenCalledWith({ path, headers })
        expect(mocks.s3.getObject).toHaveBeenCalledWith({ Key: mocks.key })
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
