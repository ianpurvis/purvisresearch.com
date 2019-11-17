import S3 from 'aws-sdk/clients/s3'

class S6Error extends Error {
  constructor(message, ...params) {
    super(`S6: ${message}`, ...params)
  }
}

function iget(object, insensitiveKey) {
  const matcher = RegExp(`^${insensitiveKey}$`, 'i')
  const key = Object.keys(object).find(key => matcher.test(key))
  return object[key]
}

/**
 * Simple Storage Service Static Site Server
 */
class S6 {
  constructor({ bucketName, defaultObjectKey }) {
    if (!bucketName) throw new S6Error('Argument key missing: bucketName')
    if (!defaultObjectKey) throw new S6Error('Argument key missing: defaultObjectKey')
    this.defaultObjectKey = defaultObjectKey
    this.s3 = new S3({
      params: {
        Bucket: bucketName
      }
    })
  }

  handlerForHttpMethod(method) {
    const handler = this[method.toLowerCase()] || this.methodNotAllowed
    return handler.bind(this)
  }

  keyForPath(path) {
    const key = path.slice(1)
    return key.length > 0 ? key : this.defaultObjectKey
  }

  async handle({ httpMethod, path, headers }) {
    const handler = this.handlerForHttpMethod(httpMethod)
    return await handler({ path, headers })
  }

  async head({ path, headers }) {
    const key = this.keyForPath(path)
    const data = await this.s3.headObject({ Key: key }).promise()

    const ifModifiedSince = new Date(iget(headers, 'If-Modified-Since'))
    const ifNoneMatch = iget(headers, 'If-None-Match')

    let response
    if (ifNoneMatch == data.ETag || ifModifiedSince >= data.LastModified) {
      response = {
        headers: {
          'Content-Length': null,
          'Content-Type': null,
          'ETag': data.ETag,
          'Last-Modified': data.LastModified.toUTCString(),
        },
        statusCode: 304
      }
    } else {
      response = {
        headers: {
          'Content-Type': data.ContentType,
          'ETag': data.ETag,
          'Last-Modified': data.LastModified.toUTCString(),
        },
        statusCode: 200,
      }
    }

    return response
  }

  async get({ path, headers }) {
    let response = await this.head({ path, headers })

    if (response.statusCode == 200) {
      const key = this.keyForPath(path)
      const data = await this.s3.getObject({ Key: key }).promise()

      response = {
        body: data.Body.toString('base64'),
        headers: {
          'Content-Type': data.ContentType,
          'ETag': data.ETag,
          'Last-Modified': data.LastModified.toUTCString(),
        },
        isBase64Encoded: true,
        statusCode: 200,
      }
    }

    return response
  }

  methodNotAllowed() {
    return {
      headers: {
        'Allow': 'GET, HEAD'
      },
      statusCode: 405
    }
  }
}

export { S6, S6Error }
