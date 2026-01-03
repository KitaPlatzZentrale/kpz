# Development Environment Outputs

output "github_actions_role_arn" {
  description = "GitHub Actions IAM role ARN for deployment"
  value       = module.iam.github_actions_role_arn
}

output "backend_api_url" {
  description = "Backend API endpoint via API Gateway"
  value       = module.api_gateway.api_endpoint
}

output "frontend_url" {
  description = "Frontend HTTPS URL via CloudFront"
  value       = module.cloudfront.cloudfront_url
}

output "frontend_s3_url" {
  description = "Frontend S3 website URL (HTTP only - use CloudFront URL instead)"
  value       = module.s3_frontend.website_url
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.s3_frontend.bucket_name
}

output "lambda_artifacts_bucket_name" {
  description = "S3 bucket name for Lambda deployment artifacts"
  value       = module.s3_lambda_artifacts.bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

# Lambda Function Outputs
output "lambda_backend_api_name" {
  description = "Backend API Lambda function name"
  value       = module.lambda_backend_api.function_name
}

output "lambda_scraper_name" {
  description = "Scraper Lambda function name"
  value       = module.lambda_scraper.function_name
}

# EventBridge Schedule Outputs
output "scraper_schedule_arn" {
  description = "EventBridge schedule ARN for scraper"
  value       = module.eventbridge_scraper.schedule_arn
}

output "scraper_schedule_state" {
  description = "EventBridge schedule state (ENABLED or DISABLED)"
  value       = module.eventbridge_scraper.schedule_state
}
