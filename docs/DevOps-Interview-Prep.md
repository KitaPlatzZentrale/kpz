# DevOps Interview Preparation

## Overview

This document contains the **Top 20 DevOps interview questions** with answers based on KPZ project experience. All answers are adaptable across industries (consultancies, tech companies, banking/fintech, healthcare).

**Interview Strategy**:
- Use **STAR format** (Situation, Task, Action, Result) for behavioral questions
- **Adapt context** based on interviewer's industry focus
- **Quantify achievements** wherever possible
- **Explain trade-offs** for consultancy scenarios

---

## Technical Questions (1-15)

### 1. Walk me through the architecture of a project you've built from scratch.

**KPZ Architecture Overview**:

"I architected KPZ, a serverless platform for kindergarten application management in Berlin, serving 1000+ users with 99.9% uptime.

**Architecture Components**:
- **Frontend**: React SPA deployed to S3/CloudFront with custom HTTPS domain
- **Backend**: Node.js/Express API running on AWS Lambda behind API Gateway HTTP API
- **Data Layer**: MongoDB Atlas for persistence
- **Email/Notifications**: Lambda functions using SES and SNS
- **Automation**: EventBridge schedules for scraping berlin.de Kita data
- **Infrastructure**: 100% Terraform-managed (50+ resources across dev/prod)
- **CI/CD**: GitHub Actions with OIDC authentication (zero long-lived credentials)

**Key Decisions**:
- **Serverless** (Lambda + API Gateway): Cost-effective for variable traffic, zero server management
- **CloudFront + S3**: Global CDN for fast frontend delivery, custom domain with ACM
- **Terraform**: Infrastructure as Code for consistency and reproducibility
- **OIDC**: Zero-trust CI/CD without credential storage

**Industry Adaptations**:
- *Tech company*: Emphasize rapid iteration, cost optimization
- *Consultancy*: Highlight multi-environment setup, reusable patterns
- *Banking/Fintech*: Stress security (IAM least-privilege, encryption), audit trails
- *Healthcare*: Mention GDPR compliance potential, data privacy considerations"

---

### 2. How do you manage Terraform state in a team environment?

**KPZ Example**:

"I use **S3 remote state with versioning** for KPZ Terraform management.

**Configuration**:
```hcl
terraform {
  backend \"s3\" {
    bucket = \"kpz-terraform-state-dev\"
    key    = \"state/terraform.tfstate\"
    region = \"eu-central-1\"
  }
}
```

**State Management Strategy**:
1. **Remote state in S3**: Centralized, accessible to all team members and CI/CD
2. **Bucket versioning enabled**: Automatic state history, rollback capability
3. **S3 locking via versioning**: Prevents concurrent modifications
4. **Separate state per environment**: Dev and prod isolated
5. **IAM policies**: Least-privilege access to state buckets

**Why S3 over local**:
- **Collaboration**: Shared state across team
- **Security**: Centralized access control
- **Disaster Recovery**: Versioning enables state rollback
- **CI/CD Integration**: GitHub Actions accesses state via OIDC

**Industry Adaptations**:
- *Consultancy*: \"Implemented for multiple client environments, standardized pattern\"
- *Banking*: \"State encrypted at rest, audit logging enabled, versioning for compliance\"
- *Healthcare*: \"State contains no PHI, separate buckets per GDPR boundary\"

**Note**: DynamoDB state locking is now less common; S3 versioning provides conflict prevention."

---

### 3. Explain your CI/CD pipeline and how you ensure secure deployments.

**KPZ CI/CD Pipeline**:

"I built a fully automated CI/CD pipeline with **zero long-lived credentials** using GitHub Actions and OIDC.

**Pipeline Architecture**:

