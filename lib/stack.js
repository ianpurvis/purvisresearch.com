const cdk = require('@aws-cdk/core')
const apiGateway = require('@aws-cdk/aws-apigateway')
const iam = require('@aws-cdk/aws-iam')
const lambda = require('@aws-cdk/aws-lambda')
const s3 = require('@aws-cdk/aws-s3')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const defaultProps = {
  lambdaEntryPath: 'dist/lambda/index.js'
}

class Stack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props = defaultProps) {
    super(scope, id, props)

    const { lambdaEntryPath } = props

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
            new iam.PolicyStatement({
              resources: [
                bucket.bucketArn
              ],
              actions: [
                's3:ListBucket'
              ]
            })
          ]
        })
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
      ]
    })

    const functi0nSource = readFileSync(resolve(lambdaEntryPath), 'utf-8')

    const functi0n = new lambda.Function(this, 'MyFirstFunction', {
      code: new lambda.InlineCode(functi0nSource),
      environment: {
        S3_DEFAULT_OBJECT_KEY: 'index.html',
        S3_BUCKET: bucket.bucketName
      },
      handler: 'index.handler',
      role: lambdaRole,
      runtime: lambda.Runtime.NODEJS_12_X
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
      binaryMediaTypes: [
        '*/*'
      ],
      cloudWatchRole: false,
      defaultIntegration: new apiGateway.LambdaIntegration(functi0n, {
        contentHandling: apiGateway.ContentHandling.CONVERT_TO_BINARY,
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
