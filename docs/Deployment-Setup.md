# Deployment Setup

This guide explains how to configure automated deployments to AWS for the KPZ project.

## Overview

The project uses GitHub Actions for automated deployments:

- **Dev Environment**: Automated deployment on push to `dev` branch
- **Production Environment**: Manual deployment (workflows not yet created)

## Architecture

### Dev Environment

- **Backend**: AWS Lambda function behind API Gateway
- **Frontend**: S3 static hosting with CloudFront CDN
- **Infrastructure**: Managed by Terraform in `terraform/environments/dev/`

## GitHub Environments and Secrets Configuration

To enable automated deployments, configure GitHub Environments with their secrets.

### Setup GitHub Environments

Navigate to: **Repository Settings → Environments**

#### Create Two Environments:

1. **dev** - Development environment
2. **prod** - Production environment (with approval gates)

### Environment Secrets

For **each environment**, add these secrets:

Navigate to: **Repository Settings → Environments → [env name] → Secrets**

#### 1. `AWS_DEPLOY_ROLE_ARN`

IAM role ARN for OIDC authentication (recommended approach).

**Value format**: `arn:aws:iam::ACCOUNT_ID:role/GitHubActionsDeployRole`

**Important:** Same secret name for both environments, different values:
- **dev environment**: Points to dev AWS account role
- **prod environment**: Points to prod AWS account role

**How to create this role:**

```bash
# 1. Create trust policy for GitHub OIDC
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:KitaPlatzZentrale/kpz:ref:refs/heads/dev"
        }
      }
    }
  ]
}
EOF

# 2. Create IAM role
aws iam create-role \
  --role-name GitHubActionsDeployRole \
  --assume-role-policy-document file://trust-policy.json

# 3. Attach policies (see below)
```

