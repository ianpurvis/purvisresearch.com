export default {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionDomainName": "example.cloudfront.net",
          "distributionId": "EXAMPLE",
          "eventType": "origin-request"
        },
        "request": {
          "clientIp": "127.0.0.1",
          "headers": {
            "user-agent": [
              {
                "key": "User-Agent",
                "value": "Amazon CloudFront"
              }
            ],
            "via": [
              {
                "key": "Via",
                "value": "2.0 example.cloudfront.net (CloudFront)"
              }
            ],
            "x-forwarded-for": [
              {
                "key": "X-Forwarded-For",
                "value": "127.0.0.1"
              }
            ],
            "host": [
              {
                "key": "Host",
                "value": "example.com"
              }
            ]
          },
          "method": "HEAD",
          "origin": {
            "custom": {
              "customHeaders": {},
              "domainName": "example.com",
              "keepaliveTimeout": 5,
              "path": "",
              "port": 443,
              "protocol": "https",
              "readTimeout": 30,
              "sslProtocols": [
                "TLSv1",
                "TLSv1.1",
                "TLSv1.2"
              ]
            }
          },
          "querystring": "",
          "uri": "/"
        }
      }
    }
  ]
}
