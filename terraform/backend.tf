# Terraform State Backend Configuration
# Uses S3 with native locking (Terraform 1.11+)
# No DynamoDB required - saves ~€1-2/month

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
    key            = "terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    use_lockfile   = true  # Native S3 locking (Terraform 1.11+)
  }
}

# Note: The S3 bucket must be created manually before first terraform init:
#
# aws s3api create-bucket \
#   --bucket kpz-terraform-state \
#   --region eu-central-1 \
#   --create-bucket-configuration LocationConstraint=eu-central-1
#
# aws s3api put-bucket-versioning \
#   --bucket kpz-terraform-state \
#   --versioning-configuration Status=Enabled
#
# aws s3api put-bucket-encryption \
#   --bucket kpz-terraform-state \
#   --server-side-encryption-configuration \
#   '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
