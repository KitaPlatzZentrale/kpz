# Lambda Module Outputs

output "function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.backend_api.function_name
}

output "function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.backend_api.arn
}

output "function_url" {
  description = "Function URL for invoking the Lambda"
  value       = aws_lambda_function_url.backend_api.function_url
}

output "function_url_id" {
  description = "ID of the Function URL"
  value       = aws_lambda_function_url.backend_api.url_id
}
