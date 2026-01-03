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

variable "domain_name" {
  description = "Custom domain name for CloudFront distribution (e.g., kitaplatz-zentrale.de). Leave empty to use default CloudFront domain."
  type        = string
  default     = null
}

variable "alternate_domain_names" {
  description = "Additional domain names (e.g., www.kitaplatz-zentrale.de). Only used if domain_name is set."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of ACM certificate in us-east-1. Required if domain_name is set."
  type        = string
  default     = null
}