**Required IAM permissions:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject",
        "s3:ListBucket",
        "cloudfront:CreateInvalidation",
        "cloudfront:ListDistributions"
      ],
      "Resource": [
        "arn:aws:lambda:eu-central-1:ACCOUNT_ID:function:kpz-dev-backend-api",
        "arn:aws:s3:::kpz-dev-frontend/*",
        "arn:aws:s3:::kpz-dev-frontend",
        "arn:aws:cloudfront::ACCOUNT_ID:distribution/*"
      ]
    }
  ]
}
```

#### 2. `VITE_PUBLIC_HERE_API_KEY`

HERE Maps API key for geocoding and map functionality.

**Value**: Your HERE API key (e.g., `W4Sm0s8ksnXVnfgqHit48vXtf4MvD90-TY_vH0W1Sno`)

**Note**: This is a public key and will be embedded in the frontend build.

### Optional: Environment-specific secrets

If you need different HERE API keys for dev/prod:

- `VITE_PUBLIC_HERE_API_KEY_DEV`
- `VITE_PUBLIC_HERE_API_KEY_PROD`

## Deployment Workflows

### Backend Deployment (`deploy_backend_dev.yml`)

**Triggers:**
- Push to `dev` branch with changes in `backend/**`
- Manual trigger via GitHub Actions UI

**Steps:**
1. Checkout code
2. Install dependencies
3. Build TypeScript
4. Create Lambda deployment package (zip)
5. Authenticate with AWS using OIDC
6. Update Lambda function code
7. Verify deployment

**AWS Resources Updated:**
- Lambda function: `kpz-dev-backend-api`
- Region: `eu-central-1`

### Frontend Deployment (`deploy_frontend_dev.yml`)

**Triggers:**
- Push to `dev` branch with changes in `frontend/**`
- Manual trigger via GitHub Actions UI

**Steps:**
1. Checkout code
2. Install dependencies
3. Build frontend with Vite (using dev environment variables)
4. Authenticate with AWS using OIDC
5. Sync build to S3 bucket
6. Invalidate CloudFront cache

**AWS Resources Updated:**
- S3 bucket: `kpz-dev-frontend`
- CloudFront distribution (auto-detected)
- Region: `eu-central-1`

## Manual Deployment

If automated deployment is not yet configured, you can deploy manually:

### Backend (Lambda)

```bash
# 1. Build backend
cd backend
npm install
npm run build

# 2. Create deployment package
mkdir -p lambda-package
cp -r dist/* lambda-package/
cp -r node_modules lambda-package/
cp package.json lambda-package/
cd lambda-package
zip -r ../lambda.zip .
cd ..

# 3. Update Lambda function
aws lambda update-function-code \
  --function-name kpz-dev-backend-api \
  --zip-file fileb://lambda.zip \
  --profile kpz-dev \
  --region eu-central-1
```

### Frontend (S3/CloudFront)

```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Sync to S3
aws s3 sync dist/ s3://kpz-dev-frontend/ \
  --delete \
  --profile kpz-dev \
  --region eu-central-1

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*" \
  --profile kpz-dev \
  --region eu-central-1
```

## Local Terraform Development

The Terraform configuration in `terraform/environments/dev/` is designed to work in both local development and GitHub Actions environments.

### Local Development Setup

When running Terraform locally, use the `AWS_PROFILE` and `AWS_CONFIG_FILE` environment variables:

```bash
cd terraform/environments/dev

# Login to AWS SSO
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev aws sso login --profile kpz-dev

# Initialize Terraform
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform init

# Plan changes
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform plan

# Apply changes
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform apply
```

**Note:** The Terraform configuration no longer includes hardcoded `profile` parameters. Instead:
- **Local development**: Use `AWS_PROFILE` environment variable
- **GitHub Actions**: Uses OIDC authentication (credentials provided automatically)

This allows the same configuration to work in both environments without modification.

### When to Run Terraform Locally vs CI/CD

Understanding when to run Terraform locally versus letting GitHub Actions handle it is crucial for efficient development.

#### ✅ Run Terraform Locally When:

1. **Initial Setup / Bootstrapping**
   - Creating the IAM role for GitHub Actions (chicken-and-egg problem)
   - Setting up the Terraform state bucket and DynamoDB lock table
   - First-time infrastructure deployment before CI/CD is configured

   ```bash
   # Example: Bootstrap IAM role for GitHub Actions
   cd terraform/environments/dev
   AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform apply
   ```

2. **Testing Infrastructure Changes**
   - Running `terraform plan` to preview changes before committing
   - Validating Terraform syntax and configuration
   - Debugging infrastructure issues

   ```bash
   # Test your changes locally first
   AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform plan
   ```

3. **Emergency Fixes**
   - Critical infrastructure issues that can't wait for CI/CD
   - Unlocking stuck Terraform state
   - Rolling back problematic changes quickly

   ```bash
   # Example: Force unlock stuck state
   terraform force-unlock <LOCK_ID>
   ```

4. **Development Iteration**
   - Rapid iteration on complex infrastructure changes
   - When you need immediate feedback without committing
   - Testing changes to Terraform modules

#### 🤖 Let CI/CD Run Terraform When:

1. **Normal Development Workflow** ✅ Preferred
   - Making infrastructure changes during regular development
   - Changes are reviewed and ready to apply
   - Part of the standard git workflow

   ```bash
   # Make changes to Terraform files
   git add terraform/
   git commit -m "feat: Add new Lambda function"
   git push origin dev  # CI/CD automatically runs terraform apply
   ```

2. **Production Deployments**
   - Merging to main branch (requires PR approval)
   - Ensures infrastructure changes are reviewed
   - Provides audit trail via GitHub Actions logs

   ```bash
   # Create PR to main branch
   gh pr create --base main --head dev
   # Terraform runs plan on PR, apply on merge
   ```

3. **Collaborative Development**
   - Multiple developers working on infrastructure
   - Prevents conflicting manual changes
   - Ensures consistent deployment process

#### Workflow Recommendation

**Standard Development Flow:**

```bash
# 1. Make infrastructure changes
vim terraform/environments/dev/main.tf

# 2. Test locally (optional but recommended)
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform plan

# 3. Commit and push (triggers CI/CD)
git add terraform/
git commit -m "feat: Add CloudWatch alarm"
git push origin dev

# 4. Monitor GitHub Actions workflow
gh run watch

# 5. Verify deployment
aws lambda list-functions --profile kpz-dev
```

**Emergency/Bootstrap Flow:**

```bash
# 1. Login to AWS
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev aws sso login --profile kpz-dev

# 2. Apply immediately
AWS_CONFIG_FILE=~/.aws/config-personal AWS_PROFILE=kpz-dev terraform apply

# 3. Commit changes afterward for audit trail
git add terraform/
git commit -m "fix: Emergency infrastructure fix"
git push origin dev
```

#### Key Differences

| Aspect | Local Execution | CI/CD Execution |
|--------|----------------|-----------------|
| **Trigger** | Manual command | Git push to dev/main |
| **Authentication** | AWS SSO profile | OIDC (automated) |
| **State Lock** | Manual unlock if stuck | Auto-managed |
| **Audit Trail** | Local only | GitHub Actions logs |
| **Approval** | None | Production requires PR review |
| **Variables** | From terraform.tfvars | From GitHub Secrets |
| **Use Case** | Bootstrap, testing, emergency | Normal development, production |

#### Best Practices

1. **Always run `terraform plan` locally before pushing** to catch errors early
2. **Use CI/CD for production** to ensure review and audit trail
3. **Document emergency local runs** with commit messages explaining why
4. **Keep terraform.tfvars in sync** with GitHub Environment secrets
5. **Avoid running local apply on production** unless absolutely necessary

## Troubleshooting

### Deployment fails with "Access Denied"

- Check that `AWS_DEPLOY_ROLE_ARN` secret is correct in the "dev" environment
- Verify the IAM role has the required permissions
- Ensure the trust policy allows the GitHub repository

### Frontend deployment succeeds but changes not visible

- CloudFront cache invalidation takes 1-5 minutes to propagate
- Check CloudFront distribution settings
- Verify correct distribution ID is being used

### Lambda function size too large

- Lambda has a 50MB zipped / 250MB unzipped limit
- Check `lambda.zip` size after build
- Consider removing unnecessary dependencies
- Use Lambda layers for large dependencies

## Testing Deployments

After deployment, verify:

### Backend

```bash
# Test API Gateway endpoint
curl https://q53a8x2xfl.execute-api.eu-central-1.amazonaws.com/location-service \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"lat":"52.52","lng":"13.405","radius":"1500","page":"1","limit":"10"}'
```

### Frontend

1. Open browser to CloudFront distribution URL
2. Check browser console for errors
3. Test kita search functionality
4. Verify API calls go to correct backend URL

## Monitoring

- **Lambda Logs**: CloudWatch Logs → `/aws/lambda/kpz-dev-backend-api`
- **Frontend Access Logs**: S3 bucket access logs (if enabled)
- **CloudFront Metrics**: CloudWatch → CloudFront distributions

## Security Best Practices

1. **Use OIDC instead of AWS access keys** - Already configured in workflows
2. **Limit IAM role permissions** - Only grant minimum required permissions
3. **Enable CloudTrail** - Track all AWS API calls
4. **Review GitHub Actions logs** - Check for exposed secrets
5. **Rotate credentials regularly** - Update IAM roles and policies periodically

## Future Improvements

- [ ] Add production deployment workflows
- [ ] Implement blue-green deployments for Lambda
- [ ] Add deployment notifications (Slack, email)
- [ ] Implement automated rollback on failure
- [ ] Add smoke tests after deployment
- [ ] Create staging environment
