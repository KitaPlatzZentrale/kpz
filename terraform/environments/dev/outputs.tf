# Development Environment Outputs

output "github_actions_role_arn" {
  description = "GitHub Actions IAM role ARN for deployment"
  value       = module.iam.github_actions_role_arn
}

output "backend_api_url" {
  description = "Backend API Lambda Function URL"
  value       = module.lambda_backend_api.function_url
}

output "frontend_website_url" {
  description = "Frontend S3 website URL"
  value       = module.s3_frontend.website_url
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.s3_frontend.bucket_name
}
