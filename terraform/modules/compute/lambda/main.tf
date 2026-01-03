# Lambda Module
# Generic module for creating Lambda functions

# Lambda Function
resource "aws_lambda_function" "function" {
  function_name = "kpz-${var.function_name}-${var.environment}"
  role          = var.lambda_role_arn
  handler       = var.handler
  runtime       = var.runtime

  # Deployment package - supports both local files and S3
  # Local deployment (for development)
  filename         = var.s3_bucket == null ? var.lambda_zip_path : null
  source_code_hash = var.s3_bucket == null && var.lambda_zip_path != null ? (fileexists(var.lambda_zip_path) ? filebase64sha256(var.lambda_zip_path) : null) : null

  # S3 deployment (for CI/CD)
  s3_bucket         = var.s3_bucket
  s3_key            = var.s3_key
  s3_object_version = var.s3_object_version

  timeout     = var.timeout
  memory_size = var.memory_size

  environment {
    variables = merge(
      {
        NODE_ENV = var.environment
      },
      var.environment_variables
    )
  }

  tags = {
    Name        = "kpz-${var.function_name}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
    Service     = var.function_name
  }

  # Ignore changes to deployment package
  # Code is deployed separately via deployment workflows
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      s3_key,
      s3_object_version,
      last_modified
    ]
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/kpz-${var.function_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "kpz-${var.function_name}-logs-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
