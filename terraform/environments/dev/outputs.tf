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

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}
