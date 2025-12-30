# Development Environment Variables

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-central-1"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
  default     = "KitaPlatzZentrale/kpz"
}

variable "mongodb_connection_string" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}
