resource "aws_ecr_repository" "backend" {
  name                 = "kpz-backend-${var.environment}"
  image_tag_mutability = var.environment == "prod" ? "IMMUTABLE" : "MUTABLE"

  tags = {
    Name        = "kpz-backend-${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
    Service     = "backend"
  }
}