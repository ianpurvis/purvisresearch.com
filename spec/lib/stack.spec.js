import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'
import { Stack } from '~/lib/stack'

describe('Stack', () => {
  let app

  beforeEach(() => {
    app = new cdk.App()
  })
  describe('constructor', () => {
    let stack, props

    beforeEach(() => {
      props = {
        domainName: 'mock-domain-name',
        lambdaPath: 'spec/fixtures'
      }
      stack = new Stack(app, 'MyTestStack', props)
    })
    it('synthesizes an s3 bucket', () => {
      expect(stack).toHaveResource("AWS::S3::Bucket", {
        "CorsConfiguration": {
          "CorsRules": [
            {
              "AllowedHeaders": [
                "*"
              ],
              "AllowedMethods": [
                "GET",
                "HEAD"
              ],
              "AllowedOrigins": [
                "*"
              ],
              "MaxAge": 3000
            }
          ]
        },
        "PublicAccessBlockConfiguration": {
          "BlockPublicAcls": true,
          "BlockPublicPolicy": true,
          "IgnorePublicAcls": true,
          "RestrictPublicBuckets": true
        }
      })
    })
    it('synthesizes an s3 bucket for www redirection', () => {
      expect(stack).toHaveResource("AWS::S3::Bucket", {
        "CorsConfiguration": {
          "CorsRules": [
            {
              "AllowedHeaders": [
                "*"
              ],
              "AllowedMethods": [
                "GET",
                "HEAD"
              ],
              "AllowedOrigins": [
                "*"
              ],
              "MaxAge": 3000
            }
          ]
        },
        "WebsiteConfiguration": {
          "RedirectAllRequestsTo": {
            "HostName": props.domainName,
            "Protocol": "https"
          }
        }
      })
    })
    it('synthesizes a cloudfront distribution', () => {
      expect(stack).toHaveResource("AWS::CloudFront::Distribution", {
        "DistributionConfig": {
          "Aliases": [
            props.domainName
          ],
          "DefaultCacheBehavior": {
            "AllowedMethods": [
              "GET",
              "HEAD"
            ],
            "CachedMethods": [
              "GET",
              "HEAD"
            ],
            "Compress": true,
            "ForwardedValues": {
              "QueryString": true
            },
            "LambdaFunctionAssociations": [
              {
                "EventType": "origin-request",
                "LambdaFunctionARN": {
                  "Ref": "Version6A868472"
                }
              },
              {
                "EventType": "origin-response",
                "LambdaFunctionARN": {
                  "Ref": "Version6A868472"
                }
              }
            ],
            "TargetOriginId": "origin1",
            "ViewerProtocolPolicy": "redirect-to-https"
          },
          "DefaultRootObject": "index.html",
          "Enabled": true,
          "HttpVersion": "http2",
          "IPV6Enabled": true,
          "Origins": [
            {
              "DomainName": {
                "Fn::GetAtt": [
                  "Bucket83908E77",
                  "RegionalDomainName"
                ]
              },
              "Id": "origin1",
              "S3OriginConfig": {
                "OriginAccessIdentity": {
                  "Fn::Join": [
                    "",
                    [
                      "origin-access-identity/cloudfront/",
                      {
                        "Ref": "OriginAccessIdentityDF1E3CAC"
                      }
                    ]
                  ]
                }
              }
            }
          ],
          "PriceClass": "PriceClass_All",
          "ViewerCertificate": {
            "AcmCertificateArn": {
              "Fn::GetAtt": [
                "CertificateCertificateRequestorResource2890C6B7",
                "Arn"
              ]
            },
            "MinimumProtocolVersion": "TLSv1.1_2016",
            "SslSupportMethod": "sni-only"
          }
        }
      })
    })
    it('synthesizes a cloudfront distribution for www redirection', () => {
      expect(stack).toHaveResource("AWS::CloudFront::Distribution", {
        "DistributionConfig": {
          "Aliases": [
            `www.${props.domainName}`
          ],
          "DefaultCacheBehavior": {
            "AllowedMethods": [
              "GET",
              "HEAD"
            ],
            "CachedMethods": [
              "GET",
              "HEAD"
            ],
            "Compress": true,
            "ForwardedValues": {
              "Cookies": {
                "Forward": "none"
              },
              "QueryString": false
            },
            "TargetOriginId": "origin1",
            "ViewerProtocolPolicy": "redirect-to-https"
          },
          "DefaultRootObject": "",
          "Enabled": true,
          "HttpVersion": "http2",
          "IPV6Enabled": true,
          "Origins": [
            {
              "CustomOriginConfig": {
                "HTTPPort": 80,
                "HTTPSPort": 443,
                "OriginKeepaliveTimeout": 5,
                "OriginProtocolPolicy": "http-only",
                "OriginReadTimeout": 30,
                "OriginSSLProtocols": [
                  "TLSv1.2"
                ]
              },
              "DomainName": {
                "Fn::Select": [
                  2,
                  {
                    "Fn::Split": [
                      "/",
                      {
                        "Fn::GetAtt": [
                          "RedirectBucket2BBBF2DF",
                          "WebsiteURL"
                        ]
                      }
                    ]
                  }
                ]
              },
              "Id": "origin1"
            }
          ],
          "PriceClass": "PriceClass_All",
          "ViewerCertificate": {
            "AcmCertificateArn": {
              "Fn::GetAtt": [
                "CertificateCertificateRequestorResource2890C6B7",
                "Arn"
              ]
            },
            "MinimumProtocolVersion": "TLSv1.1_2016",
            "SslSupportMethod": "sni-only"
          }
        }
      })
    })
    it('synthesizes a lambda function', () => {
      expect(stack).toHaveResource("AWS::Lambda::Function", {
        "Handler": "index.handler",
        "Role": {
          "Fn::GetAtt": [
            "FunctionServiceRole675BB04A",
            "Arn"
          ]
        },
        "Runtime": "nodejs12.x"
      })
    })
  })
})
