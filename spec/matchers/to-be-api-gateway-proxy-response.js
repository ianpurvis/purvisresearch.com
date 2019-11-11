/**
 * Validates received adheres to "Output Format of a Lambda Function for Proxy Integration"
 *    https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
 */
function toBeApiGatewayProxyResponse(received) {
  if (this.isNot) throw new Error('.not.toBeApiGatewayProxyResponse not allowed')

  const {
    body,
    headers,
    isBase64Encoded,
    multiValueHeaders,
    statusCode,
    ...others
  } = received

  expect(typeof body).toBe('string')
  expect(typeof statusCode).toBe('number')

  for (const property in headers) {
    expect(headers).not.toHaveProperty(property, expect.any(Array))
    expect(headers).not.toHaveProperty(property, expect.any(Object))
  }

  for (const property in multiValueHeaders) {
    if (Array.isArray(multiValueHeaders[property])) continue
    expect(multiValueHeaders).not.toHaveProperty(property, expect.any(Object))
  }

  expect([ undefined, true, false ].includes(isBase64Encoded)).toBe(true)

  expect(others).toStrictEqual({})
  expect(() => JSON.stringify(received)).not.toThrow()

  return { pass: true }
}

export { toBeApiGatewayProxyResponse }
