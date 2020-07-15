#!/usr/bin/env node

require('dotenv').config()
const cdk = require('@aws-cdk/core')
const {
  RootStack,
  WwwStack,
  ZoneStack,
} = require('../lib/stack')

const {
  CDK_ROUTE53_DOMAIN,
  CDK_STACK_NAMESPACE
} = process.env

if (!CDK_ROUTE53_DOMAIN)
  throw new Error("Missing environment variable 'CDK_ROUTE53_DOMAIN'")
if (!CDK_STACK_NAMESPACE)
  throw new Error("Missing environment variable 'CDK_STACK_NAMESPACE'")

const app = new cdk.App()

const zoneStack = new ZoneStack(app, `${CDK_STACK_NAMESPACE}-zone`, {
  domainName: CDK_ROUTE53_DOMAIN
})

const rootStack = new RootStack(app, `${CDK_STACK_NAMESPACE}-root`, {
  zoneStack,
  lambdaPath: 'dist/lambda'
})

new WwwStack(app, `${CDK_STACK_NAMESPACE}-www`, {
  rootStack
})
