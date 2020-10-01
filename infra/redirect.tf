resource "aws_s3_bucket" "redirect" {
  bucket = "${random_id.app.hex}-redirect"
  cors_rule {
    allowed_headers = [
      "*"
    ]
    allowed_methods = [
      "GET",
      "HEAD"
    ]
    allowed_origins = [
      "*"
    ]
    max_age_seconds = 3000
  }
  force_destroy = true
  versioning {
    enabled = false
  }
  tags = {
    "app" = random_id.app.hex
  }
  website {
    redirect_all_requests_to = "https://${aws_route53_record.gateway.name}"
  }
}

data "aws_iam_policy_document" "redirect" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.redirect.arn}/*"
    ]
    principals {
      type = "*"
      identifiers = [
        "*"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "redirect" {
  bucket = aws_s3_bucket.redirect.id
  policy = data.aws_iam_policy_document.redirect.json
}

resource "aws_cloudfront_distribution" "redirect" {
  aliases = [
    aws_acm_certificate.www.domain_name
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
    lambda_function_association {
      event_type   = "origin-request"
      include_body = false
      lambda_arn   = aws_lambda_function.gateway.qualified_arn
    }
    lambda_function_association {
      event_type   = "origin-response"
      include_body = false
      lambda_arn   = aws_lambda_function.gateway.qualified_arn
    }
    target_origin_id       = aws_s3_bucket.redirect.id
    viewer_protocol_policy = "redirect-to-https"
  }
  enabled = true
  origin {
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
    domain_name = aws_s3_bucket.redirect.website_endpoint
    origin_id   = aws_s3_bucket.redirect.id
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
    acm_certificate_arn      = aws_acm_certificate.www.arn
    minimum_protocol_version = "TLSv1.1_2016"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_record" "redirect" {
  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.redirect.domain_name
    zone_id                = aws_cloudfront_distribution.redirect.hosted_zone_id
  }
  name    = aws_acm_certificate.www.domain_name
  type    = "A"
  zone_id = aws_route53_zone.primary.zone_id
}
