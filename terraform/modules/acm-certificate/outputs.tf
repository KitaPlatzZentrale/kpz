# ACM Certificate Module Outputs

output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.cloudfront.arn
}

output "certificate_domain_name" {
  description = "Domain name of the certificate"
  value       = aws_acm_certificate.cloudfront.domain_name
}

output "certificate_status" {
  description = "Status of the certificate"
  value       = aws_acm_certificate.cloudfront.status
}

output "domain_validation_options" {
  description = "DNS validation records that must be created in Route53"
  value       = aws_acm_certificate.cloudfront.domain_validation_options
  sensitive   = false
}

output "validation_records" {
  description = "Simplified DNS validation records for easier consumption"
  value = [
    for dvo in aws_acm_certificate.cloudfront.domain_validation_options : {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      value  = dvo.resource_record_value
      domain = dvo.domain_name
    }
  ]
}
