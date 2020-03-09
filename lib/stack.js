const cloudfront = require('@aws-cdk/aws-cloudfront')
const cdk = require('@aws-cdk/core')
const s3 = require('@aws-cdk/aws-s3')

class Stack extends cdk.Stack {

  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props)

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
  }
}

module.exports = { Stack }
