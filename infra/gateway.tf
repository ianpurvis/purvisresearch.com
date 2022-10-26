resource "aws_cloudfront_origin_access_identity" "gateway" {
}

resource "aws_cloudfront_distribution" "gateway" {
  aliases = [
    aws_acm_certificate.root.domain_name
  ]
  default_cache_behavior {
    allowed_methods = [
      "GET",
      "HEAD",
      "OPTIONS"
    ]
    cached_methods = [
      "GET",
      "HEAD",
      "OPTIONS"
    ]
    compress = true
    forwarded_values {
      cookies {
        forward = "none"
      }
      headers = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ]
      query_string = true
    }
    target_origin_id       = aws_s3_bucket.app.id
    viewer_protocol_policy = "redirect-to-https"
  }
  default_root_object = "index.html"
  enabled             = true
  origin {
    domain_name = aws_s3_bucket.app.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.app.id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.gateway.cloudfront_access_identity_path
    }
  }
  price_class = "PriceClass_All"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  tags = {
    "app" = random_id.app.hex
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.root.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_record" "gateway" {
  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.gateway.domain_name
    zone_id                = aws_cloudfront_distribution.gateway.hosted_zone_id
  }
  name    = aws_acm_certificate.root.domain_name
  type    = "A"
  zone_id = aws_route53_zone.primary.zone_id
}
