# Lambda Module
# Creates Lambda functions with Function URLs (no API Gateway needed)

# Backend API Lambda Function
resource "aws_lambda_function" "backend_api" {
  function_name = "kpz-backend-api-${var.environment}"
  role          = var.lambda_role_arn
  handler       = "lambda.handler"
  runtime       = "nodejs18.x"

  # Deployment package (will be updated via CI/CD)
  filename         = var.lambda_zip_path
  source_code_hash = fileexists(var.lambda_zip_path) ? filebase64sha256(var.lambda_zip_path) : null

  timeout     = 30  # seconds
  memory_size = 512 # MB

  environment {
    variables = merge(
      {
        NODE_ENV = var.environment
      },
      var.environment_variables
    )
  }

  tags = {
    Name        = "kpz-backend-api-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
    Service     = "backend-api"
  }

  # Ignore changes to deployment package
  # Code is deployed separately via backend deployment workflow
  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "backend_api" {
  name              = "/aws/lambda/kpz-backend-api-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "kpz-backend-api-logs-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
