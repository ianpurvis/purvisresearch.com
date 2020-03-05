import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'
import { readFileSync } from 'fs'
import { Stack } from '~/lib/stack'


describe('Stack', () => {
  let app

  beforeEach(() => {
    app = new cdk.App()
  })
  describe('constructor', () => {
    let stack, lambdaEntryPath

    beforeEach(() => {
      lambdaEntryPath = 'spec/mocks/file-mock.js'
      stack = new Stack(app, 'MyTestStack', { lambdaEntryPath })
    })
    it('initializes a s3 bucket blocking public access', () => {
      expect(stack).toHaveResource("AWS::S3::Bucket", {
        "PublicAccessBlockConfiguration": {
          "BlockPublicAcls": true,
          "BlockPublicPolicy": true,
          "IgnorePublicAcls": true,
          "RestrictPublicBuckets": true
        }
      })
    })
    it([
      'initializes a lambda execution role',
      'assumable by lambda and api gateway',
      'with privilege to read objects in the s3 bucket',
      'and basic lambda execution privileges'
    ].join(' '), () => {
      expect(stack).toHaveResource('AWS::IAM::Role', {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": [
                  "lambda.amazonaws.com",
                  "apigateway.amazonaws.com"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "ManagedPolicyArns": [
          {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
              ]
            ]
          }
        ],
        "Policies": [
          {
            "PolicyDocument": {
              "Statement": [
                {
                  "Action": "s3:GetObject",
                  "Effect": "Allow",
                  "Resource": {
                    "Fn::Join": [
                      "",
                      [
                        {
                          "Fn::GetAtt": [
                            "MyFirstBucketB8884501",
                            "Arn"
                          ]
                        },
                        "/*"
                      ]
                    ]
                  }
                },
                {
                  "Action": "s3:ListBucket",
                  "Effect": "Allow",
                  "Resource": {
                    "Fn::GetAtt": [
                      "MyFirstBucketB8884501",
                      "Arn"
                    ]
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "PolicyName": "s3"
          }
        ]
      })
    })
    it([
      'initializes a lambda function',
      'that handles api gateway requests',
      'with the lambda service role'
    ].join(' '), () => {
      const lambdaEntrySource = readFileSync(lambdaEntryPath, 'utf-8')

      expect(stack).toHaveResource('AWS::Lambda::Function', {
        "Code": {
          "ZipFile": lambdaEntrySource,
        },
        "Handler": "index.handler",
        "Environment": {
          "Variables": {
            "S3_DEFAULT_OBJECT_KEY": "index.html",
            "S3_BUCKET": {
              "Ref": "MyFirstBucketB8884501"
            }
          }
        },
        "Role": {
          "Fn::GetAtt": [
            "MyFirstLambdaServiceRoleFC14EE9B",
            "Arn",
          ],
        },
        "Runtime": "nodejs12.x",
      })
    })
    it([
      'initializes an api gateway execution role',
      'assumable by api gateway',
      'with privilege to invoke the lambda function',
      'and privileges to push cloudwatch logs'
    ].join(' '), () => {
      expect(stack).toHaveResource('AWS::IAM::Role', {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "apigateway.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "ManagedPolicyArns": [
          {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
              ]
            ]
          }
        ],
        "Policies": [
          {
            "PolicyDocument": {
              "Statement": [
                {
                  "Action": "lambda:InvokeFunction",
                  "Effect": "Allow",
                  "Resource": {
                    "Fn::GetAtt": [
                      "MyFirstFunction9FC50B64",
                      "Arn"
                    ]
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "PolicyName": "lambda"
          }
        ]
      })
    })
    it('initializes an api gateway account with the service role as the cloudwatch role', () => {
      expect(stack).toHaveResource('AWS::ApiGateway::Account', {
        "CloudWatchRoleArn": {
          "Fn::GetAtt": [
            "MyFirstApiGatewayServiceRole87B8E1AE",
            "Arn"
          ]
        }
      })
    })
    it('initializes a regional rest api', () => {
      expect(stack).toHaveResource('AWS::ApiGateway::RestApi', {
        "BinaryMediaTypes": [
          "*/*"
        ],
        "EndpointConfiguration": {
          "Types": [
            "REGIONAL"
          ]
        },
        "Name": "MyFirstApi"
      })
    })
    it('initializes a lambda proxy resource at the root of the rest api', () => {
      expect(stack).toHaveResource('AWS::ApiGateway::Resource', {
        "ParentId": {
          "Fn::GetAtt": [
            "MyFirstApi093A92CC",
            "RootResourceId"
          ]
        },
        "PathPart": "{proxy+}",
        "RestApiId": {
          "Ref": "MyFirstApi093A92CC"
        }
      })
      expect(stack).toHaveResource('AWS::ApiGateway::Method', {
        "HttpMethod": "ANY",
        "ResourceId": {
          "Ref": "MyFirstApiproxy50AB6DE1"
        },
        "RestApiId": {
          "Ref": "MyFirstApi093A92CC"
        },
        "AuthorizationType": "NONE",
        "Integration": {
          "ContentHandling": "CONVERT_TO_BINARY",
          "Credentials": {
            "Fn::GetAtt": [
              "MyFirstApiGatewayServiceRole87B8E1AE",
              "Arn"
            ]
          },
          "IntegrationHttpMethod": "POST",
          "Type": "AWS_PROXY",
          "Uri": {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":apigateway:",
                {
                  "Ref": "AWS::Region"
                },
                ":lambda:path/2015-03-31/functions/",
                {
                  "Fn::GetAtt": [
                    "MyFirstFunction9FC50B64",
                    "Arn"
                  ]
                },
                "/invocations"
              ]
            ]
          }
        }
      })
      expect(stack).toHaveResource('AWS::ApiGateway::Method', {
        "HttpMethod": "ANY",
        "ResourceId": {
          "Fn::GetAtt": [
            "MyFirstApi093A92CC",
            "RootResourceId"
          ]
        },
        "RestApiId": {
          "Ref": "MyFirstApi093A92CC"
        },
        "AuthorizationType": "NONE",
        "Integration": {
          "ContentHandling": "CONVERT_TO_BINARY",
          "Credentials": {
            "Fn::GetAtt": [
              "MyFirstApiGatewayServiceRole87B8E1AE",
              "Arn"
            ]
          },
          "IntegrationHttpMethod": "POST",
          "Type": "AWS_PROXY",
          "Uri": {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":apigateway:",
                {
                  "Ref": "AWS::Region"
                },
                ":lambda:path/2015-03-31/functions/",
                {
                  "Fn::GetAtt": [
                    "MyFirstFunction9FC50B64",
                    "Arn"
                  ]
                },
                "/invocations"
              ]
            ]
          }
        }
      })
    })
    it('initializes a rest api deployment stage with logging and data tracing', () => {
      expect(stack).toHaveResource('AWS::ApiGateway::Stage', {
        "RestApiId": {
          "Ref": "MyFirstApi093A92CC"
        },
        "MethodSettings": [
          {
            "DataTraceEnabled": true,
            "HttpMethod": "*",
            "LoggingLevel": "INFO",
            "ResourcePath": "/*"
          }
        ],
        "StageName": "prod"
      })
    })
  })
})
