resource "aws_route53_zone" "primary" {
  name = "purvisresearch.com"
  tags = {
    "app" = random_id.app.hex
  }
}

resource "aws_route53_record" "mx" {
  name = aws_route53_zone.primary.name
  records = [
    "5 gmr-smtp-in.l.google.com.",
    "10 alt1.gmr-smtp-in.l.google.com.",
    "20 alt2.gmr-smtp-in.l.google.com.",
    "30 alt3.gmr-smtp-in.l.google.com.",
    "40 alt4.gmr-smtp-in.l.google.com.",
  ]
  type    = "MX"
  ttl     = 3600
  zone_id = aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate" "root" {
  domain_name = aws_route53_zone.primary.name
  tags = {
    "app" = random_id.app.hex
  }
  validation_method = "DNS"
}

resource "aws_route53_record" "root_validation" {
  for_each = {
    for option in aws_acm_certificate.root.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records = [
    each.value.record
  ]
  ttl     = 60
  type    = each.value.type
  zone_id = aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "root" {
  certificate_arn = aws_acm_certificate.root.arn
  validation_record_fqdns = [
    for record in aws_route53_record.root_validation : record.fqdn
  ]
}

resource "aws_acm_certificate" "www" {
  domain_name       = "www.${aws_route53_zone.primary.name}"
  validation_method = "DNS"
  tags = {
    "app" = random_id.app.hex
  }
}

resource "aws_route53_record" "www_validation" {
  for_each = {
    for option in aws_acm_certificate.www.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records = [
    each.value.record
  ]
  ttl     = 60
  type    = each.value.type
  zone_id = aws_route53_zone.primary.zone_id
}

resource "aws_acm_certificate_validation" "www" {
  certificate_arn = aws_acm_certificate.www.arn
  validation_record_fqdns = [
    for record in aws_route53_record.www_validation : record.fqdn
  ]
}
