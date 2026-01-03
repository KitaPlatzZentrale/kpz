# Scraper Lambda Deployment Guide

This document describes the Terraform infrastructure for the KPZ scraper Lambda function with EventBridge scheduling.

## Overview

The scraper Lambda function runs on a scheduled basis (daily at 2 AM UTC) to scrape Kita data from berlin.de and update MongoDB.

## Architecture

### Components

1. **Lambda Function** (`kpz-scraper-dev`)
   - Runtime: Node.js 18.x
   - Handler: `index.handler`
   - Memory: 512 MB
   - Timeout: 300 seconds (5 minutes)
   - Environment Variables:
     - `MONGO_DB_CONNECTION`: MongoDB Atlas connection string
     - `NODE_ENV`: Environment name (dev/prod)

2. **IAM Role** (`lambda-scraper-service-dev`)
   - Trust policy: Allows Lambda service to assume role
   - Managed policy: `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
   - No additional permissions needed (MongoDB is external)

3. **EventBridge Scheduler** (`kpz-dev-scraper-daily`)
   - Schedule: Daily at 2 AM UTC
   - Cron expression: `cron(0 2 * * ? *)`
   - Retry policy: 2 attempts, 1-hour max event age
   - Target: Scraper Lambda function

4. **CloudWatch Log Group** (`/aws/lambda/kpz-scraper-dev`)
   - Retention: 7 days
   - Auto-created by Lambda execution role

### File Structure

```
terraform/
├── modules/
│   ├── compute/lambda/          # Generic Lambda module (refactored)
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── iam/                     # IAM roles for all services
│   │   ├── main.tf              # Added lambda_scraper_service role
│   │   ├── variables.tf
│   │   └── outputs.tf           # Added lambda_scraper_service_role_arn
│   └── messaging/eventbridge/   # EventBridge Scheduler (NEW)
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/dev/
    ├── main.tf                  # Added scraper Lambda + EventBridge
    ├── variables.tf
    └── outputs.tf               # Added scraper outputs
```

## Key Changes Made

### 1. EventBridge Module (NEW)

Created reusable module at `terraform/modules/messaging/eventbridge/`:

**Features:**
- Flexible schedule expressions (cron or rate)
- Timezone support (IANA format)
- Configurable retry policy
- Automatic IAM role creation for scheduler
- Lambda permission management

**Usage Example:**
```hcl
module "eventbridge_scraper" {
  source = "../../modules/messaging/eventbridge"

  environment                  = "dev"
  schedule_name                = "kpz-dev-scraper-daily"
  schedule_description         = "Triggers Kita data scraper daily at 2 AM UTC"
  schedule_expression          = "cron(0 2 * * ? *)"
  schedule_timezone            = "UTC"
  schedule_enabled             = true
  target_lambda_arn            = module.lambda_scraper.function_arn
  target_lambda_function_name  = module.lambda_scraper.function_name
  max_event_age_seconds        = 3600
  max_retry_attempts           = 2
}
```

### 2. Lambda Module (REFACTORED)

Converted from backend-API-specific to generic reusable module:

**New Variables:**
- `function_name` - Service name (without environment suffix)
- `handler` - Lambda handler (default: `index.handler`)
- `runtime` - Lambda runtime (default: `nodejs18.x`)
- `timeout` - Execution timeout (1-900 seconds)
- `memory_size` - Memory allocation (128-10240 MB)

**Removed Variables:**
- `cors_allow_origins` - Moved to API Gateway module

**Breaking Change:**
- Updated backend API module instance to include new required `function_name` parameter

### 3. IAM Module (UPDATED)

Added scraper execution role:

```hcl
resource "aws_iam_role" "lambda_scraper_service" {
  name = "lambda-scraper-service-${var.environment}"
  # ... assume role policy for lambda.amazonaws.com
}

