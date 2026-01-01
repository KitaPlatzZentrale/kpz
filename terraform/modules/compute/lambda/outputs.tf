# Lambda Module Outputs

output "function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.backend_api.function_name
}

output "function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.backend_api.arn
}

output "invoke_arn" {
  description = "ARN to invoke the Lambda function"
  value       = aws_lambda_function.backend_api.invoke_arn
}

output "log_group_arn" {
  description = "CloudWatch Log Group ARN"
  value       = aws_cloudwatch_log_group.backend_api.arn
}
