const S3 = require('aws-sdk/clients/s3')

function iget(object, insensitiveKey) {
  const matcher = RegExp(`^${insensitiveKey}$`, 'i')
  const key = Object.keys(object).find(key => matcher.test(key))
  return object[key]
}

async function onRequest({ pathParameters, headers } = {}) {
  // ApiGateway requests contain null (but defined) properties, which break
  // default parameter handling.  As a workaround, explicitly handle defaults:
  pathParameters = pathParameters || {}
  headers = headers || {}

  const { S3_BUCKET, S3_DEFAULT_OBJECT_KEY } = process.env

  let Bucket = S3_BUCKET

  let Key = pathParameters.proxy || S3_DEFAULT_OBJECT_KEY

  let IfModifiedSince = iget(headers, 'If-Modified-Since')
  IfModifiedSince = IfModifiedSince && new Date(IfModifiedSince)

  let IfNoneMatch = iget(headers, 'If-None-Match')

  const s3 = new S3()
  const head = await s3.headObject({ Bucket, Key }).promise()

  if (IfNoneMatch == head.ETag || IfModifiedSince >= head.LastModified) {
    return {
      headers: {
        'Content-Length': null,
        'Content-Type': null,
        'ETag': head.ETag,
        'Last-Modified': head.LastModified.toUTCString(),
      },
      statusCode: 304
    }
  }

  const data = await s3.getObject({ Bucket, Key }).promise()

  return {
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

module.exports = { onRequest }
