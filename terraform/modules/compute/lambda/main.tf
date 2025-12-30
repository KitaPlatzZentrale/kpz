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
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  timeout     = 30  # seconds
  memory_size = 512 # MB

  environment {
    variables = merge(
      {
        NODE_ENV                 = var.environment
        AWS_LAMBDA_FUNCTION_NAME = "kpz-backend-api-${var.environment}"
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
}

# Lambda Function URL (replaces API Gateway)
resource "aws_lambda_function_url" "backend_api" {
  function_name      = aws_lambda_function.backend_api.function_name
  authorization_type = "NONE"  # Public access (add auth later if needed)

  cors {
    allow_credentials = true
    allow_origins     = var.cors_allow_origins
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers     = ["content-type", "authorization"]
    max_age           = 86400
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

# Lambda Permission for Function URL
resource "aws_lambda_permission" "backend_api_url" {
  statement_id           = "AllowFunctionURLInvoke"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.backend_api.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
