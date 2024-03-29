resource "aws_cloudfront_cache_policy" "gateway" {
  name = "${random_id.app.hex}-gateway"
  default_ttl = 86400
  max_ttl     = 31536000
  min_ttl     = 1
  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip = true
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Access-Control-Request-Headers",
          "Access-Control-Request-Method",
          "Origin"
        ]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

resource "aws_cloudfront_origin_request_policy" "gateway" {
  name = "${random_id.app.hex}-gateway"
  cookies_config {
    cookie_behavior = "all"
  }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ]
    }
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_response_headers_policy" "gateway" {
  name = "${random_id.app.hex}-gateway"
  security_headers_config {
    content_security_policy {
      content_security_policy = trimspace(replace(
        <<-EOF
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
        ,"/\\s+/"
        ," "
      ))
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
    cache_policy_id = aws_cloudfront_cache_policy.gateway.id
    cached_methods = [
      "GET",
      "HEAD",
      "OPTIONS"
    ]
    compress = true
    origin_request_policy_id = aws_cloudfront_origin_request_policy.gateway.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.gateway.id
    target_origin_id       = aws_s3_bucket.app.id
    viewer_protocol_policy = "redirect-to-https"
  }
  default_root_object = "index.html"
  enabled             = true
  origin {
    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
    domain_name = aws_s3_bucket_website_configuration.app.website_endpoint
    origin_id   = aws_s3_bucket.app.id
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
