resource "random_pet" "app" {
}

resource "random_id" "app" {
  byte_length = 3
  prefix      = "${random_pet.app.id}-"
}

resource "aws_s3_bucket" "app" {
  bucket = random_id.app.hex
  force_destroy = true
  tags = {
    "app" = random_id.app.hex
  }
}

resource "aws_s3_bucket_acl" "app" {
  bucket = aws_s3_bucket.app.id
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "app" {
  bucket = aws_s3_bucket.app.id
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
}

resource "aws_s3_bucket_public_access_block" "app" {
  block_public_acls       = false
  block_public_policy     = false
  bucket                  = aws_s3_bucket.app.id
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id
  versioning_configuration {
    status = "Suspended"
  }
}

resource "aws_s3_bucket_website_configuration" "app" {
  bucket = aws_s3_bucket.app.id
  error_document {
    key = "index.html"
  }
  index_document {
    suffix = "index.html"
  }
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
      type = "*"
      identifiers = [
        "*"
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.id
  policy = data.aws_iam_policy_document.app.json
}
