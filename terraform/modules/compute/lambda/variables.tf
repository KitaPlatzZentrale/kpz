# Lambda Module Variables

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "lambda_role_arn" {
  description = "ARN of the IAM role for Lambda execution"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment package (.zip file)"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "cors_allow_origins" {
  description = "CORS allowed origins for Function URL"
  type        = list(string)
  default     = ["*"]
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}
