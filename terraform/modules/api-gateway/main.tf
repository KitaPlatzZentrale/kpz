# API Gateway HTTP API Module
# Creates HTTP API with Lambda integration

# HTTP API
resource "aws_apigatewayv2_api" "backend" {
  name          = "kpz-backend-api-${var.environment}"
  protocol_type = "HTTP"
  description   = "KPZ Backend API (${var.environment})"

  cors_configuration {
    allow_credentials = false  # Must be false when allow_origins is "*"
    allow_headers     = ["*"]
    allow_methods     = ["*"]
    allow_origins     = var.cors_allow_origins
    max_age           = 86400
  }

  tags = {
    Name        = "kpz-backend-api-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Lambda Integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.backend.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Default Route (catches all paths)
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.backend.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Default Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.backend.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = var.log_group_arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }

  tags = {
    Name        = "kpz-backend-api-stage-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.backend.execution_arn}/*/*"
}
