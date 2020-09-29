data "external" "mktemp" {
  program = [
    "bash",
    "-c",
    "printf '{ \"path\": \"%s\" }\n' $(mktemp)"
  ]
}

data "archive_file" "gateway" {
  type        = "zip"
  source_dir = "${path.module}/../dist/lambda"
  output_path = data.external.mktemp.result.path
}

data "aws_iam_policy_document" "gateway" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type = "Service"
      identifiers = [
        "edgelambda.amazonaws.com",
        "lambda.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "gateway" {
  assume_role_policy = data.aws_iam_policy_document.gateway.json
  name = "${random_id.app.hex}-gateway"
  path               = "/"
  tags = {
    "app" = random_id.app.hex
  }
}

resource "aws_iam_role_policy_attachment" "gateway" {
  role       = aws_iam_role.gateway.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "gateway" {
  filename      = data.archive_file.gateway.output_path
  function_name = "${random_id.app.hex}-gateway"
  handler       = "index.handler"
  lifecycle {
    ignore_changes = [
      filename
    ]
  }
  publish          = true
  role             = aws_iam_role.gateway.arn
  runtime          = "nodejs12.x"
  source_code_hash = data.archive_file.gateway.output_base64sha256
  tags = {
    "app" = random_id.app.hex
  }
}

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
