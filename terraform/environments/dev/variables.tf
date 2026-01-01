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

variable "api_key" {
  description = "API key for backend services"
  type        = string
  sensitive   = true
}

variable "auth_key" {
  description = "Authentication key for backend"
  type        = string
  sensitive   = true
}

variable "kita_api_url" {
  description = "URL for Kita API"
  type        = string
}
