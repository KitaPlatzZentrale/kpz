# EventBridge Scheduler Module Outputs

output "schedule_arn" {
  description = "ARN of the EventBridge schedule"
  value       = aws_scheduler_schedule.lambda_trigger.arn
}

output "schedule_name" {
  description = "Name of the EventBridge schedule"
  value       = aws_scheduler_schedule.lambda_trigger.name
}

output "schedule_state" {
  description = "State of the EventBridge schedule (ENABLED or DISABLED)"
  value       = aws_scheduler_schedule.lambda_trigger.state
}

output "scheduler_role_arn" {
  description = "ARN of the IAM role used by EventBridge Scheduler"
  value       = aws_iam_role.eventbridge_scheduler.arn
}
