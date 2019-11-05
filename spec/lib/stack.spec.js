import { expect, matchTemplate, MatchStyle } from '@aws-cdk/assert'
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
    it('has no resources', () => {
      expect(stack).to(matchTemplate({
        "Resources": {}
      }, MatchStyle.EXACT))
    })
  })
})
