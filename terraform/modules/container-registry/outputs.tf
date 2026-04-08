output "repository_url" {
  description = "URL of the ECR repository for the backend service"
  value       = aws_ecr_repository.backend.repository_url
}