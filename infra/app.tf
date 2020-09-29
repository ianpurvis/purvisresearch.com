resource "random_pet" "app" {
}

resource "random_id" "app" {
  byte_length = 3
  prefix      = "${random_pet.app.id}-"
}

resource "aws_s3_bucket" "app" {
  acl    = "private"
  bucket = random_id.app.hex
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
}

resource "aws_s3_bucket_public_access_block" "app" {
  block_public_acls       = true
  block_public_policy     = true
  bucket                  = aws_s3_bucket.app.id
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "app" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.app.arn}/*"
    ]
    principals {
      type = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.gateway.iam_arn
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.id
  policy = data.aws_iam_policy_document.app.json
}
