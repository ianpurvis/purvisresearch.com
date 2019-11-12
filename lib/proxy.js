const S3 = require('aws-sdk/clients/s3')

async function onRequest({ pathParameters }) {

  const key = pathParameters
    ? pathParameters.proxy
    : process.env.S3_DEFAULT_OBJECT_KEY

  const getObjectRequest = new S3().getObject({
    Bucket: process.env.S3_BUCKET,
    Key: key
  })

  const data = await getObjectRequest.promise()

  const response = {
    body: data.Body.toString('base64'),
    headers: {
      'Content-Type': data.ContentType,
    },
    isBase64Encoded: true,
    statusCode: 200,
  }

  return response
}

module.exports = { onRequest }
