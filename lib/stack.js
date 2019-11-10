const cdk = require('@aws-cdk/core')
const apiGateway = require('@aws-cdk/aws-apigateway')
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

    const api = new apiGateway.RestApi(this, 'MyFirstApi', {
      cloudWatchRole: false,
      endpointTypes: [
        apiGateway.EndpointType.REGIONAL
      ],
      retainDeployments: false,
    })

    const defaultIntegration = new apiGateway.AwsIntegration({
      service: 's3',
      integrationHttpMethod: 'GET',
      options: {
        credentialsRole: role,
        integrationResponses: [{
          selectionPattern: '200',
          statusCode: '200',
          responseParameters: {
            'method.response.header.Accept-Ranges': 'integration.response.header.Accept-Ranges',
            'method.response.header.Content-Length': 'integration.response.header.Content-Length',
            'method.response.header.Content-Type': 'integration.response.header.Content-Type',
            'method.response.header.Date': 'integration.response.header.Date',
            'method.response.header.ETag': 'integration.response.header.ETag',
            'method.response.header.Last-Modified': 'integration.response.header.Last-Modified',
          }
        },{
          selectionPattern: '403',
          statusCode: '403',
          responseParameters: {
            'method.response.header.Content-Length': 'integration.response.header.Content-Length',
            'method.response.header.Content-Type': 'integration.response.header.Content-Type',
            'method.response.header.Date': 'integration.response.header.Date',
          }
        }],
        requestParameters: {
          'integration.request.path.proxy': 'method.request.path.proxy',
          'integration.request.header.Accept': 'method.request.header.Accept'
        }
      },
      path: `${bucket.bucketName}/{proxy}`
    })

    const defaultMethodOptions = {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Accept-Ranges': false,
            'method.response.header.Content-Length': true,
            'method.response.header.Content-Type': true,
            'method.response.header.Date': true,
            'method.response.header.ETag': true,
            'method.response.header.Last-Modified': true,
          }
        },{
          statusCode: '403',
          responseParameters: {
            'method.response.header.Content-Length': false,
            'method.response.header.Content-Type': true,
            'method.response.header.Date': true,
          }
        }
      ],
      requestParameters: {
        'method.request.path.proxy': true,
        'method.request.header.Accept': false
      }
    }

    const proxy = api.root.addProxy({
      anyMethod: false,
    })
    proxy.addMethod('GET', defaultIntegration, defaultMethodOptions)
    proxy.addMethod('HEAD', defaultIntegration, defaultMethodOptions)
  }
}

module.exports = { Stack }
