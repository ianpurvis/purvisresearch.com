import S3 from 'aws-sdk/clients/s3'
import * as HttpMethods from '~/lib/http-methods'
import { S6, S6Error } from '~/lib/s6'

jest.mock('aws-sdk/clients/s3')

describe('S6', () => {
  let s6, mocks, spies

  beforeEach(() => {
    mocks = {
      bucketName: 'mock-bucket-name',
      indexFileName: 'mock-file-name',
    }
    spies = []
  })

  describe('constructor(options)', () => {
    describe('when options do not define bucketName', () => {
      it('throws an error', () => {
        delete mocks.bucketName
        expect(() => new S6(mocks)).toThrow(S6Error)
      })
    })
    describe('when options define indexFileName', () => {
      it('initializes indexFileName', () => {
        s6 = new S6(mocks)
        expect(s6.indexFileName).toBe(mocks.indexFileName)
      })
    })
    describe('when options do not define indexFileName', () => {
      it('defaults to index.html', () => {
        delete mocks.indexFileName
        s6 = new S6(mocks)
        expect(s6.indexFileName).toBe('index.html')
      })
    })
  })

  describe('keyForPath(path)', () => {
    let path, result

    beforeEach(() => {
      s6 = new S6(mocks)
    })
    describe("when path ends with '/'", () => {
      it('returns .indexFileName appended to the path with the root removed', () => {
        path = '/example/'
        result = s6.keyForPath(path)
        expect(result).toBe(`example/${s6.indexFileName}`)
      })
    })
    describe('when path ends with a file name', () => {
      it('returns the path with the root removed', () => {
        path = '/example.html'
        result = s6.keyForPath(path)
        expect(result).toBe('example.html')
      })
    })
  })

  describe('resourceForPath(path)', () => {
    let path, result

    beforeEach(() => {
      mocks = {
        ...mocks,
        key: 'mock-key',
        objectData: {
          Body: 'mock-body',
          ContentType: 'mock-content-type',
          ETag: 'mock-etag',
          LastModified: new Date(),
        },
        objectError: new Error('mock-error'),
        objectRequest: {
          promise: jest.fn()
        },
        s3: {
          getObject: jest.fn(() => mocks.objectRequest),
        }
      }
      S3.mockImplementation(() => mocks.s3)
      s6 = new S6(mocks)
      jest.spyOn(s6, 'keyForPath').mockReturnValue(mocks.key)

      path = '/example.html'
    })
    afterEach(() => {
      s6.keyForPath.mockRestore()
    })
    it('creates an s3 get-object request with the key for the path', async () => {
      await s6.resourceForPath(path)
      expect(s6.keyForPath).toHaveBeenCalledWith(path)
      expect(mocks.s3.getObject).toHaveBeenCalledWith({ Key: mocks.key })
      expect(mocks.objectRequest.promise).toHaveBeenCalled()
    })
    describe('when the request resolves with an object', () => {
      it('resolves with the object data', async () => {
        mocks.objectRequest.promise
          .mockImplementation(async () => mocks.objectData)
        result = s6.resourceForPath(path)
        await expect(result).resolves.toBe(mocks.objectData)
      })
    })
    describe('when the request rejects with an error', () => {
      it('rejects with the error', async () => {
        mocks.objectRequest.promise
          .mockImplementation(async () => { throw mocks.objectError })
        result = s6.resourceForPath(path)
        await expect(result).rejects.toThrow(mocks.objectError)
      })
    })
  })


  describe('handle({ httpMethod, path, headers })', () => {
    const { GET, HEAD, ...unallowedMethods } = HttpMethods

    let headers, path, response, result

    beforeEach(() => {
      s6 = new S6(mocks)
      spies = [
        'methodNotAllowedResponse',
        'resourceForPath',
        'isNotModified',
        'notModifiedResponse',
        'headResponse',
        'getResponse',
      ].map(methodName => jest
        .spyOn(s6, methodName)
        .mockImplementation(() => undefined)
      )
      headers = 'mock-headers'
      path = 'mock-path'
      response = 'mock-response'
    })
    afterEach(() => {
      spies.forEach(spy => spy.mockRestore())
    })
    describe.each(
      Object.values(unallowedMethods)
    )('when the http method is %s', httpMethod => {
      it('returns a METHOD NOT ALLOWED response', async () => {
        s6.methodNotAllowedResponse.mockReturnValue(response)

        result = s6.handle({ headers, httpMethod, path })
        await expect(result).resolves.toBe(response)
        expect(s6.methodNotAllowedResponse)
          .toHaveBeenCalledWith([ HEAD, GET ])
      })
    })
    describe('when the http method is HEAD', (httpMethod = HEAD) => {
      it('requests the s3 resource for the path', async () => {
        await s6.handle({ headers, httpMethod, path })
        expect(s6.resourceForPath)
          .toHaveBeenCalledWith(path)
      })
      describe('when the s3 request rejects with an error', () => {
        let error

        it('rejects with the error', async () => {
          error = new Error('mock-error')
          s6.resourceForPath.mockImplementation(async () => { throw error })
          result = s6.handle({ headers, httpMethod, path })
          await expect(result).rejects.toThrow(error)
        })
      })
      describe('when the s3 request resolves with a resource', () => {
        let resource

        beforeEach(() => {
          resource = 'mock-resource'
          s6.resourceForPath.mockResolvedValue(resource)
        })
        describe('when the resource is not modified', () => {
          it('returns a NOT MODIFIED response', async () => {
            s6.isNotModified.mockReturnValue(true)
            s6.notModifiedResponse.mockReturnValue(response)

            result = s6.handle({ headers, httpMethod, path })
            await expect(result).resolves.toBe(response)
            expect(s6.isNotModified).toHaveBeenCalledWith({ resource, headers })
            expect(s6.notModifiedResponse).toHaveBeenCalledWith(resource)
          })
        })
        describe('when the resource has been modified', () => {
          it('returns a SUCCESS response', async () => {
            s6.isNotModified.mockReturnValue(false)
            s6.headResponse.mockReturnValue(response)

            result = s6.handle({ headers, httpMethod, path })
            await expect(result).resolves.toBe(response)
            expect(s6.isNotModified).toHaveBeenCalledWith({ resource, headers })
            expect(s6.headResponse).toHaveBeenCalledWith(resource)
          })
        })
      })
    })
    describe('when the http method is GET', (httpMethod = GET) => {
      it('requests the s3 resource for the path', async () => {
        await s6.handle({ headers, httpMethod, path })
        expect(s6.resourceForPath)
          .toHaveBeenCalledWith(path)
      })
      describe('when the s3 request rejects with an error', () => {
        let error

        it('rejects with the error', async () => {
          error = new Error('mock-error')
          s6.resourceForPath.mockImplementation(async () => { throw error })
          result = s6.handle({ headers, httpMethod, path })
          await expect(result).rejects.toThrow(error)
        })
      })
      describe('when the s3 request resolves with a resource', () => {
        let resource

        beforeEach(() => {
          resource = 'mock-resource'
          s6.resourceForPath.mockResolvedValue(resource)
        })
        describe('when the resource is not modified', () => {
          it('returns a NOT MODIFIED response', async () => {
            s6.isNotModified.mockReturnValue(true)
            s6.notModifiedResponse.mockReturnValue(response)

            result = s6.handle({ headers, httpMethod, path })
            await expect(result).resolves.toBe(response)
            expect(s6.isNotModified).toHaveBeenCalledWith({ resource, headers })
            expect(s6.notModifiedResponse).toHaveBeenCalledWith(resource)
          })
        })
        describe('when the resource has been modified', () => {
          it('returns a GET response', async () => {
            s6.isNotModified.mockReturnValue(false)
            s6.getResponse.mockReturnValue(response)

            result = s6.handle({ headers, httpMethod, path })
            await expect(result).resolves.toBe(response)
            expect(s6.isNotModified).toHaveBeenCalledWith({ resource, headers })
            expect(s6.getResponse).toHaveBeenCalledWith(resource)
          })
        })
      })
    })
  })

  describe('isNotModified({ resource, headers })', () => {
    let resource, headers, result

    beforeEach(() => {
      resource = {
        ETag: 'mock-etag',
        LastModified: new Date('Sat, 23 Nov 2019 00:00:00 GMT'),
      }
    })
    describe('when neither If-None-Match or If-Modified-Since are defined', () => {
      beforeEach(() => {
        headers = {}
      })
      it('it returns false', () => {
        result = s6.isNotModified({ resource, headers })
        expect(result).toBe(false)
      })
    })
    describe('when both If-None-Match and If-Modified-Since are defined', () => {
      describe('when resource matches', () => {
        describe('when resource not modified since', () => {
          it('it returns true', () => {
            headers = {
              'If-None-Match': resource.ETag,
              'If-Modified-Since': resource.LastModified.toUTCString()
            }
            result = s6.isNotModified({ resource, headers })
            expect(result).toBe(true)
          })
        })
        describe('when resource modified since', () => {
          it('it returns false', () => {
            headers = {
              'If-None-Match': resource.ETag,
              'If-Modified-Since': new Date(resource.LastModified - 1).toUTCString()
            }
            result = s6.isNotModified({ resource, headers })
            expect(result).toBe(false)
          })
        })
      })
      describe('when resource does not match', () => {
        it('it returns false', () => {
          headers = {
            'If-None-Match': 'mock-etag-that-does-not-match',
            'If-Modified-Since': resource.LastModified.toUTCString()
          }
          result = s6.isNotModified({ resource, headers })
          expect(result).toBe(false)
        })
      })
    })
    describe('when If-None-Match is defined', () => {
      describe('when resource matches', () => {
        it('it returns true', () => {
          headers = {
            'If-None-Match': resource.ETag
          }
          result = s6.isNotModified({ resource, headers })
          expect(result).toBe(true)
        })
      })
      describe('when resource does not match', () => {
        it('it returns false', () => {
          headers = {
            'If-None-Match': 'mock-etag-that-does-not-match'
          }
          result = s6.isNotModified({ resource, headers })
          expect(result).toBe(false)
        })
      })
    })
    describe('when If-Modified-Since is defined', () => {
      describe('when resource not modified since', () => {
        it('it returns true', () => {
          headers = {
            'If-Modified-Since': resource.LastModified.toUTCString()
          }
          result = s6.isNotModified({ resource, headers })
          expect(result).toBe(true)
        })
      })
      describe('when resource modified since', () => {
        it('it returns false', () => {
          headers = {
            'If-Modified-Since': new Date(resource.LastModified - 1).toUTCString()
          }
          result = s6.isNotModified({ resource, headers })
          expect(result).toBe(false)
        })
      })
    })
  })

  describe('headResponse(resource)', () => {
    let resource, response

    beforeEach(() => {
      resource = {
        Body: 'mock-body',
        ContentLength: 'mock-content-length',
        ContentType: 'mock-content-type',
        ETag: 'mock-etag',
        LastModified: new Date(),
      }
    })
    describe('returns a response where', () => {
      beforeEach(() => {
        response = s6.headResponse(resource)
      })
      it('integrable with api gateway lambda proxy', () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('status code is 200', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })
      it('body is empty', () => {
        expect(response.body).toBeUndefined()
      })
      it('Content-Length is the resource content length', () => {
        expect(response.headers)
          .toHaveProperty('Content-Length', resource.ContentLength)
      })
      it('Content-Type is the resource content type', () => {
        expect(response.headers)
          .toHaveProperty('Content-Type', resource.ContentType)
      })
      it('ETag is the resource ETag', () => {
        expect(response.headers).toHaveProperty('ETag', resource.ETag)
      })
      it('Last-Modified is the resource last modfified date formatted as an HTTP date', () => {
        const httpDate = resource.LastModified.toUTCString()
        expect(response.headers).toHaveProperty('Last-Modified', httpDate)
      })
    })
  })

  describe('getResponse(resource)', () => {
    let resource, response

    beforeEach(() => {
      resource = {
        Body: 'mock-body',
        ContentType: 'mock-content-type',
        ETag: 'mock-etag',
        LastModified: new Date(),
      }
    })
    describe('returns a response where', () => {
      beforeEach(() => {
        response = s6.getResponse(resource)
      })
      it('integrable with api gateway lambda proxy', () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('status code is 200', () => {
        expect(response).toHaveProperty('statusCode', 200)
      })
      it('body is the resource data encoded as a base64 string', () => {
        const base64data = resource.Body.toString('base64')
        expect(response.body).toBe(base64data)
        expect(response.isBase64Encoded).toBe(true)
      })
      it('Content-Type is the resource content type', () => {
        expect(response.headers)
          .toHaveProperty('Content-Type', resource.ContentType)
      })
      it('ETag is the resource ETag', () => {
        expect(response.headers)
          .toHaveProperty('ETag', resource.ETag)
      })
      it('Last-Modified is the resource last modfified date formatted as an HTTP date', () => {
        const httpDate = resource.LastModified.toUTCString()
        expect(response.headers).toHaveProperty('Last-Modified', httpDate)
      })
    })
  })

  describe('methodNotAllowedResponse(allowed)', () => {
    let allowed, response

    beforeEach(() => {
      allowed = [
        'mock-method-one',
        'mock-method-two'
      ]
    })
    describe('returns a response where', () => {
      beforeEach(() => {
        response = s6.methodNotAllowedResponse(allowed)
      })
      it('integrable with api gateway lambda proxy', () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('status code is 405', () => {
        expect(response).toHaveProperty('statusCode', 405)
      })
      it('body is empty', () => {
        expect(response.body).toBeUndefined()
      })
      it('Allowed is allowed formatted as a comma-separated list', () => {
        expect(response.headers)
          .toHaveProperty('Allow', allowed.join(', '))
      })
    })
  })

  describe('notModifiedResponse(resource)', () => {
    let resource, response

    beforeEach(() => {
      resource = {
        ETag: 'mock-etag',
        LastModified: new Date(),
      }
    })
    describe('returns a response where', () => {
      beforeEach(() => {
        response = s6.notModifiedResponse(resource)
      })
      it('integrable with api gateway lambda proxy', () => {
        expect(response).toBeApiGatewayProxyResponse()
      })
      it('status code is 304', () => {
        expect(response).toHaveProperty('statusCode', 304)
      })
      it('body is empty', () => {
        expect(response.body).toBeUndefined()
      })
      it('Content-Length is null', () => {
        expect(response.headers)
          .toHaveProperty('Content-Length', null)
      })
      it('Content-Type is null', () => {
        expect(response.headers)
          .toHaveProperty('Content-Type', null)
      })
      it('ETag is the resource ETag', () => {
        expect(response.headers)
          .toHaveProperty('ETag', resource.ETag)
      })
      it('Last-Modified is the resource last modfified date formatted as an HTTP date', () => {
        const httpDate = resource.LastModified.toUTCString()
        expect(response.headers).toHaveProperty('Last-Modified', httpDate)
      })
    })
  })
})
