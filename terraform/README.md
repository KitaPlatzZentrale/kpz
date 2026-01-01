# KPZ Terraform Infrastructure

Infrastructure as Code for Kitaplatz-Zentrale using Terraform.

## Architecture

- **Backend API**: AWS Lambda with Function URLs (serverless, ~€2-7/month dev)
- **Frontend**: S3 static hosting (dev), S3 + CloudFront (prod)
- **Database**: MongoDB Atlas (external, managed)
- **Messaging**: EventBridge, SES, SNS
- **State Management**: S3 with native locking (no DynamoDB required)

## Prerequisites

- **Terraform**: Version 1.14.3 (exact pin for reproducibility)
- **AWS CLI**: Configured with appropriate credentials
- **AWS Account**: kpz-dev account access

## Directory Structure

```
terraform/
├── backend.tf                    # Terraform state backend configuration
├── environments/
│   ├── dev/                      # Development environment
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars
│   └── prod/                     # Production environment (future)
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars
└── modules/
    ├── compute/lambda/           # Lambda functions
    ├── iam/                      # IAM roles and policies
    ├── storage/s3/               # S3 buckets
    ├── storage/cloudfront/       # CloudFront (prod only)
    ├── messaging/eventbridge/    # EventBridge rules
    ├── messaging/ses/            # SES email service
    ├── messaging/sns/            # SNS topics
    └── monitoring/               # CloudWatch logs, alarms
```

## Initial Setup

### 1. Create S3 State Bucket (One-time setup)

```bash
# Create bucket
aws s3api create-bucket \
  --bucket kpz-terraform-state \
  --region eu-central-1 \
  --create-bucket-configuration LocationConstraint=eu-central-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket kpz-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket kpz-terraform-state \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

# Enable public access block
aws s3api put-public-access-block \
  --bucket kpz-terraform-state \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Initialize Terraform

```bash
cd terraform/environments/dev
terraform init
```

## Usage

### Plan Changes

```bash
cd terraform/environments/dev
terraform plan
```

### Apply Changes

```bash
cd terraform/environments/dev
terraform apply
```

### Destroy Resources (Use with caution!)

```bash
cd terraform/environments/dev
terraform destroy
```

## Environment Variables

Create `terraform/environments/dev/terraform.tfvars`:

```hcl
# AWS Configuration
aws_region = "eu-central-1"
environment = "dev"

# MongoDB Configuration
mongodb_connection_string = "mongodb+srv://..."

# GitHub Actions
github_repo = "KitaPlatzZentrale/kpz"
github_branch = "dev"

# Slack Notifications
slack_webhook_url = "https://hooks.slack.com/..."
```

## Cost Estimates

### Development Environment
- Lambda (backend API): €0-1/month
- Lambda (services): €0-2/month
- S3 (frontend): €0.50/month
- EventBridge: €0-1/month
- SES: €0/month (free tier)
- SNS: €0/month (negligible)
- CloudWatch Logs: €1-2/month
- **Total: ~€2-7/month**

### Production Environment (future)
- Lambda (backend API): €1-5/month
- Lambda (services): €1-3/month
- S3 (frontend): €0.50/month
- CloudFront: €1-3/month
- Route53: €0.50/month
- EventBridge: €0-1/month
- SES: €0-2/month
- MongoDB Atlas: €10-30/month
- CloudWatch Logs: €2-5/month
- **Total: ~€17-50/month**

## State Management

- **Backend**: S3 with native locking (Terraform 1.11+)
- **No DynamoDB**: Saves ~€1-2/month
- **State file**: `kpz-terraform-state/terraform.tfstate`
- **Locking**: Automatic via S3 conditional writes

## Security

- State file encrypted at rest (AES256)
- State bucket versioning enabled
- Public access blocked
- IAM roles follow principle of least privilege
- Secrets managed via AWS Secrets Manager (future)

## Rollback Strategy

If deployment fails:

1. Review Terraform plan before applying
2. Use version control to track infrastructure changes
3. State file versioning allows rollback to previous state
4. Always test in dev environment first

## Notes

- This infrastructure is Lambda-based (not ECS)
- VPC/networking modules removed (not needed for Lambda with Function URLs)
- MongoDB is external (MongoDB Atlas, not self-hosted)
- Frontend uses S3-only for dev, S3+CloudFront for prod
