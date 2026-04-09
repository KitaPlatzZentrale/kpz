variable "environment" {
  description = "Deployment environment (e.g., 'dev', 'staging', 'prod')"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-central-1"
}