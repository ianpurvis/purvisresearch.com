terraform {
  required_providers {
    archive = {
      source = "hashicorp/archive"
      version = "1.3.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.6.0"
    }
    external = {
      source = "hashicorp/external"
      version = "1.2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "2.3.0"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

output "app" {
  value = random_id.app.hex
}

output "url" {
  value = "https://${aws_route53_zone.primary.name}"
}

output "bucket-uri" {
  value = "s3://${aws_s3_bucket.app.id}"
}

output "name-servers" {
  value = aws_route53_zone.primary.name_servers
}
