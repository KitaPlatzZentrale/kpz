# KPZ Development Environment
# Deploys Lambda-based infrastructure to kpz-dev AWS account

terraform {
  required_version = "= 1.14.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "kpz-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    use_lockfile   = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "KPZ"
      Environment = "dev"
      ManagedBy   = "Terraform"
    }
  }
}

# IAM Module
module "iam" {
  source = "../../modules/iam"

  environment    = "dev"
  aws_region     = var.aws_region
  github_repo    = var.github_repo
  github_branch  = "dev"
}

# Lambda Module - Backend API
module "lambda_backend_api" {
  source = "../../modules/compute/lambda"

  environment   = "dev"
  lambda_role_arn = module.iam.lambda_backend_api_role_arn
  lambda_zip_path = "${path.module}/../../../backend/dist/lambda.zip"

  environment_variables = {
    MONGO_DB_CONNECTION = var.mongodb_connection_string
  }

  cors_allow_origins = [
    "*"  # Allow all origins for dev
  ]

  log_retention_days = 7
}

# S3 Module - Frontend
module "s3_frontend" {
  source = "../../modules/storage/s3"

  environment = "dev"
}
