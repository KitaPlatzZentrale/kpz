# CloudFront CDN Module
# Adds HTTPS support and CDN caching for S3-hosted frontend

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "KPZ Frontend CDN - ${var.environment}"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"  # US, Canada, Europe

  origin {
    domain_name = var.s3_website_endpoint
    origin_id   = "S3-${var.s3_bucket_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"  # S3 website endpoints only support HTTP
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.s3_bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # Custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  tags = {
    Name        = "kpz-frontend-cdn-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
