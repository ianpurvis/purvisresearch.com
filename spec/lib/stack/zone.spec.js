import '@aws-cdk/assert/jest'
import * as cdk from '@aws-cdk/core'
import { ZoneStack } from '~/lib/stack/zone'

describe('ZoneStack', () => {
  let app

  beforeEach(() => {
    app = new cdk.App()
  })
  describe('constructor', () => {
    let stack, props

    beforeEach(() => {
      props = {
        domainName: 'mock-domain-name'
      }
      stack = new ZoneStack(app, 'TestStack', props)
    })
    it('synthesizes a hosted zone', () => {
      const zoneName = `${props.domainName}.`
      expect(stack).toHaveResource("AWS::Route53::HostedZone", {
        "Name": zoneName
      })
    })
  })
})
