# CloudFront Module Variables

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the frontend"
  type        = string
}

variable "s3_website_endpoint" {
  description = "S3 website endpoint (without http://)"
  type        = string
}
