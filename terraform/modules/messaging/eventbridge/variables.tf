# EventBridge Scheduler Module Variables

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "schedule_name" {
  description = "Name of the EventBridge schedule"
  type        = string
}

variable "schedule_description" {
  description = "Description of the schedule purpose"
  type        = string
  default     = ""
}

variable "schedule_expression" {
  description = "Schedule expression (cron or rate). Example: 'cron(0 2 * * ? *)' for daily at 2 AM UTC"
  type        = string
}

variable "schedule_timezone" {
  description = "Timezone for the schedule expression (IANA timezone format)"
  type        = string
  default     = "UTC"
}

variable "schedule_enabled" {
  description = "Whether the schedule is enabled"
  type        = bool
  default     = true
}

variable "target_lambda_arn" {
  description = "ARN of the Lambda function to invoke"
  type        = string
}

variable "target_lambda_function_name" {
  description = "Name of the Lambda function to invoke"
  type        = string
}

variable "max_event_age_seconds" {
  description = "Maximum age of a request that EventBridge sends to a target for processing (60-86400 seconds)"
  type        = number
  default     = 86400 # 24 hours
  validation {
    condition     = var.max_event_age_seconds >= 60 && var.max_event_age_seconds <= 86400
    error_message = "max_event_age_seconds must be between 60 and 86400 seconds"
  }
}

variable "max_retry_attempts" {
  description = "Maximum number of retry attempts to make before the request fails (0-185)"
  type        = number
  default     = 2
  validation {
    condition     = var.max_retry_attempts >= 0 && var.max_retry_attempts <= 185
    error_message = "max_retry_attempts must be between 0 and 185"
  }
}
