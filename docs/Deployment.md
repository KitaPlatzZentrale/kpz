# Deployment Guide

This guide covers deploying Kitaplatz-Zentrale to production and development environments.

## Overview

KPZ uses a multi-component deployment strategy:
- **Frontend**: AWS S3 + CloudFront (Static hosting)
- **Backend**: AWS ECS (Containerized API)
- **Lambda Functions**: AWS Lambda (Serverless functions)

## Prerequisites

- AWS CLI configured with appropriate credentials
- Docker installed (for backend)
- Node.js 18.16.0
- GitHub repository access
- AWS account access

## Deployment Environments

### Production
- **AWS Account**: 897331788878 (Backend), 400638005080 (Frontend)
- **Region**: eu-central-1 (Frankfurt)
- **Domain**: kitaplatz-zentrale.de
- **Branch**: `main`

### Development
- **AWS Account**: Same as production (different resources)
- **Region**: eu-central-1
- **Branch**: `dev`

---

## Frontend Deployment

### Automated Deployment (GitHub Actions)

The frontend automatically deploys when changes are pushed to `main`.

**Workflow**: `.github/workflows/deploy_frontend.yml`

**Trigger**: Push to `main` branch with changes in `frontend/**`

**Process**:
1. Checkout code
2. Install dependencies (`yarn install`)
3. Build with Vite (`yarn build`)
4. Upload to S3
5. Invalidate CloudFront cache

### Manual Deployment

```bash
cd frontend

# Install dependencies
yarn install

# Build for production
yarn build

# Upload to S3 (requires AWS CLI configured)
aws s3 sync dist/ s3://YOUR-BUCKET-NAME \
  --delete \
  --region eu-central-1

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"
```

### Environment Variables

Set in GitHub Actions secrets:
- `VITE_BACKEND_URL` - Backend API endpoint
- `VITE_PUBLIC_HERE_API_KEY` - HERE Maps API key

### Rollback

To rollback frontend deployment:

```bash
# List S3 bucket versions
aws s3api list-object-versions \
  --bucket YOUR-BUCKET-NAME \
  --prefix index.html

# Restore specific version
aws s3api copy-object \
  --bucket YOUR-BUCKET-NAME \
  --copy-source YOUR-BUCKET-NAME/index.html?versionId=VERSION_ID \
  --key index.html

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"
```

---

## Backend Deployment

### Automated Deployment (GitHub Actions)

Backend automatically builds and pushes to ECR when changes are pushed.

**Workflow**: `.github/workflows/push_to_ecr.yml`

**Trigger**: Push to `main` or `dev` with changes in `backend/**`

**Process**:
1. Checkout code
2. Determine environment (main → prod, dev → dev)
3. Login to Amazon ECR
4. Build Docker image
5. Push to ECR repository
6. (Manual) Deploy to ECS

### Manual Deployment

#### Step 1: Build Docker Image

```bash
cd backend

# Build image
docker build -t kpz-api:latest .

# Test locally (optional)
docker run -p 3000:3000 \
  --env-file .env \
  kpz-api:latest
```

#### Step 2: Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  897331788878.dkr.ecr.eu-central-1.amazonaws.com

# Tag image
docker tag kpz-api:latest \
  897331788878.dkr.ecr.eu-central-1.amazonaws.com/kpz_prod_api:latest

# Push to ECR
docker push 897331788878.dkr.ecr.eu-central-1.amazonaws.com/kpz_prod_api:latest
```

#### Step 3: Deploy to ECS

**Option A: Update Service (Rolling Update)**

```bash
# Force new deployment (pulls latest ECR image)
aws ecs update-service \
  --cluster kpz-prod-cluster \
  --service kpz-api-service \
  --force-new-deployment \
  --region eu-central-1
```

**Option B: Update Task Definition**

1. Create new task definition revision
2. Update service to use new revision

```bash
# Register new task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json

# Update service
aws ecs update-service \
  --cluster kpz-prod-cluster \
  --service kpz-api-service \
  --task-definition kpz-api:NEW_REVISION \
  --region eu-central-1
```

### Environment Variables

Set in ECS Task Definition:
- MongoDB connection string
- AWS credentials (if not using IAM roles)
- Datadog API key
- Other secrets

### Health Checks

ECS health checks monitor the `/health` endpoint (if implemented).

### Rollback

To rollback backend deployment:

```bash
# List task definition revisions
aws ecs list-task-definitions \
  --family-prefix kpz-api \
  --region eu-central-1

# Rollback to previous revision
aws ecs update-service \
  --cluster kpz-prod-cluster \
  --service kpz-api-service \
  --task-definition kpz-api:PREVIOUS_REVISION \
  --region eu-central-1
```

---

## Lambda Deployment

Lambda functions require manual deployment (automation planned).

### Email Service Deployment

```bash
cd email

# Install dependencies
yarn install

# Build Lambda functions
yarn build

# This creates dist/ with bundled code and zips
```

Upload each zip file to its Lambda function:

```bash
# Example for confirmConsent function
aws lambda update-function-code \
  --function-name kpz-confirmConsent \
  --zip-file fileb://dist/confirmConsent.zip \
  --region eu-central-1
```

### Notification Service Deployment

```bash
cd notification
yarn install
yarn build

# Upload each function
aws lambda update-function-code \
  --function-name kpz-handleSignupNotification \
  --zip-file fileb://dist/handleSignupNotification.zip \
  --region eu-central-1
```

### Scraper Service Deployment

```bash
cd scraper
npm install
npm run build

