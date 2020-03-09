#!/usr/bin/env node

require('dotenv').config()
const cdk = require('@aws-cdk/core')
const { Stack } = require('../lib/stack')

const { ROUTE53_DOMAIN: domainName } = process.env

const app = new cdk.App()
const stack = new Stack(app, 'PurvisResearchStack', {
  domainName
})
