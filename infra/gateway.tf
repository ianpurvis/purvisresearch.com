resource "aws_cloudfront_origin_access_identity" "gateway" {
}

resource "aws_cloudfront_response_headers_policy" "gateway" {
  name = "gateway-policy"
  security_headers_config {
    content_security_policy {
      content_security_policy = <<-EOF
        base-uri
          'none';
        child-src
          'self'
          blob:;
        connect-src
          'self'
          https://www.google-analytics.com
          https://sentry.io;
        default-src
          'none';
        frame-ancestors
          'none';
        font-src
          'self'
          data:;
        form-action
          'none';
        img-src
          'self'
          https://www.google-analytics.com;
        manifest-src
          'self';
        media-src
          'self';
        object-src
          'none';
        script-src
          'self'
          'unsafe-eval'
          'unsafe-inline'
          https://www.google-analytics.com
          https://sentry.io;
        style-src
          'self'
          'unsafe-inline';
        worker-src
          'self'
          blob:;
      EOF
      override = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override = true
    }
    referrer_policy {
      override = true
      referrer_policy = "no-referrer-when-downgrade"
    }
    strict_transport_security {
      access_control_max_age_sec = 31556952
      include_subdomains = true
      override = true
      preload = true
    }
    xss_protection {
      mode_block = true
      override = true
      protection = true
    }
  }
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