# Upload
aws lambda update-function-code \
  --function-name kpz-scraper \
  --zip-file fileb://dist/index.zip \
  --region eu-central-1
```

### Location Service Deployment

```bash
cd location-service
npm install
# Build command TBD

# Upload
aws lambda update-function-code \
  --function-name kpz-location-service \
  --zip-file fileb://dist/index.zip \
  --region eu-central-1
```

### Lambda Environment Variables

Set via AWS Console or CLI:

```bash
aws lambda update-function-configuration \
  --function-name kpz-confirmConsent \
  --environment Variables="{MONGODB_URI=mongodb://...,SES_REGION=eu-central-1}" \
  --region eu-central-1
```

---

## Database Migration

### MongoDB Atlas (Recommended)

1. **Create Cluster** on MongoDB Atlas
2. **Whitelist IP addresses** (ECS tasks, Lambda functions)
3. **Create Database User**
4. **Update connection strings** in environment variables
5. **Migrate data** (if from existing database)

### Self-Hosted MongoDB

If running on EC2:
1. Backup existing database
2. Restore to new EC2 instance
3. Configure security groups
4. Update connection strings

---

## CI/CD Pipeline

### Current Setup

**Frontend**:
```
GitHub Push (main) → GitHub Actions → Build → S3 → CloudFront Invalidation
```

**Backend**:
```
GitHub Push (main/dev) → GitHub Actions → Build → ECR → (Manual ECS Update)
```

**Lambda**:
```
Manual: Local Build → Zip → AWS Console/CLI Upload
```

### Future Improvements

- [ ] Automated ECS deployments after ECR push
- [ ] Automated Lambda deployments
- [ ] Blue-green deployments
- [ ] Staging environment
- [ ] Integration tests before deployment
- [ ] Automated rollback on failures

---

## Pre-Deployment Checklist

### Before Every Deployment

- [ ] Run tests locally (`npm test`)
- [ ] Test build locally
- [ ] Review code changes
- [ ] Update environment variables (if needed)
- [ ] Backup database (for major changes)
- [ ] Check monitoring dashboards

### Backend Deployment

- [ ] Build succeeds locally
- [ ] Docker image builds successfully
- [ ] Environment variables are set correctly
- [ ] Database migrations completed (if any)
- [ ] Health check endpoint works

### Frontend Deployment

- [ ] Build succeeds locally
- [ ] No console errors in browser
- [ ] All environment variables set
- [ ] Test major user flows
- [ ] Check responsive design

### Lambda Deployment

- [ ] Function builds successfully
- [ ] Test locally with sample events
- [ ] Environment variables configured
- [ ] Timeout and memory settings appropriate
- [ ] IAM permissions correct

---

## Post-Deployment Verification

### Frontend

1. Visit https://kitaplatz-zentrale.de
2. Check browser console for errors
3. Test Kita search functionality
4. Test signup forms
5. Verify map loads correctly

### Backend

1. Check ECS service status
2. Review CloudWatch logs
3. Test API endpoints:
   ```bash
   curl https://api.kitaplatz-zentrale.de/health
   ```
4. Monitor error rates in Datadog

### Lambda

1. Check Lambda metrics in CloudWatch
2. Review execution logs
3. Test email delivery (send test signup)
4. Verify Slack notifications

---

## Monitoring & Alerting

### CloudWatch Dashboards

Monitor:
- ECS CPU/Memory utilization
- Lambda invocations and errors
- S3 request metrics
- CloudFront cache hit ratio

### Datadog

- Application performance monitoring
- Custom metrics
- Log aggregation
- Error tracking

### Alerts

Configure alerts for:
- ECS service health check failures
- High Lambda error rates
- Database connection issues
- CloudFront 5xx errors

---

## Rollback Procedures

### Emergency Rollback

If deployment causes critical issues:

1. **Frontend**: Restore previous S3 version or redeploy previous build
2. **Backend**: Update ECS service to previous task definition
3. **Lambda**: Deploy previous function version
4. **Database**: Restore from backup (last resort)

### Communication

1. Notify team in Slack
2. Document the issue
3. Create incident report
4. Plan fix for next deployment

---

## Security Considerations

### Deployment Security

- Never commit secrets to Git
- Use IAM roles for AWS access
- Rotate credentials regularly
- Review CloudTrail logs
- Enable MFA for AWS console

### Secret Management

- Store secrets in AWS Secrets Manager or Parameter Store
- Use environment variables
- Rotate database passwords
- Rotate API keys

---

## Terraform Deployment (Future)

Once Terraform migration is complete:

```bash
cd terraform/environments/prod

# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy (caution!)
terraform destroy
```

See [Terraform Migration Plan](Terraform-Migration.md) for details.

---

## Troubleshooting

### Frontend not loading

- Check CloudFront distribution status
- Verify S3 bucket permissions
- Check browser console for errors
- Verify DNS records

### Backend API errors

- Check ECS service events
- Review CloudWatch logs
- Verify environment variables
- Test database connectivity

### Lambda failures

- Check CloudWatch Logs
- Verify environment variables
- Check IAM permissions
- Test with sample event in console

### Database connection issues

- Verify connection string
- Check security groups/firewall
- Verify database is running
- Check IAM authentication (if used)

---

## Support

For deployment issues:
- Check CloudWatch Logs
- Review GitHub Actions logs
- Contact DevOps team
- Create GitHub issue

---

For infrastructure changes, see:
- [Architecture](Architecture.md)
- [Terraform Migration](Terraform-Migration.md)
- [Development Guide](Development-Guide.md)
