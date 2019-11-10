const cdk = require('@aws-cdk/core')
const iam = require('@aws-cdk/aws-iam')
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

    const bucket = new s3.Bucket(this, 'MyFirstBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: false,
    })

    const role = new iam.Role(this, 'MyFirstServiceRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    })

    const policy = new iam.Policy(this, 'MyFirstPolicy', {
      roles: [
        role
      ],
      statements: [
        new iam.PolicyStatement({
          resources: [
            bucket.arnForObjects('*')
          ],
          actions: [
            's3:GetObject'
          ]
        })
      ]
    })
  }
}

module.exports = { Stack }
