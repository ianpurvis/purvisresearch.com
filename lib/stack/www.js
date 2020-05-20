const certificateManager = require('@aws-cdk/aws-certificatemanager')
const cloudfront = require('@aws-cdk/aws-cloudfront')
const cdk = require('@aws-cdk/core')
const route53 = require('@aws-cdk/aws-route53')
const route53Targets = require('@aws-cdk/aws-route53-targets')
const s3 = require('@aws-cdk/aws-s3')

class WwwStack extends cdk.Stack {

  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props = {}) {
    super(scope, id, props)

    const { rootStack } = props

    Object.assign(this, {
      hostName: `www.${rootStack.hostName}`,
      hostedZone: rootStack.hostedZone
    })

    this.bucket =
      new s3.Bucket(this, 'Bucket', {
        cors: rootStack.corsRules,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: false,
        websiteRedirect: {
          hostName: rootStack.hostName,
          protocol: s3.RedirectProtocol.HTTPS
        },
      })

    this.bucket.grantPublicAccess()

    this.certificate =
      new certificateManager.DnsValidatedCertificate(this, 'Certificate', {
        domainName: this.hostName,
        hostedZone: this.hostedZone,
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
        defaultRootObject: '',
        originConfigs: [{
          customOriginSource: {
            domainName: this.bucket.bucketWebsiteDomainName,
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors : [{
            isDefaultBehavior: true
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
  }
}

module.exports = { WwwStack }