resource "aws_iam_role_policy_attachment" "lambda_scraper_service_basic" {
  role       = aws_iam_role.lambda_scraper_service.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
```

New output: `lambda_scraper_service_role_arn`

### 4. Dev Environment (UPDATED)

**Backend API Lambda:**
```hcl
module "lambda_backend_api" {
  source = "../../modules/compute/lambda"

  environment     = "dev"
  function_name   = "backend-api"      # NEW
  handler         = "lambda.handler"   # NEW
  runtime         = "nodejs18.x"       # NEW
  timeout         = 30                 # NEW
  memory_size     = 512                # NEW
  # ... rest of configuration
}
```

**Scraper Lambda (NEW):**
```hcl
module "lambda_scraper" {
  source = "../../modules/compute/lambda"

  environment     = "dev"
  function_name   = "scraper"
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 300  # 5 minutes
  memory_size     = 512
  lambda_role_arn = module.iam.lambda_scraper_service_role_arn
  lambda_zip_path = "${path.module}/../../../scraper/dist/index.zip"

  environment_variables = {
    MONGO_DB_CONNECTION = var.mongodb_connection_string
  }

  log_retention_days = 7
}
```

**EventBridge Schedule (NEW):**
```hcl
module "eventbridge_scraper" {
  source = "../../modules/messaging/eventbridge"
  # ... configuration as shown above
}
```

**New Outputs:**
- `lambda_backend_api_name`
- `lambda_scraper_name`
- `scraper_schedule_arn`
- `scraper_schedule_state`

## Deployment Instructions

### Prerequisites

1. **Build Scraper Package:**
   ```bash
   cd scraper
   npm install
   npm run build  # Creates dist/index.zip
   ```

2. **AWS Credentials:**
   - Local: Set `AWS_PROFILE` environment variable
   - GitHub Actions: Uses OIDC (configured via IAM module)

3. **Environment Variables:**
   - `MONGODB_CONNECTION_STRING` - Set via GitHub Secrets or Terraform variables

### Deployment Methods

#### Option 1: GitHub Actions (Recommended)

Push changes to `dev` branch:
```bash
git add terraform/
git commit -m "Add scraper Lambda with EventBridge scheduling"
git push origin dev
```

GitHub Actions workflow (`.github/workflows/terraform-dev.yml`) will:
1. Authenticate via OIDC
2. Run `terraform plan`
3. Run `terraform apply` (auto-approved for dev)

#### Option 2: Local Deployment

```bash
cd terraform/environments/dev

# Set AWS profile
export AWS_PROFILE=kpz-dev

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply changes
terraform apply
```

### First-Time Deployment

If this is the first deployment of the scraper:

1. Ensure scraper build exists:
   ```bash
   ls -lh ../../../scraper/dist/index.zip
   ```

2. Deploy infrastructure:
   ```bash
   terraform apply
   ```

3. Verify Lambda function:
   ```bash
   aws lambda get-function --function-name kpz-scraper-dev
   ```

4. Test Lambda manually:
   ```bash
   aws lambda invoke \
     --function-name kpz-scraper-dev \
     --log-type Tail \
     /tmp/response.json
   ```

5. Check CloudWatch Logs:
   ```bash
   aws logs tail /aws/lambda/kpz-scraper-dev --follow
   ```

## Testing the Schedule

### View Schedule Status

```bash
aws scheduler get-schedule \
  --name kpz-dev-scraper-daily
```

### Disable Schedule (for testing)

Update `terraform/environments/dev/main.tf`:
```hcl
module "eventbridge_scraper" {
  # ...
  schedule_enabled = false
}
```

Then run `terraform apply`.

### Trigger Manual Execution

EventBridge Scheduler doesn't support manual triggers. Use Lambda invoke instead:

```bash
aws lambda invoke \
  --function-name kpz-scraper-dev \
  --payload '{}' \
  /tmp/scraper-response.json

cat /tmp/scraper-response.json
```

### Monitor Schedule Executions

Check Lambda execution history:
```bash
# Get recent invocations
aws logs filter-log-events \
  --log-group-name /aws/lambda/kpz-scraper-dev \
  --start-time $(date -u -d '1 day ago' +%s)000 \
  --query 'events[].message' \
  --output text
```

## Schedule Modification

To change the schedule, update `schedule_expression` in `terraform/environments/dev/main.tf`:

```hcl
module "eventbridge_scraper" {
  # ...
  schedule_expression = "cron(0 2 * * ? *)"  # Current: Daily at 2 AM UTC
}
```

### Common Schedule Patterns

- **Every hour:** `rate(1 hour)`
- **Every 6 hours:** `rate(6 hours)`
- **Daily at 2 AM UTC:** `cron(0 2 * * ? *)`
- **Weekdays at 9 AM CET:** `cron(0 8 ? * MON-FRI *)` + `schedule_timezone = "Europe/Berlin"`
- **First day of month:** `cron(0 0 1 * ? *)`

**Note:** Cron format is AWS EventBridge format (6 fields, not standard 5-field cron).

## Troubleshooting

### Lambda Function Not Created

**Symptom:** `terraform apply` fails with "file not found" error

**Solution:**
```bash
cd scraper
npm run build
ls -lh dist/index.zip  # Verify file exists
```

### EventBridge Not Triggering Lambda

**Symptom:** No Lambda executions in CloudWatch Logs

**Check:**
1. Schedule state:
   ```bash
   aws scheduler get-schedule --name kpz-dev-scraper-daily
   ```

2. Lambda permissions:
   ```bash
   aws lambda get-policy --function-name kpz-scraper-dev
   ```

3. Recent executions:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Invocations \
     --dimensions Name=FunctionName,Value=kpz-scraper-dev \
     --start-time $(date -u -d '1 day ago' --iso-8601) \
     --end-time $(date -u --iso-8601) \
     --period 3600 \
     --statistics Sum
   ```

### Lambda Timeout

**Symptom:** Lambda execution exceeds 300 seconds

**Solution:** Increase timeout in `terraform/environments/dev/main.tf`:
```hcl
module "lambda_scraper" {
  # ...
  timeout = 600  # 10 minutes (max: 900)
}
```

### MongoDB Connection Issues

**Symptom:** Lambda logs show "MongoNetworkError" or "ECONNREFUSED"

**Check:**
1. MongoDB connection string is correct
2. MongoDB Atlas IP whitelist includes `0.0.0.0/0` (Lambda uses dynamic IPs)
3. Environment variable is set:
   ```bash
   aws lambda get-function-configuration \
     --function-name kpz-scraper-dev \
     --query 'Environment.Variables.MONGO_DB_CONNECTION'
   ```

## Cost Estimation

**Lambda:**
- Requests: 30/month (daily) = $0.00
- Duration: 30 invocations × 300 seconds × 512 MB = $0.13/month
- Total: **~$0.13/month**

**EventBridge Scheduler:**
- Invocations: 30/month = $0.00 (free tier: 14M/month)

**CloudWatch Logs:**
- Storage: ~1 GB/month (7-day retention) = $0.50/month
- Ingestion: Free (5 GB/month free tier)

**Total Estimated Cost: ~$0.63/month**

## Security Considerations

1. **Least Privilege:** Lambda role only has CloudWatch Logs permissions
2. **No Public Access:** Lambda is not publicly accessible (no Function URL)
3. **Encrypted Logs:** CloudWatch Logs encrypted at rest
4. **Secrets Management:** MongoDB connection string passed via environment variables (consider AWS Secrets Manager for production)
5. **Network Isolation:** Lambda runs in AWS-managed VPC (consider custom VPC for production)

## Production Deployment

To deploy to production environment:

1. Create `terraform/environments/prod/` similar to `dev/`
2. Update GitHub Actions workflow (`.github/workflows/terraform-prod.yml`)
3. Configure production MongoDB connection string
4. Consider:
   - Longer log retention (30-90 days)
   - Higher memory for better performance (1024 MB)
   - VPC configuration for network isolation
   - AWS Secrets Manager for MongoDB credentials
   - SNS notifications for failures
   - Different schedule if needed

## References

- [AWS EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [EventBridge Cron Expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
