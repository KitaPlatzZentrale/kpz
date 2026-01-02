# KPZ Development Environment
# Deploys Lambda-based infrastructure to kpz-dev AWS account
# Trigger Terraform workflow to apply IAM role updates

terraform {
  required_version = "= 1.13.1"

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
    # profile is set via AWS_PROFILE environment variable for local development
    # GitHub Actions uses OIDC authentication (no profile needed)
  }
}

provider "aws" {
  region  = var.aws_region
  # profile is set via AWS_PROFILE environment variable for local development
  # GitHub Actions uses OIDC authentication (no profile needed)

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
    API_KEY             = var.api_key
    AUTH_KEY            = var.auth_key
    KITA_API_URL        = var.kita_api_url
  }

  cors_allow_origins = [
    "*"  # Allow all origins for dev
  ]

  log_retention_days = 7
}

# API Gateway Module - HTTP API for Lambda
module "api_gateway" {
  source = "../../modules/api-gateway"

  environment          = "dev"
  lambda_function_name = module.lambda_backend_api.function_name
  lambda_invoke_arn    = module.lambda_backend_api.invoke_arn
  log_group_arn        = module.lambda_backend_api.log_group_arn

  cors_allow_origins = [
    "*"  # Allow all origins for dev
  ]
}

# S3 Module - Frontend
module "s3_frontend" {
  source = "../../modules/storage/s3"

  environment = "dev"
}

# CloudFront CDN - HTTPS support for frontend
module "cloudfront" {
  source = "../../modules/cdn"

  environment          = "dev"
  s3_bucket_name       = module.s3_frontend.bucket_name
  s3_website_endpoint  = module.s3_frontend.website_endpoint
}
