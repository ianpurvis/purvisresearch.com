#!/usr/bin/env node

require('dotenv').config()
const cdk = require('@aws-cdk/core')
const {
  RootStack,
  WwwStack,
  ZoneStack,
} = require('../lib/stack')

const {
  ROUTE53_DOMAIN,
  CLOUD_FORMATION_STACK_NAME
} = process.env

if (!ROUTE53_DOMAIN)
  throw new Error("Missing environment variable 'ROUTE53_DOMAIN'")
if (!CLOUD_FORMATION_STACK_NAME)
  throw new Error("Missing environment variable 'CLOUD_FORMATION_STACK_NAME'")

const app = new cdk.App()

const zoneStack = new ZoneStack(app, `${CLOUD_FORMATION_STACK_NAME}-zone`, {
  domainName: ROUTE53_DOMAIN
})

const rootStack = new RootStack(app, `${CLOUD_FORMATION_STACK_NAME}-root`, {
  zoneStack,
  lambdaPath: 'dist/lambda'
})

new WwwStack(app, `${CLOUD_FORMATION_STACK_NAME}-www`, {
  rootStack
})
