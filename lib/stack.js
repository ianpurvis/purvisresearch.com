const cloudfront = require('@aws-cdk/aws-cloudfront')
const cdk = require('@aws-cdk/core')
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

    const { domainName } = props

    if (!domainName) throw new Error('Missing property \'domainName\'')

    this.bucket =
      new s3.Bucket(this, 'Bucket', {
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: false,
      })

    this.originAccessIdentity =
      new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity')

    this.bucket.grantRead(this.originAccessIdentity)

    this.distribution =
      new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
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
            }
          }],
        }],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL
      })

    this.hostedZone =
      new route53.PublicHostedZone(this, 'HostedZone', {
        zoneName: domainName,
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
  }
}

module.exports = { Stack }
