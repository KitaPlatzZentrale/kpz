# API Gateway Module Variables

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function to integrate"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "ARN to invoke the Lambda function"
  type        = string
}

variable "log_group_arn" {
  description = "CloudWatch Log Group ARN for API Gateway logs"
  type        = string
}

variable "cors_allow_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["*"]
}
