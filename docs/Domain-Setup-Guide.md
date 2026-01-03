# Domain Setup Guide: kitaplatz-zentrale.de

This guide walks you through reconnecting the domain `kitaplatz-zentrale.de` to the CloudFront distribution.

## Overview

- **Domain**: `kitaplatz-zentrale.de` (+ `www.kitaplatz-zentrale.de`)
- **Domain Management Account**: `216360990183` (management account)
- **CloudFront Account**: `441104482452` (kpz-dev)
- **Current CloudFront URL**: https://d2qust00jepj31.cloudfront.net

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Management Account (216360990183)                              │
│  - Route53 Hosted Zone                                          │
│  - DNS Validation Records (for ACM)                             │
│  - A/AAAA Records → CloudFront                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ DNS Validation
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  KPZ-Dev Account (441104482452)                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ACM Certificate (us-east-1)                              │  │
│  │  - kitaplatz-zentrale.de                                  │  │
│  │  - www.kitaplatz-zentrale.de                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  CloudFront Distribution (Global)                         │  │
│  │  - Custom domains: kitaplatz-zentrale.de                  │  │
│  │  - Origin: S3 bucket (kpz-frontend-dev)                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS CLI configured with two profiles:
  - `kpz-dev` (account 441104482452)
  - `anthony-management` (account 216360990183)
- Terraform 1.13.1
- Access to domain registrar for nameserver updates

## Step-by-Step Setup

### Step 1: Request ACM Certificate (Terraform - kpz-dev account)

The ACM certificate module is already created. To enable it, update `terraform/environments/dev/main.tf`:

```hcl
# Add ACM Certificate Module
module "acm_certificate" {
  source = "../../modules/acm-certificate"

  providers = {
    aws.us-east-1 = aws.us-east-1
  }

  environment               = "dev"
  domain_name               = "kitaplatz-zentrale.de"
  subject_alternative_names = ["www.kitaplatz-zentrale.de"]

  # Set to false since DNS validation is in management account
  auto_validate = false
}
```

Apply Terraform:
```bash
cd terraform/environments/dev
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=kpz-dev \
terraform init

terraform apply -target=module.acm_certificate
```

### Step 2: Get DNS Validation Records

After creating the certificate, get the validation records:

```bash
terraform output -json acm_certificate_validation_records
```

Or:
```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=kpz-dev \
aws acm describe-certificate \
  --certificate-arn <arn-from-terraform-output> \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions[*].[ResourceRecord.Name,ResourceRecord.Type,ResourceRecord.Value]' \
  --output table
```

**Example output**:
```
_1234567890abcdef.kitaplatz-zentrale.de.    CNAME    _abcdef1234567890.acm-validations.aws.
_9876543210fedcba.www.kitaplatz-zentrale.de.    CNAME    _fedcba0987654321.acm-validations.aws.
```

### Step 3: Create Route53 Hosted Zone (Manual - management account)

**In Management Account**:

```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=anthony-management \
aws route53 create-hosted-zone \
  --name kitaplatz-zentrale.de \
  --caller-reference $(date +%s) \
  --hosted-zone-config Comment="KPZ Production Domain"
```

**Save the Hosted Zone ID and Nameservers** from the output.

### Step 4: Add DNS Validation Records (Manual - management account)

Create a JSON file `dns-validation-records.json`:

```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "_1234567890abcdef.kitaplatz-zentrale.de.",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "_abcdef1234567890.acm-validations.aws."
          }
        ]
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "_9876543210fedcba.www.kitaplatz-zentrale.de.",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "_fedcba0987654321.acm-validations.aws."
          }
        ]
      }
    }
  ]
}
```

Apply the changes:
```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=anthony-management \
aws route53 change-resource-record-sets \
  --hosted-zone-id <zone-id-from-step-3> \
  --change-batch file://dns-validation-records.json
```

### Step 5: Wait for Certificate Validation

Monitor certificate status (in kpz-dev account):

```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=kpz-dev \
aws acm describe-certificate \
  --certificate-arn <certificate-arn> \
  --region us-east-1 \
  --query 'Certificate.Status' \
  --output text
```

Status should change from `PENDING_VALIDATION` to `ISSUED` (usually within 5-30 minutes).

### Step 6: Update CloudFront Distribution (Terraform - kpz-dev account)

Update `terraform/environments/dev/main.tf`:

