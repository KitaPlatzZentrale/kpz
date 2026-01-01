# API Gateway Module Outputs

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "api_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.backend.id
}

output "api_arn" {
  description = "API Gateway ARN"
  value       = aws_apigatewayv2_api.backend.arn
}
