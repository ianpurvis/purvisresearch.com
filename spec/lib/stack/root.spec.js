import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'
import { HostedZone } from '@aws-cdk/aws-route53'
import { RootStack } from '~/lib/stack/root'

describe('RootStack', () => {
  let app, zoneStack

  beforeEach(() => {
    app = new cdk.App()
    zoneStack = new cdk.Stack(app, 'mock-zone-stack')
    zoneStack.hostedZone = new HostedZone(zoneStack, 'mock-zone', {
      zoneName: 'mock-zone-name'
    })
  })
  describe('constructor', () => {
    let stack, props

    beforeEach(() => {
      props = {
        zoneStack,
        lambdaPath: 'spec/fixtures'
      }
      stack = new RootStack(app, 'TestStack', props)
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
    it('synthesizes a cloudfront distribution', () => {
      expect(stack).toHaveResource("AWS::CloudFront::Distribution", {
        "DistributionConfig": {
          "Aliases": [
            zoneStack.hostedZone.zoneName
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
