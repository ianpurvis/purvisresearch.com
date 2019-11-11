async function onRequest(request) {
  const response = {
    statusCode: 200,
    body: JSON.stringify(request),
  }

  return response
}

module.exports = { onRequest }
