#!/bin/bash
# Script to create S3 bucket for Terraform state
# Run this ONCE before first terraform init
#
# Usage:
#   ./setup-terraform-state-bucket.sh              # Uses kpz-dev (default)
#   ./setup-terraform-state-bucket.sh kpz-prod     # Uses kpz-prod

set -e  # Exit on error

# Get profile from argument or use default
PROFILE="${1:-kpz-dev}"
BUCKET_NAME="kpz-terraform-state"
REGION="eu-central-1"

echo "🚀 Creating Terraform state S3 bucket..."
echo "   Bucket: ${BUCKET_NAME}"
echo "   Region: ${REGION}"
echo "   Profile: ${PROFILE}"
echo ""

# Check if bucket already exists
if aws s3 ls "s3://${BUCKET_NAME}" --profile ${PROFILE} 2>/dev/null; then
    echo "✅ Bucket ${BUCKET_NAME} already exists!"
    echo "   Skipping creation (bucket is shared across environments)"
    exit 0
fi

# Create bucket
echo "📦 Creating bucket..."
aws s3api create-bucket \
    --bucket ${BUCKET_NAME} \
    --region ${REGION} \
    --create-bucket-configuration LocationConstraint=${REGION} \
    --profile ${PROFILE}

# Enable versioning
echo "🔄 Enabling versioning..."
aws s3api put-bucket-versioning \
    --bucket ${BUCKET_NAME} \
    --versioning-configuration Status=Enabled \
    --profile ${PROFILE}

# Enable encryption
echo "🔒 Enabling encryption..."
aws s3api put-bucket-encryption \
    --bucket ${BUCKET_NAME} \
    --server-side-encryption-configuration \
    '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}' \
    --profile ${PROFILE}

# Block public access
echo "🛡️  Blocking public access..."
aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --profile ${PROFILE}

# Add bucket tagging
echo "🏷️  Adding tags..."
aws s3api put-bucket-tagging \
    --bucket ${BUCKET_NAME} \
    --tagging 'TagSet=[{Key=Project,Value=KPZ},{Key=Purpose,Value=Terraform-State},{Key=Environment,Value=shared}]' \
    --profile ${PROFILE}

echo ""
echo "✅ Terraform state bucket created successfully!"
echo ""
echo "Bucket details:"
echo "   Name: ${BUCKET_NAME}"
echo "   Region: ${REGION}"
echo "   Versioning: Enabled"
echo "   Encryption: AES256"
echo "   Public Access: Blocked"
echo ""
echo "Next steps:"
echo "1. cd terraform/environments/dev"
echo "2. terraform init"
echo "3. terraform plan"
