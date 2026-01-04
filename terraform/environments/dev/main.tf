# KPZ Development Environment
# Deploys Lambda-based infrastructure to kpz-dev AWS account
# CloudFront custom domain deployment after DNS propagation

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

# Additional provider for ACM certificates (CloudFront requires us-east-1)
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
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

  environment     = "dev"
  function_name   = "backend-api"
  handler         = "lambda.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 512
  lambda_role_arn = module.iam.lambda_backend_api_role_arn
  lambda_zip_path = "${path.module}/../../../backend/dist/lambda.zip"

  environment_variables = {
    MONGO_DB_CONNECTION = var.mongodb_connection_string
    API_KEY             = var.api_key
    AUTH_KEY            = var.auth_key
    KITA_API_URL        = var.kita_api_url
  }

  log_retention_days = 7
}

# Lambda Module - Scraper Service
module "lambda_scraper" {
  source = "../../modules/compute/lambda"

  environment     = "dev"
  function_name   = "scraper"
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 300 # 5 minutes for scraping operations
  memory_size     = 512
  lambda_role_arn = module.iam.lambda_scraper_service_role_arn
  lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"

  environment_variables = {
    MONGO_DB_CONNECTION = var.mongodb_connection_string
    KITA_API_URL        = var.kita_api_url
  }

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

# S3 Module - Lambda Artifacts
module "s3_lambda_artifacts" {
  source = "../../modules/storage/lambda-artifacts"

  environment = "dev"
}

# ACM Certificate - SSL/TLS for CloudFront
module "acm_certificate" {
  source = "../../modules/acm-certificate"

  providers = {
    aws.us-east-1 = aws.us-east-1
  }

  environment               = "dev"
  domain_name               = "dev.kitaplatz-zentrale.de"
  subject_alternative_names = []

  # Set to false since DNS validation is in management account
  auto_validate = false
}

# CloudFront CDN - HTTPS support for frontend
module "cloudfront" {
  source = "../../modules/cdn"

  environment          = "dev"
  s3_bucket_name       = module.s3_frontend.bucket_name
  s3_website_endpoint  = module.s3_frontend.website_endpoint

  # Custom domain configuration - dev subdomain
  domain_name            = "dev.kitaplatz-zentrale.de"
  alternate_domain_names = []
  acm_certificate_arn    = module.acm_certificate.certificate_arn
}

# EventBridge Schedule - Scraper (Daily at 2 AM UTC)
module "eventbridge_scraper" {
  source = "../../modules/messaging/eventbridge"

  environment                  = "dev"
  schedule_name                = "kpz-dev-scraper-daily"
  schedule_description         = "Triggers Kita data scraper daily at 2 AM UTC"
  schedule_expression          = "cron(0 2 * * ? *)" # Daily at 2 AM UTC
  schedule_timezone            = "UTC"
  schedule_enabled             = true
  target_lambda_arn            = module.lambda_scraper.function_arn
  target_lambda_function_name  = module.lambda_scraper.function_name
  max_event_age_seconds        = 3600  # 1 hour
  max_retry_attempts           = 2
}
