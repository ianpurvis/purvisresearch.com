import { S6 } from '~/lib/s6'

async function onRequest({ httpMethod='GET', path='/', headers={} } = {}) {

  const { S3_BUCKET, S3_DEFAULT_OBJECT_KEY } = process.env
  if (!S3_BUCKET) throw new Error('S3_BUCKET')
  if (!S3_DEFAULT_OBJECT_KEY) throw new Error('S3_DEFAULT_OBJECT_KEY')

  const server = new S6({
    bucketName: S3_BUCKET,
    defaultObjectKey: S3_DEFAULT_OBJECT_KEY
  })
  const response = await server.handle({ httpMethod, path, headers })

  return response
}

module.exports = { onRequest }
