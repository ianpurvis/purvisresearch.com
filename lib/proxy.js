import { S6 } from '~/lib/s6'

async function onRequest({ httpMethod='GET', path='/', headers={} } = {}) {

  const { S3_BUCKET } = process.env
  if (!S3_BUCKET) throw new Error('Environment variable S3_BUCKET was undefined')

  const server = new S6({
    bucketName: S3_BUCKET
  })
  const response = await server.handle({ httpMethod, path, headers })

  return response
}

export { onRequest }