```hcl
# Update CloudFront Module
module "cloudfront" {
  source = "../../modules/cdn"

  environment          = "dev"
  s3_bucket_name       = module.s3_frontend.bucket_name
  s3_website_endpoint  = module.s3_frontend.website_endpoint

  # Add custom domain configuration
  domain_name          = "kitaplatz-zentrale.de"
  alternate_domain_names = ["www.kitaplatz-zentrale.de"]
  acm_certificate_arn  = module.acm_certificate.certificate_arn
}
```

Apply Terraform:
```bash
terraform apply
```

### Step 7: Create Route53 Records for CloudFront (Manual - management account)

Get CloudFront domain name:
```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=kpz-dev \
aws cloudfront get-distribution \
  --id E2VPVOEHAHR6WE \
  --query 'Distribution.DomainName' \
  --output text
```

Create `cloudfront-alias-records.json`:

```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "kitaplatz-zentrale.de.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d2qust00jepj31.cloudfront.net.",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.kitaplatz-zentrale.de.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d2qust00jepj31.cloudfront.net.",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
```

**Note**: `Z2FDTNDATAQYW2` is the fixed hosted zone ID for all CloudFront distributions.

Apply the changes:
```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=anthony-management \
aws route53 change-resource-record-sets \
  --hosted-zone-id <zone-id> \
  --change-batch file://cloudfront-alias-records.json
```

### Step 8: Update Domain Nameservers at Registrar

Get nameservers from Route53:
```bash
AWS_CONFIG_FILE=/Users/anthonysherrill/.aws/config-personal \
AWS_PROFILE=anthony-management \
aws route53 get-hosted-zone \
  --id <zone-id> \
  --query 'DelegationSet.NameServers' \
  --output table
```

Update your domain registrar to use these nameservers (typically 4 nameservers like `ns-123.awsdns-12.com`).

**Note**: DNS propagation can take 24-48 hours.

### Step 9: Verify Setup

After nameserver propagation:

```bash
# Check DNS resolution
dig kitaplatz-zentrale.de
dig www.kitaplatz-zentrale.de

# Test HTTPS
curl -I https://kitaplatz-zentrale.de
curl -I https://www.kitaplatz-zentrale.de

# Check certificate
openssl s_client -connect kitaplatz-zentrale.de:443 -servername kitaplatz-zentrale.de
```

**Expected results**:
- Both domains resolve to CloudFront distribution
- HTTPS works without certificate warnings
- Certificate shows "kitaplatz-zentrale.de" with SAN "www.kitaplatz-zentrale.de"
- HTTP redirects to HTTPS

## Troubleshooting

### Certificate Stuck in PENDING_VALIDATION

**Cause**: DNS validation records not created or incorrect

**Solution**:
1. Verify records exist in Route53:
   ```bash
   aws route53 list-resource-record-sets --hosted-zone-id <zone-id>
   ```
2. Check if nameservers are correct
3. Wait up to 30 minutes for propagation

### CloudFront Returns 403 Forbidden

**Cause**: S3 bucket policy doesn't allow CloudFront access

**Solution**: Verify S3 bucket policy allows public read access

### Domain Doesn't Resolve

**Cause**: Nameserver propagation or DNS records not created

**Solution**:
1. Check nameservers at registrar
2. Verify A records in Route53
3. Wait for DNS propagation (24-48 hours)

### SSL Certificate Error in Browser

**Cause**: Certificate not attached to CloudFront or wrong domain

**Solution**:
1. Verify certificate is ISSUED: `aws acm describe-certificate`
2. Check CloudFront viewer certificate configuration
3. Ensure certificate is in us-east-1

## Security Considerations

- **TLS 1.2+**: Enforced via CloudFront viewer certificate configuration
- **HSTS**: Consider adding HSTS headers via CloudFront Functions
- **Certificate Expiration**: ACM auto-renews certificates if DNS validation records remain
- **DNS Security**: Consider enabling DNSSEC on Route53

## Cost Implications

- **ACM Certificate**: Free
- **Route53 Hosted Zone**: $0.50/month
- **Route53 Queries**: $0.40 per million queries (first billion)
- **CloudFront**: No additional cost for custom domain (existing distribution)

## References

- Issue: #125
- CloudFront Distribution ID: `E2VPVOEHAHR6WE`
- Management Account: `216360990183`
- KPZ-Dev Account: `441104482452`
- AWS Profile Config: `/Users/anthonysherrill/.aws/config-personal`
