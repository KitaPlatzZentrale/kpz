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

## GitHub Secrets Configuration

To enable automated deployments, configure these secrets in GitHub:

### Required Secrets

Navigate to: **Repository Settings → Secrets and variables → Actions**

#### 1. `AWS_DEPLOY_ROLE_ARN_DEV`

IAM role ARN for OIDC authentication (recommended approach).

**Value format**: `arn:aws:iam::ACCOUNT_ID:role/GitHubActionsDeployRole`

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

## Troubleshooting

### Deployment fails with "Access Denied"

- Check that `AWS_DEPLOY_ROLE_ARN_DEV` secret is correct
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
