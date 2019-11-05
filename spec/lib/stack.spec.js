import { expect, exactlyMatchTemplate } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import { Stack } from '~/lib/stack'

describe('Stack', () => {
  let app

  beforeEach(() => {
    app = new cdk.App()
  })
  describe('constructor', () => {
    let stack

    beforeEach(() => {
      stack = new Stack(app, 'MyTestStack')
    })
    it('initializes a S3 bucket resource', () => {
      expect(stack).to(exactlyMatchTemplate({
        "Resources": {
          "MyFirstBucketB8884501": {
            "Type": "AWS::S3::Bucket",
            "Properties": {
              "VersioningConfiguration": {
                "Status": "Enabled"
              }
            },
            "UpdateReplacePolicy": "Delete",
            "DeletionPolicy": "Delete"
          }
        }
      }))
    })
  })
})
