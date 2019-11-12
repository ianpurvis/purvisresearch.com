const cdk = require('@aws-cdk/core')
const apiGateway = require('@aws-cdk/aws-apigateway')
const iam = require('@aws-cdk/aws-iam')
const lambda = require('@aws-cdk/aws-lambda')
const s3 = require('@aws-cdk/aws-s3')
const { readFileSync } = require('fs')


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

    const lambdaRole = new iam.Role(this, 'MyFirstLambdaServiceRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('apigateway.amazonaws.com')
      ),
      inlinePolicies: {
        s3: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: [
                bucket.arnForObjects('*')
              ],
              actions: [
                's3:GetObject'
              ]
            }),
          ]
        })
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
      ]
    })

    const code = readFileSync(require.resolve('./proxy.js')).toString()

    const functi0n = new lambda.Function(this, 'MyFirstFunction', {
      code: new lambda.InlineCode(code),
      handler: 'index.onRequest',
      role: lambdaRole,
      runtime: lambda.Runtime.NODEJS_8_10,
    })

    const apiGatewayRole = new iam.Role(this, 'MyFirstApiGatewayServiceRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        lambda: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: [
                functi0n.functionArn
              ],
              actions: [
                'lambda:InvokeFunction'
              ]
            }),
          ]
        })
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonAPIGatewayPushToCloudWatchLogs'
        ),
      ]
    })

    const apiGatewayAccount =
      new apiGateway.CfnAccount(this, 'MyFirstApiGatewayAccount', {
        cloudWatchRoleArn: apiGatewayRole.roleArn
      })

    const api = new apiGateway.RestApi(this, 'MyFirstApi', {
      cloudWatchRole: false,
      defaultIntegration: new apiGateway.LambdaIntegration(functi0n, {
        credentialsRole: apiGatewayRole,
        proxy: true,
      }),
      deployOptions: {
        loggingLevel: apiGateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      },
      endpointTypes: [
        apiGateway.EndpointType.REGIONAL
      ],
      retainDeployments: false,
    })
    api.root.addProxy()

    // Dependency not automatically inferred:
    api.deploymentStage.node.addDependency(apiGatewayAccount)
  }
}

module.exports = { Stack }
