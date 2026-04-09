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
    key            = "dev-eks/terraform.tfstate"
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
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}