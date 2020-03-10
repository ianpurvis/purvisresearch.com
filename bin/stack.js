#!/usr/bin/env node

require('dotenv').config()
const cdk = require('@aws-cdk/core')
const { Stack } = require('../lib/stack')

const {
  ROUTE53_DOMAIN,
  CLOUD_FORMATION_STACK_NAME
} = process.env

if (!ROUTE53_DOMAIN)
  throw new Error("Missing environment variable 'ROUTE53_DOMAIN'")
if (!CLOUD_FORMATION_STACK_NAME)
  throw new Error("Missing environment variable 'CLOUD_FORMATION_STACK_NAME'")

const app = new cdk.App()
const stack = new Stack(app, CLOUD_FORMATION_STACK_NAME, {
  domainName: ROUTE53_DOMAIN,
  lambdaPath: 'dist/lambda'
})
