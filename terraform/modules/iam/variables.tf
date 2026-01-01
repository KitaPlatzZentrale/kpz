# IAM Module Variables

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "github_repo" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
}

variable "github_branch" {
  description = "GitHub branch allowed to assume the role"
  type        = string
}
