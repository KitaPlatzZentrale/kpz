# CloudFront Module Outputs

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_url" {
  description = "Full HTTPS URL for CloudFront distribution"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend.id
}
