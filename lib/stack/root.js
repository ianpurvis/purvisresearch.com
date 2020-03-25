const certificateManager = require('@aws-cdk/aws-certificatemanager')
const cloudfront = require('@aws-cdk/aws-cloudfront')
const cdk = require('@aws-cdk/core')
const lambda = require('@aws-cdk/aws-lambda')
const route53 = require('@aws-cdk/aws-route53')
const route53Targets = require('@aws-cdk/aws-route53-targets')
const s3 = require('@aws-cdk/aws-s3')

class RootStack extends cdk.Stack {

  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props = {}) {
    super(scope, id, props)

    const { zoneStack, lambdaPath } = props

    Object.assign(this, {
      hostName: zoneStack.hostedZone.zoneName,
      hostedZone: zoneStack.hostedZone
    })

    this.corsRules = [{
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
    }]

    this.bucket =
      new s3.Bucket(this, 'Bucket', {
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        cors: this.corsRules,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: false,
      })

    this.originAccessIdentity =
      new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity')

    this.bucket.grantRead(this.originAccessIdentity)

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

    this.certificate =
      new certificateManager.DnsValidatedCertificate(this, 'Certificate', {
        domainName: this.hostName,
        hostedZone: this.hostedZone
      })

    this.distribution =
      new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
        aliasConfiguration: {
          acmCertRef: this.certificate.certificateArn,
          names: [
            this.certificate.domainName
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

    this.aliasRecord =
      new route53.ARecord(this, 'AliasRecord', {
        recordName: this.certificate.domainName,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(this.distribution)
        ),
        zone: this.hostedZone
      })

    new cdk.CfnOutput(this, 'bucketName', {
      value: this.bucket.bucketName
    })
  }
}

module.exports = { RootStack }
