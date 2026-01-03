# ACM Certificate Module Variables

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the certificate"
  type        = string
}

variable "subject_alternative_names" {
  description = "Additional domain names to include in the certificate (e.g., www subdomain)"
  type        = list(string)
  default     = []
}

variable "auto_validate" {
  description = "Automatically validate certificate. Set to false if DNS validation records are in a different AWS account."
  type        = bool
  default     = false
}
