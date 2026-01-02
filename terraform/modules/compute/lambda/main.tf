# Lambda Module
# Generic module for creating Lambda functions

# Lambda Function
resource "aws_lambda_function" "function" {
  function_name = "kpz-${var.function_name}-${var.environment}"
  role          = var.lambda_role_arn
  handler       = var.handler
  runtime       = var.runtime

  # Deployment package (will be updated via CI/CD)
  filename         = var.lambda_zip_path
  source_code_hash = fileexists(var.lambda_zip_path) ? filebase64sha256(var.lambda_zip_path) : null

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
      source_code_hash
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
