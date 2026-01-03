# ACM Certificate Module for CloudFront
# Creates SSL/TLS certificate in us-east-1 (required for CloudFront)

resource "aws_acm_certificate" "cloudfront" {
  # CloudFront requires certificates to be in us-east-1
  provider = aws.us-east-1

  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "kpz-${var.environment}-cloudfront-cert"
    Environment = var.environment
    ManagedBy   = "terraform"
    Domain      = var.domain_name
  }
}

# DNS validation records
# Note: These records must be created in Route53 hosted zone
# in the management account (216360990183)
resource "aws_acm_certificate_validation" "cloudfront" {
  # CloudFront requires certificates to be in us-east-1
  provider = aws.us-east-1

  certificate_arn = aws_acm_certificate.cloudfront.arn

  # Only validate if auto_validate is enabled
  # Set to false if DNS records need to be created manually in another account
  count = var.auto_validate ? 1 : 0

  # Validation will timeout if DNS records are not created
  timeouts {
    create = "45m"
  }
}
