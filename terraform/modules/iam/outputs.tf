# IAM Module Outputs

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role"
  value       = aws_iam_role.github_actions.arn
}

output "lambda_backend_api_role_arn" {
  description = "ARN of the Lambda backend API execution role"
  value       = aws_iam_role.lambda_backend_api.arn
}

output "lambda_email_service_role_arn" {
  description = "ARN of the Lambda email service execution role"
  value       = aws_iam_role.lambda_email_service.arn
}

output "lambda_notification_service_role_arn" {
  description = "ARN of the Lambda notification service execution role"
  value       = aws_iam_role.lambda_notification_service.arn
}
