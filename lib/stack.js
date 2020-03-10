const certificateManager = require('@aws-cdk/aws-certificatemanager')
const cloudfront = require('@aws-cdk/aws-cloudfront')
const cdk = require('@aws-cdk/core')
const lambda = require('@aws-cdk/aws-lambda')
const route53 = require('@aws-cdk/aws-route53')
const route53Targets = require('@aws-cdk/aws-route53-targets')
const s3 = require('@aws-cdk/aws-s3')

class Stack extends cdk.Stack {


  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props = {}) {
    super(scope, id, props)

    const { domainName, lambdaPath } = props
    const redirectDomainName = `www.${domainName}`

    this.corsPolicy = {
      allowedHeaders: [
        '*'
      ],
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.HEAD,
      ],
      allowedOrigins: [
        '*'
      ],
      maxAge: 3000
    }

    this.bucket =
      new s3.Bucket(this, 'Bucket', {
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        cors: [
          this.corsPolicy
        ],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: false,
      })

    this.redirectBucket =
      new s3.Bucket(this, 'RedirectBucket', {
        cors: [
          this.corsPolicy
        ],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: false,
        websiteRedirect: {
          hostName: domainName,
          protocol: s3.RedirectProtocol.HTTPS
        },
      })

    this.originAccessIdentity =
      new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity')

    this.bucket.grantRead(this.originAccessIdentity)
    this.redirectBucket.grantPublicAccess()

    this.lambda =
      new lambda.Function(this, 'Function', {
        code: lambda.Code.fromAsset(lambdaPath, {
          exclude: [
            '.DS_Store'
          ]
        }),
        handler: 'index.handler',
        retryAttempts: 0,
        runtime: lambda.Runtime.NODEJS_12_X
      })

    this.lambdaVersion =
      new lambda.Version(this, 'Version', {
        lambda: this.lambda
      })

    this.hostedZone =
      new route53.PublicHostedZone(this, 'HostedZone', {
        zoneName: domainName
      })

    this.certificate =
      new certificateManager.DnsValidatedCertificate(this, 'Certificate', {
        domainName,
        hostedZone: this.hostedZone,
        subjectAlternativeNames: [
          redirectDomainName
        ]
      })

    this.distribution =
      new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
        aliasConfiguration: {
          acmCertRef: this.certificate.certificateArn,
          names: [
            domainName
          ],
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
        },
        defaultRootObject: 'index.html',
        originConfigs: [{
          s3OriginSource: {
            s3BucketSource: this.bucket,
            originAccessIdentity: this.originAccessIdentity
          },
          behaviors : [{
            isDefaultBehavior: true,
            forwardedValues: {
              queryString: true
            },
            lambdaFunctionAssociations: [{
              eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
              lambdaFunction: this.lambdaVersion,
            },{
              eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
              lambdaFunction: this.lambdaVersion,
            }]
          }],
        }],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL
      })

    this.redirectDistribution =
      new cloudfront.CloudFrontWebDistribution(this, 'RedirectDistribution', {
        aliasConfiguration: {
          acmCertRef: this.certificate.certificateArn,
          names: [
            redirectDomainName
          ],
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
        },
        defaultRootObject: '',
        originConfigs: [{
          customOriginSource: {
            domainName: this.redirectBucket.bucketWebsiteDomainName,
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors : [{
            isDefaultBehavior: true
          }],
        }],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL
      })

    this.hostedZoneMX =
      new route53.MxRecord(this, 'MxRecord', {
        ttl: cdk.Duration.seconds(3600),
        values: [{
          hostName: 'gmr-smtp-in.l.google.com.',
          priority: 5,
        }, {
          hostName: 'alt1.gmr-smtp-in.l.google.com.',
          priority: 10,
        }, {
          hostName: 'alt2.gmr-smtp-in.l.google.com.',
          priority: 20,
        }, {
          hostName: 'alt3.gmr-smtp-in.l.google.com.',
          priority: 30,
        }, {
          hostName: 'alt4.gmr-smtp-in.l.google.com.',
          priority: 40,
        }],
        zone: this.hostedZone
      })

    this.hostedZoneA =
      new route53.ARecord(this, 'AliasRecord', {
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(this.distribution)
        ),
        zone: this.hostedZone
      })

    this.hostedZoneA =
      new route53.ARecord(this, 'RedirectAliasRecord', {
        recordName: redirectDomainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(this.redirectDistribution)
        ),
        zone: this.hostedZone
      })

    new cdk.CfnOutput(this, 'bucketName', {
      value: this.bucket.bucketName
    })
  }
}

module.exports = { Stack }