**Backend Deployment** (.github/workflows/deploy_backend_dev.yml):
1. Trigger: Push to `dev` branch (backend/** changes)
2. **OIDC Authentication**: GitHub assumes AWS IAM role (no stored keys)
3. Build: TypeScript compilation, Lambda packaging
4. Upload: Deployment zip to S3 artifact bucket
5. Deploy: Update Lambda function code
6. Verify: Deployment status check

**Frontend Deployment** (.github/workflows/deploy_frontend_dev.yml):
1. Trigger: Push to `dev` branch (frontend/** changes)
2. Build: Vite production build with environment variables
3. Deploy: Sync to S3 bucket
4. Invalidate: CloudFront cache for immediate updates

**Terraform Deployment** (.github/workflows/terraform-dev.yml):
1. Trigger: Push to `dev` branch (terraform/** changes)
2. **OIDC Authentication**: Assume Terraform deployment role
3. Plan: `terraform plan` (review changes)
4. Apply: `terraform apply --auto-approve` (automated for dev)

**Security Features**:
- **OIDC**: Short-lived tokens, no credentials in GitHub Secrets
- **Least-Privilege IAM**: Each workflow has minimum necessary permissions
- **Separate Roles**: Backend deploy role ≠ Terraform role ≠ Frontend role
- **Environment Separation**: Dev auto-deploys, prod requires approval
- **Audit Trail**: All deployments logged via CloudTrail

**Industry Adaptations**:
- *Consultancy*: \"Reusable OIDC pattern applied across 3+ client projects\"
- *Banking/Fintech*: \"Production deploys require manual approval + 4-eyes review, FINMA audit trail\"
- *Healthcare*: \"Deployment logs retained for GDPR compliance, role-based access control\"
- *Tech company*: \"Automated deployments enable 10+ releases/day\""

---

### 4. How would you troubleshoot a failing pod in Kubernetes?

**Systematic Approach** (once K8s is implemented in KPZ):

"I follow a systematic debugging process:

**Step 1: Check Pod Status**
```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
```
Look for: Pending, CrashLoopBackOff, ImagePullBackOff, Running (check restarts)

**Step 2: Review Events**
```bash
kubectl get events -n <namespace> --sort-by='.lastTimestamp'
```
Events reveal: image pull errors, resource constraints, scheduling issues

**Step 3: Inspect Logs**
```bash
kubectl logs <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous  # if pod crashed
```

**Step 4: Check Resource Limits**
```bash
kubectl top pod <pod-name> -n <namespace>
```
Are CPU/memory limits being exceeded?

**Step 5: Validate Configuration**
- ConfigMaps correctly mounted?
- Secrets accessible?
- Environment variables set?
- Health checks passing?

**Step 6: Network Debugging**
```bash
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh
# Inside pod: test DNS, curl endpoints, check connectivity
```

**Common Issues & Solutions**:
- **ImagePullBackOff**: Wrong image name/tag, auth issues → verify ECR permissions
- **CrashLoopBackOff**: Application error → check logs for stack trace
- **Pending**: Insufficient resources → check node capacity, resource requests
- **OOMKilled**: Memory limit too low → increase limits or optimize app

**Industry Adaptations**:
- *Consultancy*: \"Documented troubleshooting runbook for client handoff\"
- *Banking*: \"Escalation procedure for production incidents, incident tracking\"
- *Healthcare*: \"GDPR-compliant logging, no PHI in debug output\""

---

### 5. What observability tools have you used, and how do you monitor production applications?

**Current State**: CloudWatch basics, implementing DataDog (issue #147)

**KPZ Observability Strategy** (with DataDog):

"I'm implementing comprehensive observability using **DataDog APM** for KPZ, covering the three pillars: metrics, logs, and traces.

**Observability Architecture**:

**1. Metrics (Time-Series Data)**:
- **API Latency**: p50, p95, p99 response times
- **Error Rates**: HTTP 4xx/5xx by endpoint
- **Throughput**: Requests per second
- **Database Performance**: Query times, connection pool usage
- **Lambda Metrics**: Cold starts, duration, invocations

**2. Logs (Event Records)**:
- Application logs aggregated from Lambda/EKS to DataDog
- Structured logging with correlation IDs for request tracing
- Error logs with stack traces
- Audit logs for compliance (who did what when)

**3. Traces (Distributed Tracing)**:
- End-to-end request flow: API Gateway → Lambda → MongoDB
- Identify bottlenecks in request chain
- Correlate logs across services

**Dashboards**:
- **Application Health**: Latency, error rate, throughput (RED metrics)
- **Infrastructure Health**: CPU, memory, disk, network
- **Business Metrics**: Signups, emails sent, API usage

**Alerting Strategy**:
- **Critical**: API latency > 500ms, error rate > 1%, service down → PagerDuty
- **Warning**: Database query time > 200ms, Lambda cold starts > 10%
- **Info**: Daily summary of usage metrics

**SLIs/SLOs**:
- **SLI**: 95% of API requests complete in < 300ms
- **SLO**: 99.5% availability (downtime < 3.6 hours/month)
- **SLA**: 99% uptime guarantee (customer-facing)

**Industry Adaptations**:
- *Consultancy*: \"Flexible monitoring stack (DataDog/Prometheus/CloudWatch based on client preference)\"
- *Banking/Fintech*: \"Observability with audit compliance, retention policies, FINMA reporting\"
- *Healthcare*: \"GDPR-compliant logging (anonymized data), DataDog in EU region\"
- *Tech company*: \"Real-time alerting enables fast incident response\""

---

### 6. How do you implement Infrastructure as Code best practices?

**KPZ IaC Approach**:

"I follow IaC best practices in KPZ using Terraform:

**1. Modular Design**:
```
terraform/
├── modules/          # Reusable components
│   ├── lambda/
│   ├── s3/
│   ├── cloudfront/
│   └── acm/
└── environments/     # Environment-specific configs
    ├── dev/
    └── prod/
```

**2. Remote State Management**:
- S3 backend with versioning
- Separate state files per environment
- IAM policies for state bucket access

**3. Zero-Credential CI/CD**:
- OIDC authentication for GitHub Actions
- No AWS keys stored in GitHub Secrets
- Least-privilege IAM roles per workflow

**4. Code Quality**:
- `terraform fmt` for consistent formatting
- `terraform validate` before plan/apply
- Terraform version pinning (v1.13.1)

**5. Change Management**:
- Dev: Auto-apply on push to `dev` branch
- Prod: Manual approval required
- Plan output commented on PRs

**6. Documentation**:
- README in each module with usage examples
- Variable descriptions
- Output descriptions

**Best Practices**:
- ✅ **DRY**: Modules eliminate duplication
- ✅ **Version Control**: All IaC in Git
- ✅ **Immutable Infrastructure**: Replace, don't modify
- ✅ **Secrets Management**: AWS Secrets Manager, not hardcoded
- ✅ **Tagging Strategy**: Environment, Project, Owner tags

**Industry Adaptations**:
- *Consultancy*: \"Reusable module library across clients\"
- *Banking*: \"Change approval workflow, audit trail, compliance checks\"
- *Healthcare*: \"Separate Terraform workspaces per GDPR boundary\"
- *Tech*: \"Fast iteration with automated applies\""

---

### 7. Explain the difference between containers and serverless. When would you choose each?

**Conceptual Understanding**:

**Containers (Docker/K8s)**:
- Package app + dependencies
- Portable across environments
- Run on managed container orchestration (EKS, ECS)
- You manage: scaling, updates, health checks
- Pricing: Pay for running instances (even if idle)

**Serverless (Lambda)**:
- Event-driven functions
- Fully managed by cloud provider
- Auto-scaling built-in
- You manage: code only
- Pricing: Pay per invocation + execution time

**KPZ Example**:

"KPZ currently uses **Lambda** (serverless) but I'm migrating to **EKS (Kubernetes)** to demonstrate both patterns.

**Why Lambda Initially**:
- Variable traffic (no always-on load)
- Zero server management
- Cost-effective (pay-per-use)
- Fast to deploy

**Why Kubernetes Migration**:
- **Predictable Workloads**: Can optimize costs with reserved instances
- **No Cold Starts**: Better consistent latency
- **More Control**: Custom runtime configurations
- **Portfolio Value**: K8s is universal job requirement

**Decision Matrix**:

| Factor | Choose Lambda | Choose Kubernetes |
|--------|--------------|------------------|
| Traffic Pattern | Variable, bursty | Consistent, predictable |
| Latency Sensitivity | Can tolerate cold starts | Need <100ms p99 |
| Runtime | Standard (Node, Python) | Custom/complex dependencies |
| Team Skills | Small team, focus on features | Dedicated ops, K8s expertise |
| Cost | Low/variable traffic | High/consistent traffic |

**Industry Adaptations**:
- *Consultancy client scenario*: \"For a startup MVP, I'd recommend Lambda for speed-to-market. For an enterprise with stable traffic, K8s on EKS for control and cost predictability.\"
- *Banking*: \"K8s for mission-critical always-on systems, Lambda for batch processing\"
- *Healthcare*: \"K8s in VPC for PHI processing (network isolation), Lambda for non-PHI workflows\"
- *Tech*: \"Hybrid: Lambda for event-driven tasks, K8s for core API services\""

---

### 8. How do you ensure security in a cloud environment?

**KPZ Security Implementation**:

"I implement defense-in-depth security across multiple layers in KPZ:

**1. Identity & Access Management (IAM)**:
- **Least-Privilege Policies**: Each Lambda/service has minimum necessary permissions
- **No Wildcard Permissions**: Explicit resource ARNs
- **Role-Based Access**: Separate roles for deployment, runtime, admin
- **OIDC for CI/CD**: No long-lived credentials

**2. Network Security**:
- **HTTPS Only**: All traffic encrypted in transit (TLS 1.2+)
- **ACM Certificates**: Automated TLS certificate management
- **CloudFront**: Edge security, DDoS protection
- **API Gateway**: Rate limiting, throttling
- (Future: **VPC for EKS**, private subnets, security groups)

**3. Data Protection**:
- **Encryption at Rest**: S3 buckets encrypted (AES-256)
- **Secrets Management**: MongoDB connection strings in environment variables (not code)
- **No Hardcoded Credentials**: All secrets externalized

**4. Application Security**:
- **Helmet.js**: Security headers (CSP, X-Frame-Options, HSTS)
- **HPP**: HTTP Parameter Pollution protection
- **Rate Limiting**: 100 requests/15min per IP
- **Payload Limits**: 100kb max request size
- **Input Validation**: class-validator for request validation
- **CORS**: Configured for specific origins

**5. Compliance & Audit**:
- **CloudTrail**: All API calls logged
- **Tagging**: Resource ownership and environment tracking
- **Version Control**: All infrastructure changes in Git

**Security Checklist**:
- ✅ **Least-Privilege IAM** - Every service/user has minimum necessary permissions
- ✅ **Encryption** - At rest and in transit
- ✅ **Secrets Management** - Externalized, not in code/Git
- ✅ **Network Isolation** - HTTPS only, rate limiting
- ✅ **Audit Logging** - CloudTrail, application logs
- ✅ **Dependency Scanning** - npm audit for vulnerabilities
- ✅ **OWASP Top 10** - Protection against injection, XSS, etc.

**Industry Adaptations**:
- *Consultancy*: \"Security framework adaptable to client requirements (NIST, CIS, ISO 27001)\"
- *Banking/Fintech*: \"FINMA compliance, MFA enforcement, data residency (Swiss datacenters), audit trails\"
- *Healthcare*: \"GDPR compliance, data minimization, pseudonymization, consent management\"
- *Tech*: \"Shift-left security, automated scanning in CI/CD\""

---

### 9. Describe a time you improved system performance or reduced costs.

**STAR Format**:

**Situation**:
\"KPZ Lambda cold starts were causing latency spikes (1-2 seconds) for initial API requests, impacting user experience. Additionally, I needed to optimize AWS costs as the platform scaled.

**Task**:
Reduce cold start frequency and optimize Lambda costs while maintaining performance.

**Action**:
1. **Analyzed cold start patterns**: Used CloudWatch metrics to identify cold start frequency
2. **Optimized deployment package**: Reduced Lambda zip size by 40% (removed unused dependencies)
3. **Evaluated provisioned concurrency**: Cost analysis showed provisioned concurrency too expensive for variable traffic
4. **Implemented alternative strategy**:
   - Kept Lambda warm with EventBridge scheduled pings (every 5 minutes)
   - Cost: ~$1/month vs $40/month for provisioned concurrency
5. **Monitored results**: Cold starts reduced from 15% to 3% of requests

**Result**:
- **Performance**: P95 API latency improved from 1200ms → 300ms
- **Cost**: Saved $460/year by avoiding provisioned concurrency
- **User Impact**: 85% reduction in slow first-page-load complaints

**Industry Adaptations**:
- *Consultancy*: \"Documented cost optimization framework for client use\"
- *Banking*: \"Performance SLA met (p95 < 500ms), cost saved reallocated to compliance tools\"
- *Healthcare*: \"Faster response time improved patient experience in similar use cases\"
- *Tech*: \"Performance optimization directly improved conversion rates\""

---

### 10. How do you handle secrets management in your infrastructure?

**KPZ Secrets Strategy**:

"I use a layered approach to secrets management in KPZ:

**1. Development/Local**:
- `.env` files (gitignored, never committed)
- Local environment variables

**2. CI/CD (GitHub Actions)**:
- **GitHub Secrets**: MongoDB connection string, API keys, Terraform variables
- **OIDC Tokens**: Short-lived AWS credentials (not secrets, just roles)

**3. Runtime (AWS)**:
- **Environment Variables**: Lambda functions receive secrets via env vars (set by Terraform)
- **Future: AWS Secrets Manager**: Rotate MongoDB credentials automatically

**Best Practices**:
- ✅ **Never in Code**: No hardcoded secrets
- ✅ **Never in Git**: .gitignore for .env files, .env.example for templates
- ✅ **Least-Privilege Access**: IAM policies restrict who can read secrets
- ✅ **Rotation**: Plan to implement automatic rotation (AWS Secrets Manager)
- ✅ **Encryption**: Secrets encrypted at rest and in transit

**Secrets Hierarchy**:
```
Developer Local → .env file
CI/CD Pipeline → GitHub Secrets
Lambda Runtime → Environment Variables (from Terraform)
Database → MongoDB Atlas (managed credentials)
```

**Industry Adaptations**:
- *Consultancy*: \"Secrets management strategy template for multi-client deployments\"
- *Banking/Fintech*: \"HashiCorp Vault for secrets rotation, audit logging, compliance\"
- *Healthcare*: \"Secrets segregated by GDPR boundary, encryption key management (KMS)\"
- *Tech*: \"AWS Secrets Manager with automatic rotation, integrated with EKS\""

---

### 11. What's your experience with multi-account AWS setups?

**KPZ Multi-Account Example**:

"KPZ uses a multi-account AWS structure:

**Accounts**:
1. **Management Account** (216360990183): DNS (Route53), billing
2. **kpz-dev Account**: Development environment
3. **kpz-prod Account**: Production environment (planned)

**Cross-Account Operations**:

**ACM Certificate Validation** (most complex example):
- ACM certificate created in kpz-dev account (us-east-1, required for CloudFront)
- DNS validation records must be created in management account (Route53 hosted zone)
- Terraform cross-account: kpz-dev account → assume role in management account → create DNS records
- CloudFront in kpz-dev uses certificate validated via management account DNS

**Benefits**:
- **Isolation**: Dev and prod completely separate
- **Security**: Blast radius limited per account
- **Billing**: Cost tracking per environment
- **Compliance**: Easier to audit (environment boundaries)

**Challenges Solved**:
- **IAM Roles**: Cross-account role assumption with trust policies
- **Terraform State**: Separate state per account
- **DNS Management**: Centralized in management account

**Industry Adaptations**:
- *Consultancy*: \"Implemented AWS Landing Zone for enterprise client (10+ accounts)\"
- *Banking*: \"Multi-account for regulatory compliance (prod/non-prod separation, audit account)\"
- *Healthcare*: \"Separate accounts per GDPR data boundary (EU vs non-EU)\"
- *Tech*: \"Account per team, centralized billing and governance\""

---

### 12. How do you implement zero-downtime deployments?

**KPZ Deployment Strategy**:

"KPZ currently uses **immutable deployments** with Lambda (inherently zero-downtime). Planning **blue-green deployments for Kubernetes**.

**Lambda (Current)**:
- GitHub Actions updates Lambda function code
- AWS handles traffic switch atomically
- No downtime during deployment
- Rollback: Revert to previous Lambda version ($LATEST → specific version)

**Kubernetes (Planned)**:
- **Rolling Update Strategy**:
  ```yaml
  spec:
    strategy:
      type: RollingUpdate
      rollingUpdate:
        maxUnavailable: 0    # Always maintain capacity
        maxSurge: 1          # Add 1 extra pod during update
  ```
- **Health Checks**:
  - Readiness probe: Only send traffic when pod is ready
  - Liveness probe: Restart pod if unhealthy
- **Deployment Process**:
  1. Start new pods (v2)
  2. Wait for readiness probes to pass
  3. Gradually shift traffic from v1 → v2
  4. Terminate v1 pods only after v2 stable
- **Rollback**: `kubectl rollout undo deployment/<name>`

**Frontend (S3/CloudFront)**:
- S3 sync uploads new files
- CloudFront invalidation forces cache refresh
- Old version still accessible until cache invalidates (~5 minutes)

**Best Practices**:
- ✅ **Health Checks**: Application signals when ready
- ✅ **Graceful Shutdown**: Handle SIGTERM, finish in-flight requests
- ✅ **Database Migrations**: Backward-compatible changes
- ✅ **Feature Flags**: Decouple deployment from feature activation
- ✅ **Monitoring**: Watch error rates during deployment, auto-rollback if errors spike

**Industry Adaptations**:
- *Consultancy*: \"Blue-green and canary deployment patterns for client flexibility\"
- *Banking*: \"Change windows (off-peak hours), mandatory rollback testing\"
- *Healthcare*: \"Zero-downtime critical for patient-facing systems, tested rollback procedures\"
- *Tech*: \"Continuous deployment (10+ releases/day) with automated rollback\""

---

### 13. What monitoring metrics do you consider most important?

**RED Method** (for services):

"I focus on **RED metrics** for service health and **USE metrics** for resources:

**RED (Request-focused)**:
1. **Rate**: Requests per second (throughput)
2. **Errors**: Error rate (4xx, 5xx)
3. **Duration**: Response time (p50, p95, p99)

**USE (Resource-focused)**:
1. **Utilization**: % of resource in use (CPU, memory)
2. **Saturation**: Queue depth, backlog
3. **Errors**: Hardware/software errors

**KPZ Monitoring**:

**Application Metrics**:
- **API Latency**: p50, p95, p99 response times (target: p95 < 300ms)
- **Error Rate**: % of requests with errors (target: < 1%)
- **Throughput**: Requests/second by endpoint
- **Success Rate**: % of successful API calls (target: > 99%)

**Infrastructure Metrics**:
- **Lambda**: Invocations, duration, errors, cold starts, throttles
- **Database**: Query time, connections, replication lag
- **CloudFront**: Cache hit rate, bandwidth, edge errors
- **S3**: Bucket size, request count

**Business Metrics**:
- **User Signups**: Daily signup rate
- **Email Delivery**: SES send rate, bounce rate
- **Scraper Success**: % of successful Kita data scrapes

**Alerting Thresholds**:
- **Critical**: API error rate > 1%, latency p95 > 500ms, service down
- **Warning**: Cold starts > 10%, database query time > 200ms
- **Info**: Daily usage summary

**Dashboards**:
1. **Service Health**: RED metrics, availability
2. **Infrastructure**: Lambda performance, database, CDN
3. **Business**: User activity, email delivery

**Industry Adaptations**:
- *Consultancy*: \"Metrics framework adaptable to client's existing tools (DataDog, Prometheus, CloudWatch)\"
- *Banking*: \"Compliance metrics (audit log delivery, encryption status), SLA tracking\"
- *Healthcare*: \"Patient impact metrics, GDPR compliance dashboards\"
- *Tech*: \"Real-time metrics, anomaly detection, automated alerting\""

---

### 14. How do you approach disaster recovery and backup strategies?

**KPZ Disaster Recovery**:

"I implement DR across multiple layers in KPZ:

**1. Data Backups (MongoDB Atlas)**:
- **Automated backups**: Daily snapshots, 7-day retention
- **Point-in-time recovery**: Restore to any moment
- **Geo-redundancy**: Replicas in multiple AWS regions
- **Recovery Time Objective (RTO)**: < 1 hour
- **Recovery Point Objective (RPO)**: < 24 hours (last backup)

**2. Infrastructure (Terraform)**:
- **Infrastructure as Code**: Entire stack reproducible
- **Terraform state versioned**: S3 versioning enables state rollback
- **Multi-region capable**: Can deploy to any AWS region
- **Recovery**: `terraform apply` in new region (< 30 minutes)

**3. Application Code (Git)**:
- **Version control**: All code in GitHub
- **Branch protection**: Main branch requires review
- **Tag releases**: Rollback to any version
- **Recovery**: Redeploy previous version via CI/CD

**4. Secrets (GitHub Secrets + AWS)**:
- **GitHub Secrets**: Backed up in 1Password
- **MongoDB credentials**: Recoverable via MongoDB Atlas
- **AWS access**: OIDC roles (no stored credentials)

**5. CDN/Static Assets (CloudFront/S3)**:
- **S3 versioning**: Previous file versions retained
- **CloudFront**: Multi-edge distribution (inherent HA)
- **Recovery**: Sync from Git → S3

**DR Testing**:
- **Quarterly**: Simulate MongoDB restore from backup
- **Monthly**: Test terraform apply in isolated environment
- **Continuous**: Every deployment is a recovery test (IaC)

**Disaster Scenarios**:
- **Database Corruption**: Restore from MongoDB Atlas snapshot (< 1 hour)
- **AWS Region Failure**: Deploy to new region with Terraform (< 30 min)
- **Accidental Code Deploy**: Rollback via Git + CI/CD (< 5 min)
- **Compromised Credentials**: Rotate via MongoDB Atlas, revoke OIDC trust (< 15 min)

**Industry Adaptations**:
- *Consultancy*: \"DR framework template for client use (RTO/RPO based on budget)\"
- *Banking/Fintech*: \"RTO < 15 min, RPO < 5 min, quarterly DR drills, cross-region failover, FINMA compliance\"
- *Healthcare*: \"Patient data recovery priority, GDPR-compliant backup retention\"
- *Tech*: \"Automated failover, chaos engineering tests\""

---

### 15. What's your experience with Docker and containerization?

**KPZ Docker Experience**:

"I have hands-on Docker experience in KPZ for local development:

**Current Usage (Backend Local Development)**:
```dockerfile
# backend/Dockerfile (for local development)
FROM node:18.16.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [\"npm\", \"run\", \"local\"]
```

**Docker Commands** (backend/package.json):
- `npm run docker-local`: Start containerized backend
- `npm run docker-local-new-build`: Rebuild container

**Benefits**:
- **Consistency**: Same environment across team members
- **Isolation**: Doesn't interfere with local Node.js versions
- **Fast Onboarding**: New developers run Docker, no Node setup

**Kubernetes Migration (Planned)**:
- Containerize backend for EKS deployment
- Multi-stage build (build → runtime separation):
  ```dockerfile
  # Build stage
  FROM node:18 AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  RUN npm run build

  # Runtime stage
  FROM node:18-alpine
  WORKDIR /app
  COPY --from=build /app/dist ./dist
  COPY --from=build /app/node_modules ./node_modules
  CMD [\"node\", \"dist/index.js\"]
  ```
- **Optimize for size**: Alpine base (< 50MB), multi-stage build
- **Security**: Non-root user, minimal dependencies
- **Push to ECR**: AWS Elastic Container Registry

**Docker Best Practices**:
- ✅ **Multi-stage builds**: Smaller images, faster deployments
- ✅ **.dockerignore**: Exclude node_modules, .git
- ✅ **Layer caching**: COPY package.json first (cache dependencies)
- ✅ **Non-root user**: Security best practice
- ✅ **Health checks**: HEALTHCHECK directive

**Industry Adaptations**:
- *Consultancy*: \"Containerization strategy for client modernization (lift-and-shift to K8s)\"
- *Banking*: \"Container image scanning (Trivy, Snyk), signed images, private registry\"
- *Healthcare*: \"PHI-free base images, GDPR-compliant logging\"
- *Tech*: \"Microservices architecture, service mesh (Istio)\""

---

## Behavioral Questions (16-20)

### 16. Tell me about a time you had to learn a new technology quickly.

**STAR Format**:

**Situation**:
\"When I joined the Platform team at Safety.io, I needed to migrate legacy Ansible infrastructure to Terraform across 57 AWS accounts, but I had limited Terraform experience.

**Task**:
Learn Terraform well enough to lead the migration within 3 months while maintaining existing infrastructure.

**Action**:
1. **Structured Learning** (2 weeks):
   - HashiCorp Learn tutorials (Terraform Associate path)
   - Studied existing Terraform in the codebase
   - Read Terraform best practices documentation
2. **Hands-On Practice**:
   - Started with low-risk resources (S3 buckets, IAM policies)
   - Gradually tackled complex resources (VPCs, ECS clusters)
   - Refactored Ansible playbooks into Terraform modules
3. **Peer Learning**:
   - Paired with senior engineers for code reviews
   - Asked questions in team Slack channel
   - Documented patterns for team knowledge base
4. **Incremental Migration**:
   - Migrated one account per week (reduced risk)
   - Tested thoroughly in dev before touching prod
   - Created rollback procedures

**Result**:
- **Migrated 57 AWS accounts** from Ansible to Terraform in 4 months
- **Zero production incidents** during migration
- **Became team Terraform expert**, now mentor others
- **Improved deployment speed** by 60% (Terraform vs Ansible)
- **Passed AWS Certified Developer** (validates cloud knowledge)

**Key Takeaway**: I learn best by combining structured study with hands-on practice, and I'm comfortable asking for help when needed.

**Industry Adaptations**:
- *Consultancy*: \"Learning agility critical for diverse client projects\"
- *Banking*: \"Learned FINMA regulations in parallel with technical implementation\"
- *Healthcare*: \"GDPR compliance requirements learned while building features\"
- *Tech*: \"Fast learning enables quick adoption of new tools/frameworks\""

---

### 17. Describe a time you disagreed with a team decision. How did you handle it?

**STAR Format**:

**Situation**:
\"Our team was planning to use DynamoDB for Terraform state locking, following an older best practice. I had researched that S3 bucket versioning now provides equivalent locking with simpler setup.

**Task**:
Convince the team to use S3 versioning instead of adding DynamoDB complexity.

**Action**:
1. **Research**: Gathered evidence (AWS docs, community discussions, cost comparison)
2. **Data-Driven Argument**:
   - S3 versioning: $0/month (included in S3 costs)
   - DynamoDB: ~$5-10/month (additional resource)
   - Simpler architecture: One less service to maintain
3. **Respectful Presentation**:
   - Acknowledged DynamoDB was valid historically
   - Presented findings in team meeting (not confrontational)
   - Offered to implement PoC to prove it works
4. **Compromise**: Suggested we try S3 versioning in dev, keep DynamoDB option for prod if issues arise

**Result**:
- **Team agreed** after seeing cost/simplicity benefits
- **Implemented S3 versioning** across all environments
- **Saved $120/year** per environment (12 environments = $1440/year)
- **Simplified onboarding**: New team members have one less concept to learn

**Key Takeaway**: I disagree respectfully with data, offer to prove my point, and remain open to being wrong.

**Industry Adaptations**:
- *Consultancy*: \"Client disagreed with my recommendation, I presented trade-offs clearly, let them decide\"
- *Banking*: \"Navigated regulatory vs technical trade-offs, found compliant solution\"
- *Healthcare*: \"Balanced GDPR requirements with user experience, found middle ground\""

---

### 18. How do you prioritize tasks when you have multiple urgent requests?

**Approach**:

"I use a framework based on **impact, urgency, and dependencies**:

**Prioritization Matrix**:
1. **Critical + Urgent**: Production outages, security vulnerabilities
   - Example: API down, users can't sign up → fix immediately
2. **Critical + Not Urgent**: Technical debt, upcoming deadlines
   - Example: Terraform upgrade before end-of-support → schedule this week
3. **Not Critical + Urgent**: Interruptions, quick fixes
   - Example: Teammate needs help debugging → time-box to 30 min
4. **Not Critical + Not Urgent**: Nice-to-haves, optimizations
   - Example: Refactor scraper Lambda → backlog

**KPZ Example**:

**Scenario**: Same day:
- (A) Production MongoDB connection failing intermittently
- (B) Manager asks for cost optimization report (due next week)
- (C) Teammate needs code review for their PR
- (D) I want to implement DataDog monitoring (learning goal)

**My Prioritization**:
1. **(A) Fix MongoDB connection** - CRITICAL (impacts users)
   - Immediate action: Investigate logs, check connection pool, contact MongoDB Atlas support
   - Time-box: 2 hours, escalate if not resolved
2. **(C) Code review for teammate** - URGENT (unblocks teammate)
   - Time-box: 30 minutes
   - If complex, schedule pairing session later
3. **(B) Cost optimization report** - NOT URGENT (due next week)
   - Schedule: 2 hours tomorrow morning
   - Gather data: CloudWatch billing, resource usage
4. **(D) DataDog implementation** - NOT URGENT (learning goal)
   - Defer to Week 2 learning schedule
   - Focus on Week 1 priorities first

**Communication**:
- Notify manager: \"MongoDB issue is critical, cost report will be ready Wednesday\"
- Update teammate: \"PR reviewed in 30 min, detailed feedback by EOD\"
- Block calendar: Prevent more interruptions during critical fix

**Key Principles**:
- ✅ **User Impact First**: Production issues before internal tasks
- ✅ **Communicate Transparently**: Set expectations on timelines
- ✅ **Time-box Interruptions**: Limit context switching
- ✅ **Scheduled Deep Work**: Protect focus time for complex tasks

**Industry Adaptations**:
- *Consultancy*: \"Multiple clients competing for time → prioritize by SLA, client relationship, contract value\"
- *Banking*: \"Regulatory deadline > feature release, escalation matrix for production issues\"
- *Healthcare*: \"Patient-impacting issues take absolute priority\"
- *Tech*: \"OKR-aligned work prioritized, experiments time-boxed\""

---

### 19. Tell me about a time you made a mistake. How did you handle it?

**STAR Format**:

**Situation**:
\"While deploying a Terraform change to KPZ dev environment, I accidentally deleted an S3 bucket containing user-uploaded images instead of the intended test bucket.

**Task**:
Recover the data quickly and prevent this from happening again.

**Action**:
1. **Immediate Response** (First 10 minutes):
   - Stopped the Terraform apply (prevented further damage)
   - Checked S3 versioning: Enabled! (lucky break)
   - Notified team in Slack: \"I deleted the images bucket, recovering now\"
2. **Recovery** (Next 30 minutes):
   - Recreated bucket with same name
   - Restored all object versions from S3 versioning
   - Verified data integrity (sampled 100 files)
   - Tested image access in dev environment (all working)
3. **Root Cause Analysis**:
   - Bucket name similarity: `kpz-dev-images` vs `kpz-dev-test-images`
   - No confirmation prompt for destructive action
   - Tired at end of day → made careless mistake
4. **Prevention** (Permanent fixes):
   - **Terraform safeguards**: Added `prevent_destroy` lifecycle rule to critical resources
   - **Naming convention**: Prefix critical buckets with `prod-` or `critical-`
   - **Code review**: All Terraform changes require PR review (even in dev)
   - **S3 versioning**: Enabled on ALL buckets (not just some)
   - **Documentation**: Created \"Lessons Learned\" in team wiki

**Result**:
- **Zero data loss**: 100% recovery thanks to S3 versioning
- **Downtime**: ~45 minutes for dev environment (no user impact)
- **Team response**: Praised for transparent communication and fast recovery
- **Long-term**: No similar incidents in 2 years since (safeguards working)

**Key Takeaway**: I own my mistakes immediately, focus on recovery first, then implement systemic fixes to prevent recurrence. Transparency builds trust.

**Industry Adaptations**:
- *Consultancy*: \"Mistake during client demo, recovered gracefully, client appreciated honesty\"
- *Banking*: \"Incident report filed, root cause analysis, compliance notification (if required)\"
- *Healthcare*: \"Patient data safeguards, incident response procedure, GDPR breach assessment (even if no breach)\"
- *Tech*: \"Blameless postmortem, shared with team for collective learning\""

---

### 20. Why do you want to work in consulting / for our company?

**Consulting-Focused Answer**:

"I'm drawn to consulting for three specific reasons:

**1. Multi-Industry Exposure**:
I've spent 5.5 years in IoT/Safety tech. I want to broaden my experience across healthcare, banking, retail, and other industries. Each industry has unique challenges:
- Healthcare: GDPR compliance, patient data privacy
- Banking: FINMA regulations, uptime requirements, audit trails
- Tech startups: Rapid iteration, cost optimization
- Retail: Seasonal traffic patterns, peak scaling

Consulting lets me build versatile skills rather than deep specialization in one domain.

**2. Client-Facing Problem Solving**:
I enjoy translating technical concepts for non-technical stakeholders. In my current role, I present infrastructure decisions to product managers and executives. I want to develop this skill further by working directly with diverse clients, understanding their business goals, and recommending technical solutions that drive business value.

**3. Continuous Learning**:
Consulting forces you to stay current with emerging technologies. Each project brings new tools, patterns, and challenges. This aligns with my learning approach: I'm currently implementing Kubernetes and DataDog in KPZ specifically because they're universal requirements across consultancies.

**Why [Specific Company]**:
- **PwC/Deloitte/Accenture**: Global scale, diverse projects, strong training programs
- **Swisscom**: Local market expertise, blend of consulting and product work
- **Boutique firm**: Hands-on technical work, direct client relationships

**What I Bring**:
- **Breadth**: AWS, Terraform, K8s, CI/CD, observability (95% of job requirements)
- **Portfolio**: KPZ demonstrates end-to-end DevOps implementation
- **Communication**: Can explain Terraform to C-suite executives
- **Learning Agility**: Demonstrated by AWS certs, self-directed K8s learning
- **Work Ethic**: Marathon runner mentality (disciplined, goal-oriented)

**Industry Adaptations**:
- *Tech Company*: \"Your focus on innovation and rapid iteration aligns with my experience building KPZ serverless platform. I want to work on products that scale to millions of users.\"
- *Banking/Fintech*: \"I'm drawn to the challenge of balancing innovation with regulatory compliance. My experience with security best practices in KPZ (least-privilege IAM, encryption) prepares me for Swiss banking standards (FINMA).\"
- *Healthcare*: \"I'm motivated by mission-driven work. Technology that improves patient outcomes is compelling. My GDPR-awareness from KPZ (data privacy, consent management) translates to healthcare compliance.\""

---

## Consultancy-Specific Behavioral Questions

### How would you explain a complex technical concept to a non-technical client?

**Approach**: Use analogies, avoid jargon, focus on business impact.

**Example: Explaining Kubernetes to a CFO**:

"Kubernetes is like a smart logistics system for your software.

**Without Kubernetes** (Traditional Servers):
- You rent a fleet of delivery trucks (servers)
- Some trucks are mostly empty (wasted money)
- Some trucks are overloaded (performance issues)
- If a truck breaks down, packages are lost (downtime)

**With Kubernetes** (Container Orchestration):
- You have a smart dispatcher that automatically:
  - Packs packages efficiently (maximizes server usage → cost savings)
  - Routes around broken trucks (automatic failover → reliability)
  - Adds more trucks during peak times (auto-scaling → performance)
  - Removes trucks when traffic is low (cost optimization)

**Business Impact**:
- **Cost**: 30-40% reduction in infrastructure spend (better utilization)
- **Reliability**: 99.99% uptime (automatic recovery)
- **Agility**: Deploy updates 10x faster (roll out features quickly)

**Trade-off**:
- **Upfront Cost**: 3-6 months to implement and train team
- **Recommendation**: Worth it for companies with >$10k/month cloud spend or mission-critical uptime requirements"

---

## STAR Format Template

For any behavioral question, use this structure:

**Situation** (2-3 sentences):
- Context: Where, when, what project?
- Challenge: What was the problem?

**Task** (1-2 sentences):
- Your responsibility: What did you need to achieve?
- Success criteria: How would you measure success?

**Action** (4-5 bullet points):
- Specific steps you took (use "I", not "we")
- Technical details (tools, methods, decisions)
- Collaboration (if relevant)

**Result** (2-3 sentences):
- Quantified outcome: Numbers, metrics, impact
- Learning: What did you learn?
- Adaptation: Industry-specific variation

---

## Next Steps

1. **Practice Delivery**: Record yourself answering top 10 questions (5-minute KPZ pitch)
2. **KPZ Portfolio**: Create architecture diagram for visual aid during interviews
3. **Mock Interviews**: Practice with friend or mentor (get feedback)
4. **Tailor Answers**: Customize based on job description (consultancy vs tech vs banking)
5. **Stay Current**: As you implement K8s and DataDog, add to interview answers

**Remember**: Authenticity > perfection. It's okay to say "I don't know, but here's how I'd find out."
