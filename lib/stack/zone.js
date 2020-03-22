const cdk = require('@aws-cdk/core')
const route53 = require('@aws-cdk/aws-route53')
const route53Targets = require('@aws-cdk/aws-route53-targets')

class ZoneStack extends cdk.Stack {

  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props = {}) {
    super(scope, id, props)

    const { domainName } = props

    this.hostedZone =
      new route53.PublicHostedZone(this, 'HostedZone', {
        zoneName: domainName
      })

    this.hostedZoneMX =
      new route53.MxRecord(this, 'MxRecord', {
        ttl: cdk.Duration.seconds(3600),
        values: [{
          hostName: 'gmr-smtp-in.l.google.com.',
          priority: 5,
        }, {
          hostName: 'alt1.gmr-smtp-in.l.google.com.',
          priority: 10,
        }, {
          hostName: 'alt2.gmr-smtp-in.l.google.com.',
          priority: 20,
        }, {
          hostName: 'alt3.gmr-smtp-in.l.google.com.',
          priority: 30,
        }, {
          hostName: 'alt4.gmr-smtp-in.l.google.com.',
          priority: 40,
        }],
        zone: this.hostedZone
      })

    new cdk.CfnOutput(this, 'hostedZoneNameServers', {
      value: cdk.Fn.join(', ', this.hostedZone.hostedZoneNameServers)
    })
  }
}

module.exports = { ZoneStack }
