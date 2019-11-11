import { onRequest } from '~/lib/proxy'
import { proxyRequest, rootRequest } from '~/spec/fixtures/api-gateway'

describe('onRequest(request)', () => {
  let request, response

  describe('given a request from /{proxy+}', () => {
    it('returns a valid api gateway proxy response', async () => {
      request = proxyRequest
      response = await onRequest(request)
      expect(response).toBeApiGatewayProxyResponse()
    })
  })
  describe('given a request from /', () => {
    it('returns a valid api gateway proxy response', async () => {
      request = rootRequest
      response = await onRequest(request)
      expect(response).toBeApiGatewayProxyResponse()
    })
  })
})
