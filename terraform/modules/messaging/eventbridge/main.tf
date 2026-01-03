# EventBridge Scheduler Module
# Creates EventBridge schedules for triggering Lambda functions

# EventBridge Scheduler Schedule
resource "aws_scheduler_schedule" "lambda_trigger" {
  name        = var.schedule_name
  description = var.schedule_description

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = var.schedule_expression
  schedule_expression_timezone = var.schedule_timezone

  target {
    arn      = var.target_lambda_arn
    role_arn = aws_iam_role.eventbridge_scheduler.arn

    retry_policy {
      maximum_event_age_in_seconds = var.max_event_age_seconds
      maximum_retry_attempts       = var.max_retry_attempts
    }
  }

  state = var.schedule_enabled ? "ENABLED" : "DISABLED"
}

# IAM Role for EventBridge Scheduler
resource "aws_iam_role" "eventbridge_scheduler" {
  name = "${var.schedule_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "${var.schedule_name}-scheduler-role"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# IAM Policy for EventBridge Scheduler to invoke Lambda
resource "aws_iam_role_policy" "eventbridge_scheduler_lambda" {
  name = "lambda-invoke-policy"
  role = aws_iam_role.eventbridge_scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = var.target_lambda_arn
      }
    ]
  })
}

# Lambda Permission for EventBridge Scheduler
resource "aws_lambda_permission" "eventbridge_scheduler" {
  statement_id  = "AllowExecutionFromEventBridgeScheduler"
  action        = "lambda:InvokeFunction"
  function_name = var.target_lambda_function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.lambda_trigger.arn
}
