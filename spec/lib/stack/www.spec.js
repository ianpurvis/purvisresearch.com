import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'
import { HostedZone } from '@aws-cdk/aws-route53'
import { WwwStack } from '~/lib/stack/www'

describe('WwwStack', () => {
  let app, rootStack

  beforeEach(() => {
    app = new cdk.App()
    rootStack = new cdk.Stack(app, 'mock-root-stack')
    rootStack.hostedZone = new HostedZone(rootStack, 'mock-zone', {
      zoneName: 'mock-zone-name'
    })
    rootStack.hostName = rootStack.hostedZone.zoneName
    rootStack.corsRules = [{
      allowedMethods: [
        'mock-method'
      ],
      allowedOrigins: [
        'mock-origin'
      ]
    }]
  })
  describe('constructor', () => {
    let stack, props

    beforeEach(() => {
      props = {
        rootStack
      }
      stack = new WwwStack(app, 'TestStack', props)
    })
    it('synthesizes an s3 bucket for www redirection', () => {
      const rule = rootStack.corsRules[0]
      expect(stack).toHaveResource('AWS::S3::Bucket', {
        'CorsConfiguration': {
          'CorsRules': [
            {
              'AllowedMethods': rule.allowedMethods,
              'AllowedOrigins': rule.allowedOrigins
            }
          ]
        },
        'WebsiteConfiguration': {
          'RedirectAllRequestsTo': {
            'HostName': rootStack.hostName,
            'Protocol': 'https'
          }
        }
      })
    })
    it('synthesizes a cloudfront distribution for www redirection', () => {
      const domainName = `www.${rootStack.hostName}`
      expect(stack).toHaveResource('AWS::CloudFront::Distribution', {
        'DistributionConfig': {
          'Aliases': [
            domainName
          ],
          'DefaultCacheBehavior': {
            'AllowedMethods': [
              'GET',
              'HEAD'
            ],
            'CachedMethods': [
              'GET',
              'HEAD'
            ],
            'Compress': true,
            'ForwardedValues': {
              'Cookies': {
                'Forward': 'none'
              },
              'QueryString': false
            },
            'TargetOriginId': 'origin1',
            'ViewerProtocolPolicy': 'redirect-to-https'
          },
          'DefaultRootObject': '',
          'Enabled': true,
          'HttpVersion': 'http2',
          'IPV6Enabled': true,
          'Origins': [
            {
              'ConnectionAttempts': 3,
              'ConnectionTimeout': 10,
              'CustomOriginConfig': {
                'HTTPPort': 80,
                'HTTPSPort': 443,
                'OriginKeepaliveTimeout': 5,
                'OriginProtocolPolicy': 'http-only',
                'OriginReadTimeout': 30,
                'OriginSSLProtocols': [
                  'TLSv1.2'
                ]
              },
              'DomainName': {
                'Fn::Select': [
                  2,
                  {
                    'Fn::Split': [
                      '/',
                      {
                        'Fn::GetAtt': [
                          'Bucket83908E77',
                          'WebsiteURL'
                        ]
                      }
                    ]
                  }
                ]
              },
              'Id': 'origin1'
            }
          ],
          'PriceClass': 'PriceClass_All',
          'ViewerCertificate': {
            'AcmCertificateArn': {
              'Fn::GetAtt': [
                'CertificateCertificateRequestorResource2890C6B7',
                'Arn'
              ]
            },
            'MinimumProtocolVersion': 'TLSv1.1_2016',
            'SslSupportMethod': 'sni-only'
          }
        }
      })
    })
  })
})
