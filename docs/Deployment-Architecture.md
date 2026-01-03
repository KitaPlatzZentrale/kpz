# Deployment Architecture

## Overview

The KPZ deployment architecture separates **infrastructure management** (Terraform) from **application code deployment** (CI/CD workflows). This separation enables:

- **Independent deployment cycles**: Infrastructure changes don't require code rebuilds, and vice versa
- **Faster deployments**: Code updates skip Terraform, Lambda function code updates are sub-second
- **Version control**: S3 versioning provides rollback capability for Lambda code
- **CI/CD compatibility**: Workflows can deploy code without local file dependencies
- **Local development**: Developers can test infrastructure changes without AWS S3 access

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   TERRAFORM      │         │   CI/CD          │
│   (Infrastructure)│         │   (Code)         │
└──────────────────┘         └──────────────────┘
        │                             │
        │ Creates:                    │ Manages:
        │ • Lambda function           │ • npm run build
        │ • IAM roles                 │ • Zip creation
        │ • EventBridge schedule      │ • S3 upload (versioned)
        │ • S3 buckets                │ • Lambda code update
        │ • API Gateway               │
        │ • CloudFront                │
        │                             │
        └─────────┬───────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │   S3 BUCKET      │
        │   (Bridge)       │
        │                  │
        │ kpz-lambda-      │
        │ artifacts-dev/   │
        │                  │
        │ • backend-api/*  │
        │ • scraper/*      │
        └──────────────────┘
                  │
                  │ Lambda reads from
                  ▼
        ┌──────────────────┐
        │  LAMBDA FUNCTION │
        │                  │
        │ kpz-scraper-dev  │
        │ kpz-backend-api  │
        └──────────────────┘
```

## Separation of Concerns

### Terraform Responsibilities

**What Terraform Manages**:
- Lambda function resources (but NOT the code inside)
- IAM roles and policies
- EventBridge schedules and targets
- S3 buckets (structure, versioning, lifecycle policies)
- API Gateway configurations
- CloudFront distributions
- VPC and networking
- Security groups
- CloudWatch log groups

**What Terraform Ignores**:
- Lambda function code updates (via `lifecycle.ignore_changes`)
- S3 object versions
- Source code hashes
- Last modified timestamps

**Terraform Configuration** (`terraform/modules/compute/lambda/main.tf:39-50`):
```hcl
lifecycle {
  ignore_changes = [
    filename,
    source_code_hash,
    s3_key,
    s3_object_version,
    last_modified
  ]
}
```

### CI/CD Workflow Responsibilities

**What CI/CD Manages**:
- Building application code (`npm run build`)
- Running tests
- Creating deployment packages (zip files)
- Uploading to S3 with versioning
- Updating Lambda function code
- Cache invalidation (CloudFront)
- Deployment verification

**What CI/CD Does NOT Touch**:
- Infrastructure resources
- IAM permissions
- EventBridge schedules
- S3 bucket configuration

**Workflow Steps** (`.github/workflows/deploy_scraper_dev.yml:32-77`):
```yaml
1. Build code → npm run build
2. Create zip → scraper/dist/index.zip
3. Upload versioned → s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-20250103-143000.zip
4. Upload latest → s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-latest.zip
5. Update Lambda → aws lambda update-function-code
6. Wait for update → aws lambda wait function-updated
7. Verify → aws lambda get-function
```

## Deployment Methods

### Local Development (Terraform Only)

For local testing, developers can deploy Lambda functions using local zip files:

**Prerequisites**:
- Built Lambda code: `cd scraper && npm run build`
- AWS credentials configured (SSO or environment variables)
- Terraform initialized: `terraform init`

**Configuration** (`terraform/environments/dev/main.tf:73-91`):
```hcl
module "lambda_scraper" {
  source = "../../modules/compute/lambda"

  environment     = "dev"
  function_name   = "scraper"
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 300
  memory_size     = 512
  lambda_role_arn = module.iam.lambda_scraper_service_role_arn
  lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"  # Local file

  environment_variables = {
    MONGO_DB_CONNECTION = var.mongodb_connection_string
  }

  log_retention_days = 7
}
```

**Commands**:
```bash
# Build code
cd scraper
npm run build
cd ../terraform/environments/dev

# Deploy infrastructure + code
terraform plan
terraform apply
```

**When to Use**:
- Testing infrastructure changes before CI/CD
- Emergency fixes (can't wait for workflow)
- Bootstrapping new environments
- Unlocking Terraform state

### CI/CD Deployment (GitHub Actions)

For production-like deployments, workflows handle code deployment automatically:

**Triggers** (`.github/workflows/deploy_scraper_dev.yml:3-10`):
```yaml
on:
  push:
    branches:
      - dev
    paths:
      - 'scraper/**'
      - '.github/workflows/deploy_scraper_dev.yml'
  workflow_dispatch:
```

**Workflow Process**:
1. **Build Phase**: Compiles TypeScript, bundles dependencies
2. **Upload Phase**: Pushes zip to S3 with timestamp + "latest" versions
3. **Update Phase**: Updates Lambda code via AWS CLI
4. **Verification Phase**: Confirms deployment success

**No Local Files Required**: The workflow builds everything in GitHub Actions runner

**Commands**:
```bash
# Trigger workflow manually
gh workflow run deploy_scraper_dev.yml

# Monitor workflow
gh run watch
```

**When to Use**:
- Normal development workflow (preferred)
- Production deployments
- Collaborative development (prevents conflicts)
- Consistent, auditable deployments

## S3 Bucket Structure

### Bucket Organization

**Bucket Name**: `kpz-lambda-artifacts-{environment}`
- Example: `kpz-lambda-artifacts-dev`

**Structure**:
```
kpz-lambda-artifacts-dev/
├── backend-api/
│   ├── kpz-backend-api-dev-20250103-120000.zip  (versioned)
│   ├── kpz-backend-api-dev-20250103-143000.zip  (versioned)
│   └── kpz-backend-api-dev-latest.zip           (always current)
└── scraper/
    ├── kpz-scraper-dev-20250103-120000.zip      (versioned)
    ├── kpz-scraper-dev-20250103-143000.zip      (versioned)
    └── kpz-scraper-dev-latest.zip               (always current)
```

### Versioning Strategy

**S3 Versioning Enabled** (`terraform/modules/storage/lambda-artifacts/main.tf:13-19`):
```hcl
resource "aws_s3_bucket_versioning" "lambda_artifacts" {
  bucket = aws_s3_bucket.lambda_artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

**Benefits**:
- **Rollback capability**: Can revert to any previous version
- **Audit trail**: Complete history of deployments
- **Safety net**: Accidental overwrites don't lose data

**Upload Pattern** (`.github/workflows/deploy_scraper_dev.yml:55-63`):
```bash
# Versioned upload (permanent record)
aws s3 cp scraper/dist/index.zip \
  s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-$(date +%Y%m%d-%H%M%S).zip

# Latest upload (Lambda reference)
aws s3 cp scraper/dist/index.zip \
  s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-latest.zip
```

### Lifecycle Policy

**Automatic Cleanup** (`terraform/modules/storage/lambda-artifacts/main.tf:35-48`):
```hcl
resource "aws_s3_bucket_lifecycle_configuration" "lambda_artifacts" {
  bucket = aws_s3_bucket.lambda_artifacts.id

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 30  # Delete old versions after 30 days
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}
```

**Retention**:
- Current versions: Kept indefinitely
- Old versions: Deleted after 30 days
- Incomplete uploads: Aborted after 7 days

## Dual Deployment Mode Implementation

### Lambda Module Variables

The Lambda module supports both deployment methods through mutually exclusive variables:

**Variables** (`terraform/modules/compute/lambda/variables.tf:37-62`):
```hcl
variable "lambda_zip_path" {
  description = "Path to Lambda zip file. Use for local deployment."
  type        = string
  default     = null
}

variable "s3_bucket" {
  description = "S3 bucket for Lambda code. Use for CI/CD deployment."
  type        = string
  default     = null
}

variable "s3_key" {
  description = "S3 key to Lambda zip. Required if s3_bucket is set."
  type        = string
  default     = null
}

variable "s3_object_version" {
  description = "S3 object version. Optional, enables versioned deployments."
  type        = string
  default     = null
}
```

**Validation**:
```hcl
validation {
  condition     = var.lambda_zip_path == null || var.s3_bucket == null
  error_message = "Cannot specify both lambda_zip_path and s3_bucket."
}
```

### Conditional Resource Configuration

**Lambda Function** (`terraform/modules/compute/lambda/main.tf:14-27`):
```hcl
resource "aws_lambda_function" "function" {
  function_name = "kpz-${var.function_name}-${var.environment}"
  role          = var.lambda_role_arn
  handler       = var.handler
  runtime       = var.runtime
  timeout       = var.timeout
  memory_size   = var.memory_size

  # Local deployment (for development)
  filename         = var.s3_bucket == null ? var.lambda_zip_path : null
  source_code_hash = var.s3_bucket == null && var.lambda_zip_path != null ?
                     (fileexists(var.lambda_zip_path) ? filebase64sha256(var.lambda_zip_path) : null) : null

  # S3 deployment (for CI/CD)
  s3_bucket         = var.s3_bucket
  s3_key            = var.s3_key
  s3_object_version = var.s3_object_version
}
```

**Logic**:
- If `s3_bucket` is null → use `filename` (local file)
- If `s3_bucket` is set → use `s3_bucket`, `s3_key`, `s3_object_version`
- Terraform ignores changes to code-related attributes (lifecycle rules)

## Best Practices

### 1. Never Mix Deployment Methods in Same Environment

**✅ Good**:
```hcl
# Dev environment - local files
lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"

# Prod environment - S3
s3_bucket = "kpz-lambda-artifacts-prod"
s3_key    = "scraper/kpz-scraper-prod-latest.zip"
```

**❌ Bad**:
```hcl
# Don't specify both
lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"
s3_bucket       = "kpz-lambda-artifacts-dev"  # ERROR: Validation fails
```

### 2. Always Use "latest" Key for Lambda Updates

**✅ Good** (`.github/workflows/deploy_scraper_dev.yml:65-70`):
```bash
# Upload versioned (for history)
aws s3 cp scraper/dist/index.zip \
  s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-$(date +%Y%m%d-%H%M%S).zip

# Upload latest (for Lambda)
aws s3 cp scraper/dist/index.zip \
  s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-latest.zip
```

**Why**: Terraform doesn't track S3 object versions, so using a consistent "latest" key prevents drift.

### 3. Build Code Before Local Terraform Apply

**✅ Good**:
```bash
cd scraper
npm run build  # Creates dist/index.zip
cd ../terraform/environments/dev
terraform apply
```

**❌ Bad**:
```bash
cd terraform/environments/dev
terraform apply  # ERROR: zip file doesn't exist
```

### 4. Use Workflow Dispatch for Manual Deployments

**✅ Good**:
```bash
# Trigger workflow manually
gh workflow run deploy_scraper_dev.yml
```

**❌ Bad**:
```bash
# Don't bypass workflow by uploading directly
aws s3 cp scraper/dist/index.zip s3://kpz-lambda-artifacts-dev/scraper/...
aws lambda update-function-code ...
```

**Why**: Workflows include verification, logging, and notifications that manual commands skip.

### 5. Keep Terraform State and Lambda Artifacts Separate

**✅ Good**:
```
kpz-terraform-state/        → Terraform state files
kpz-lambda-artifacts-dev/   → Lambda deployment packages
```

**❌ Bad**:
```
kpz-terraform-state/
├── dev/terraform.tfstate
└── lambda-deployments/     → Don't mix state and artifacts
    └── scraper.zip
```

**Why**: State files require strict locking and versioning. Lambda artifacts have different lifecycle requirements.

## Troubleshooting

### Terraform Detects Code Changes

**Problem**: Terraform plan shows Lambda code changes despite lifecycle rules.

**Cause**: Using local file deployment mode (`lambda_zip_path`) without lifecycle rules.

**Solution**: Verify lifecycle rules exist in `terraform/modules/compute/lambda/main.tf:39-50`:
```hcl
lifecycle {
  ignore_changes = [
    filename,
    source_code_hash,
    s3_key,
    s3_object_version,
    last_modified
  ]
}
```

### Workflow Fails: "InvalidParameterValueException"

**Problem**: Lambda update fails with "The provided key does not exist in the bucket."

**Cause**: Workflow uploaded to wrong S3 path, or S3 bucket doesn't exist.

**Solution**:
1. Verify S3 bucket exists: `aws s3 ls s3://kpz-lambda-artifacts-dev/`
2. Check workflow upload path matches Lambda update path
3. Ensure Terraform created S3 bucket: `terraform apply` in environments/dev

### Local Terraform Apply Fails: "File not found"

**Problem**: `terraform apply` fails with "lambda_zip_path file does not exist."

**Cause**: Lambda code not built before Terraform apply.

**Solution**:
```bash
cd scraper
npm run build  # Creates dist/index.zip
cd ../terraform/environments/dev
terraform apply
```

### Lambda Code Doesn't Update

**Problem**: Deployed code, but Lambda still runs old version.

**Cause**: Lambda cached old code, or update-function-code failed silently.

**Solution**:
1. Check workflow logs for errors
2. Verify S3 upload succeeded: `aws s3 ls s3://kpz-lambda-artifacts-dev/scraper/`
3. Check Lambda last modified: `aws lambda get-function --function-name kpz-scraper-dev`
4. Force update with version ID:
   ```bash
   aws lambda update-function-code \
     --function-name kpz-scraper-dev \
     --s3-bucket kpz-lambda-artifacts-dev \
     --s3-key scraper/kpz-scraper-dev-latest.zip \
     --s3-object-version <version-id>
   ```

## Migration Guide

### Migrating Existing Lambda to S3 Deployment

If you have a Lambda function using local file deployment and want to migrate to S3:

**Step 1: Create S3 bucket via Terraform**
```hcl
# In terraform/environments/{env}/main.tf
module "s3_lambda_artifacts" {
  source = "../../modules/storage/lambda-artifacts"
  environment = "dev"
}
```

**Step 2: Update Lambda module configuration**
```hcl
# Before
module "lambda_scraper" {
  source = "../../modules/compute/lambda"
  lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"
  # ...
}

# After
module "lambda_scraper" {
  source = "../../modules/compute/lambda"
  s3_bucket = "kpz-lambda-artifacts-dev"
  s3_key    = "scraper/kpz-scraper-dev-latest.zip"
  # ...
}
```

**Step 3: Upload initial code to S3**
```bash
cd scraper
npm run build
aws s3 cp dist/index.zip s3://kpz-lambda-artifacts-dev/scraper/kpz-scraper-dev-latest.zip
```

**Step 4: Apply Terraform**
```bash
cd terraform/environments/dev
terraform apply
```

**Step 5: Create deployment workflow**

Use `.github/workflows/deploy_scraper_dev.yml` as template.

## Related Documentation

- **Scraper Lambda Deployment**: `docs/Scraper-Lambda-Deployment.md`
- **General Deployment Setup**: `docs/Deployment-Setup.md`
- **Terraform Modules**: `terraform/modules/README.md` (if exists)
- **GitHub Actions Workflows**: `.github/workflows/README.md` (if exists)
