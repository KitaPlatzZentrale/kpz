# Lambda Artifacts S3 Bucket Outputs

output "bucket_name" {
  description = "Name of the Lambda artifacts S3 bucket"
  value       = aws_s3_bucket.lambda_artifacts.id
}

output "bucket_arn" {
  description = "ARN of the Lambda artifacts S3 bucket"
  value       = aws_s3_bucket.lambda_artifacts.arn
}

output "bucket_regional_domain_name" {
  description = "Regional domain name of the Lambda artifacts S3 bucket"
  value       = aws_s3_bucket.lambda_artifacts.bucket_regional_domain_name
}
