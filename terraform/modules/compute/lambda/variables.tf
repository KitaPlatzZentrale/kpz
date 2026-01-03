# Lambda Module Variables

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "function_name" {
  description = "Name of the Lambda function (without environment suffix)"
  type        = string
}

variable "handler" {
  description = "Lambda function handler (e.g., 'index.handler' or 'lambda.handler')"
  type        = string
  default     = "index.handler"
}

variable "runtime" {
  description = "Lambda function runtime"
  type        = string
  default     = "nodejs18.x"
}

variable "timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
  validation {
    condition     = var.timeout >= 1 && var.timeout <= 900
    error_message = "Lambda timeout must be between 1 and 900 seconds"
  }
}

variable "memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512
  validation {
    condition     = var.memory_size >= 128 && var.memory_size <= 10240
    error_message = "Lambda memory must be between 128 and 10240 MB"
  }
}

variable "lambda_role_arn" {
  description = "ARN of the IAM role for Lambda execution"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda deployment package (.zip file). Use for local deployment. Mutually exclusive with s3_bucket."
  type        = string
  default     = null
  validation {
    condition     = var.lambda_zip_path == null || var.s3_bucket == null
    error_message = "Cannot specify both lambda_zip_path and s3_bucket. Choose one deployment method."
  }
}

variable "s3_bucket" {
  description = "S3 bucket containing the Lambda deployment package. Use for CI/CD deployment. Mutually exclusive with lambda_zip_path."
  type        = string
  default     = null
}

variable "s3_key" {
  description = "S3 key (path) to the Lambda deployment package. Required if s3_bucket is set."
  type        = string
  default     = null
}

variable "s3_object_version" {
  description = "S3 object version of the Lambda deployment package. Optional, enables versioned deployments."
  type        = string
  default     = null
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}
