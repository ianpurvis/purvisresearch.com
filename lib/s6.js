import S3 from 'aws-sdk/clients/s3'
import { HEAD, GET } from './http-methods'

class S6Error extends Error {
  constructor(message, ...params) {
    super(`S6: ${message}`, ...params)
  }
}

/**
 * Simple Storage Service Static Site Server
 */
class S6 {

  constructor({ bucketName, indexFileName = 'index.html' }) {
    if (!bucketName) throw new S6Error('Argument key missing: bucketName')
    this.indexFileName = indexFileName
    this.s3 = new S3({
      params: {
        Bucket: bucketName
      }
    })
  }

  keyForPath(path) {
    return path
      .replace(/\/$/, `/${this.indexFileName}`)
      .slice(1)
  }

  async resourceForPath(path) {
    const Key = this.keyForPath(path)
    return this.s3.getObject({ Key }).promise()
  }

  async handle({ httpMethod, path, headers }) {
    const allowedMethods = [ HEAD, GET ]

    if (!allowedMethods.includes(httpMethod))
      return this.methodNotAllowedResponse(allowedMethods)

    try {
      const resource = await this.resourceForPath(path)

      if (this.isNotModified({ resource, headers }))
        return this.notModifiedResponse(resource)
      else if (httpMethod == HEAD)
        return this.headResponse(resource)
      else
        return this.getResponse(resource)
    }
    catch (error) {
      if (error.statusCode == 404)
        return this.notFoundResponse()
      else
        throw error
    }
  }

  isNotModified({
    resource: {
      ETag,
      LastModified
    },
    headers: {
      'If-Modified-Since': ifModifiedSince,
      'If-None-Match': ifNoneMatch
    }
  }) {
    let isFresh = Boolean(ifModifiedSince || ifNoneMatch)

    if (ifModifiedSince) {
      ifModifiedSince = new Date(ifModifiedSince)
      isFresh &= (ifModifiedSince >= LastModified)
    }
    if (ifNoneMatch) {
      isFresh &= (ifNoneMatch == ETag)
    }
    return Boolean(isFresh)
  }

  getResponse({ Body, ContentType, ETag, LastModified }) {
    return {
      body: Body.toString('base64'),
      headers: {
        'Content-Type': ContentType,
        'ETag': ETag,
        'Last-Modified': LastModified.toUTCString(),
      },
      isBase64Encoded: true,
      statusCode: 200,
    }
  }

  headResponse({ ContentLength, ContentType, ETag, LastModified }) {
    return {
      headers: {
        'Content-Length': ContentLength,
        'Content-Type': ContentType,
        'ETag': ETag,
        'Last-Modified': LastModified.toUTCString(),
      },
      statusCode: 200,
    }
  }

  methodNotAllowedResponse(allowed) {
    return {
      headers: {
        'Allow': allowed.join(', ')
      },
      statusCode: 405
    }
  }

  notFoundResponse() {
    return {
      headers: {
        'Content-Length': null,
        'Content-Type': null,
      },
      statusCode: 404
    }
  }

  notModifiedResponse({ ETag, LastModified }) {
    return {
      headers: {
        'Content-Length': null,
        'Content-Type': null,
        'ETag': ETag,
        'Last-Modified': LastModified.toUTCString(),
      },
      statusCode: 304
    }
  }
}

export { S6, S6Error }
