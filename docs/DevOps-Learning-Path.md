# DevOps Learning Path

## Overview

This learning path transforms KPZ into a comprehensive DevOps portfolio while preparing for **mid-level Cloud DevOps Engineer roles in the Swiss market**, with primary focus on **consultancies** (PwC, Deloitte, Accenture).

**Timeline**: Aggressive 10-week preparation
**Goal**: Interview-ready in 2-3 weeks, offer by Week 8
**Target Start Date**: June 1st, 2026

## Learning Strategy

**RAPID Interview Prep Focus** (NOT comprehensive mastery):
- **Breadth over depth** (consultancy-aligned)
- **High-impact topics first** (95% of job requirements)
- **Portfolio building** (KPZ as showcase)
- **Interview readiness** (can explain trade-offs across industries)

## Critical Gaps to Fill

### 1. Kubernetes (M3) - HIGHEST PRIORITY
**Current State**: ZERO experience
**Market Reality**: Universal job requirement
**KPZ Implementation**: Migrate backend from Lambda to EKS (Week 2)
**Learning Time**: 21-30 hours (1 week intensive)

**Must Master**:
- Core concepts: Pods, Deployments, Services, Ingress
- K8s resource manifests (YAML)
- ConfigMaps and Secrets management
- Health checks and readiness probes
- Zero-downtime deployments
- Top 10 kubectl commands

**Interview Gold**:
- "Migrated serverless backend to EKS for better performance and cost predictability"
- Explain trade-offs: Lambda vs K8s for different client contexts

### 2. Observability/DataDog (M6) - HIGHEST PRIORITY
**Current State**: Low confidence
**Market Reality**: Critical for consultancy and tech company roles
**KPZ Implementation**: Implement DataDog APM (Week 2-3, issue #147)
**Learning Time**: 21-28 hours (1 week intensive)

**Must Master**:
- Metrics, logs, traces (three pillars of observability)
- APM (Application Performance Monitoring)
- Dashboard creation and alerting
- SLIs, SLOs, SLAs concepts
- Distributed tracing fundamentals

**Interview Gold**:
- "Implemented comprehensive observability with DataDog APM for production monitoring"
- Explain monitoring strategy for different compliance requirements

## Learning Milestones

### M1: AWS Cloud Platforms & Services
**Priority**: CRITICAL HIGH-IMPACT
**Current Level**: Strong (5.5 years experience, AWS certs)
**Focus**: Deepen understanding, document KPZ architecture

**KPZ Examples**:
- Lambda functions (backend API, email, notifications, scraper)
- API Gateway HTTP API
- S3 (frontend hosting, Terraform state)
- CloudFront (CDN with custom domain)
- EventBridge (scheduled scraping)
- IAM roles and policies
- Route53 (DNS management)
- ACM (TLS certificates)
- SES (email sending)
- SNS (notifications)

**Learning Tasks**:
1. Document Lambda architecture and cold start analysis
2. Explain API Gateway HTTP API vs REST API trade-offs
3. Document S3 lifecycle policies and versioning strategy
4. Audit IAM policies for least-privilege compliance

**Interview Prep**:
- "Walk me through the KPZ serverless architecture"
- "How would you reduce Lambda cold starts?"
- "Explain your IAM strategy for a healthcare client" (compliance focus)

---

### M2: Infrastructure as Code with Terraform
**Priority**: CRITICAL HIGH-IMPACT
**Current Level**: Strong (terraform/, modules, OIDC)
**Focus**: Document patterns, explain state management

**KPZ Examples**:
- Remote state in S3 with versioning
- Terraform modules (VPC, Lambda, S3, CloudFront, ACM)
- OIDC authentication for GitHub Actions
- Multi-environment management (dev/prod)
- Cross-account ACM certificate validation

**Learning Tasks**:
1. Document S3-based Terraform state management and remote backends
2. Explain Terraform module design patterns
3. Document OIDC flow for zero-credential CI/CD
4. Create reusable module examples

**Interview Prep**:
- "How do you manage Terraform state in a team environment?"
- "Explain your approach to multi-environment infrastructure"
- "How would you migrate a client from manual infrastructure to IaC?"

---

### M3: Containers & Orchestration (Docker/K8s)
**Priority**: CRITICAL HIGH-IMPACT (CRITICAL GAP)
**Current Level**: Docker experience, ZERO Kubernetes
**Focus**: Kubernetes implementation in KPZ

**Week 2 Implementation Plan** (21-30 hours):

**Day 1: Core Concepts** (3-4 hours)
- Knowledge Check: What problem does K8s solve? Pods vs Deployments vs Services?
- Study fundamentals: architecture, components, resource types

**Day 2-3: Hands-On** (8-12 hours)
- Set up EKS cluster via Terraform
- Containerize KPZ backend for K8s
- Create manifests: Deployment, Service, Ingress, ConfigMap, Secret

**Day 4-5: CI/CD Integration** (6-8 hours)
- Update GitHub Actions for EKS deployment
- Add health checks and readiness probes
- Test zero-downtime deployment
- Document rollback procedure

**Day 6-7: Interview Prep** (4-6 hours)
- Document "Lambda → K8s migration" story
- Memorize top 10 kubectl commands
- Practice explaining K8s architecture

**Interview Prep**:
- "Why use Kubernetes instead of Lambda or ECS?"
- "How would you scale a K8s deployment?"
- "Explain the difference between ClusterIP, NodePort, and LoadBalancer services"
- "How do you troubleshoot a failing pod?"

---

### M4: CI/CD Pipelines & GitOps
**Priority**: CRITICAL HIGH-IMPACT
**Current Level**: Strong (GitHub Actions, OIDC)
**Focus**: Document patterns, explain zero-trust security

**KPZ Examples**:
- GitHub Actions workflows (backend, frontend, Terraform)
- OIDC authentication (no long-lived credentials)
- Automated deployments on push to dev/main
- CloudFront cache invalidation
- Lambda function updates

**Learning Tasks**:
1. Document OIDC authentication flow in GitHub Actions
2. Explain zero-trust CI/CD security model
3. Document deployment strategies (blue-green, canary)
4. Create deployment rollback procedures

**Interview Prep**:
- "Explain your CI/CD pipeline for KPZ"
- "How do you ensure secure deployments without long-lived credentials?"
- "Walk me through your deployment rollback strategy"
- "How would you set up CI/CD for a banking client?" (compliance focus)

---

### M5: Scripting & Automation (Python/Bash)
**Priority**: LOW (fill gaps as needed)
**Current Level**: Strong (Bash advanced, Python)
**Focus**: Only if interview requires deeper expertise

**KPZ Examples**:
- Bash scripts for local development
- Python Lambda functions (scraper, location service)
- npm scripts for build automation

**Interview Prep**:
- "Write a script to automate [specific task]" (if asked during interview)

---

### M6: Observability & Monitoring
**Priority**: CRITICAL HIGH-IMPACT (CRITICAL GAP)
**Current Level**: Low confidence, CloudWatch basics
**Focus**: DataDog APM implementation

**Week 2-3 Implementation Plan** (21-28 hours):

**Day 1: Core Concepts** (3-4 hours)
- Knowledge Check: Metrics vs logs vs traces? What is APM? SLIs vs SLOs vs SLAs?
- Study observability fundamentals

**Day 2-3: DataDog Implementation** (8-10 hours, issue #147)
- Set up DataDog account and APM agent
- Instrument KPZ backend with DataDog Node.js APM
- Configure DataDog agent in EKS/Lambda
- Send custom metrics (API response times, DB queries)
- Set up log aggregation

**Day 4-5: Dashboards and Alerting** (6-8 hours)
- Create DataDog dashboard (latency p50/p95/p99, error rates, DB performance)
- Set up alerts (latency > 500ms, error rate > 1%)
- Document alerting strategy and on-call procedures

**Day 6-7: Interview Prep** (4-6 hours)
- Document observability strategy
- Practice explaining monitoring in interviews
- Prepare answers for distributed tracing questions

**Core Concepts to Master**:
- **Metrics**: Time-series data (CPU, memory, request rates, latency percentiles)
- **Logs**: Event records (application logs, error messages, audit trails)
- **Traces**: Request flow across services (distributed tracing)
- **APM**: Application Performance Monitoring (DataDog's core strength)
- **Alerting**: Proactive notification of issues (PagerDuty integration)
- **Dashboards**: Visualizing system health and performance

**Interview Prep**:
- "How do you monitor a production application?"
- "Explain the difference between metrics and logs"
- "How would you troubleshoot a slow API endpoint?"
- "What's your approach to setting up alerts?" (avoid alert fatigue)
- "How would you ensure observability for a healthcare client?" (GDPR compliance)

---

### M7: Security & Compliance
**Priority**: MEDIUM (common but less deep)
**Current Level**: Good (IAM, least-privilege)
**Focus**: Audit and document, compliance awareness

**KPZ Examples**:
- IAM roles with least-privilege policies
- Secrets management (MongoDB connection strings, API keys)
- HTTPS/TLS with ACM certificates
- Security headers (Helmet in backend)
- CORS configuration

**Learning Tasks**:
1. Audit IAM policies for least-privilege compliance
2. Document secrets management strategy
3. Research compliance standards: ISO 27001, GDPR, FINMA (Swiss banking)
4. Document security best practices in KPZ

**Interview Prep**:
- "How do you implement least-privilege access?"
- "Explain your secrets management approach"
- "How would you ensure GDPR compliance for a healthcare client?"
- "What security measures did you implement in KPZ?"

---

### M8: Networking Fundamentals
**Priority**: MEDIUM (common but less deep)
**Current Level**: Good (DNS, TLS, CloudFront)
**Focus**: Document KPZ networking architecture

**KPZ Examples**:
- Route53 DNS management
- ACM certificate provisioning and validation
- Cross-account DNS validation (management account)
- CloudFront CDN with custom domain
- API Gateway HTTP API endpoints
- VPC considerations (if EKS implemented)

**Learning Tasks**:
1. Document Route53 DNS flow and ACM cross-account validation
2. Explain CloudFront distribution and caching strategy
3. Document networking architecture for EKS (if implemented)

**Interview Prep**:
- "Explain how DNS resolution works in KPZ"
- "How did you set up the custom domain with HTTPS?"
- "What are the networking considerations for Kubernetes?"

---

## Week-by-Week Learning Plan

### Week 1: Foundation & Portfolio (23-31 hours)

**Days 1-2: Critical Interview Prep** (8-11 hours)
- [ ] Create Swiss-Market-DevOps-Guide.md (research consultancies, salaries, interview processes)
- [ ] Create DevOps-Interview-Prep.md (Top 20 Q&A with KPZ examples)
- [ ] Update LinkedIn and resume with KPZ achievements

**Days 3-5: Portfolio Positioning** (9-11 hours)
- [ ] LinkedIn profile update (headline, KPZ project, quantified achievements)
- [ ] Resume update with STAR format accomplishments
- [ ] Practice 5-minute KPZ architecture pitch (record and refine)
- [ ] Apply to 5-8 positions (consultancies + tech companies)

**Days 6-7: Quick Documentation** (6-9 hours)
- [ ] M2: Terraform state management docs
- [ ] M4: GitHub Actions OIDC flow docs
- [ ] M7: IAM policy audit

**Week 1 Goal**: Portfolio ready, applied to 5-8 positions, interview prep docs complete

---

### Week 2: High-Impact Technical Implementation (46-64 hours - MOST INTENSIVE)

**CRITICAL: Kubernetes Implementation** (21-30 hours)
- [ ] Day 1: Core concepts knowledge check and study
- [ ] Day 2-3: EKS setup, containerization, K8s manifests
- [ ] Day 4-5: CI/CD integration, health checks, zero-downtime testing
- [ ] Day 6-7: Documentation and interview prep

**CRITICAL: DataDog/Observability** (21-28 hours)
- [ ] Day 1: Observability concepts knowledge check and study
- [ ] Day 2-3: DataDog setup, APM instrumentation, custom metrics
- [ ] Day 4-5: Dashboards, alerting, log aggregation
- [ ] Day 6-7: Documentation and interview prep

**Additional Docs** (4-6 hours)
- [ ] M1: Lambda architecture docs (cold starts, provisioned concurrency)
- [ ] M8: Route53/ACM cross-account DNS docs

**Week 2 Goal**: Kubernetes implemented, DataDog live, can demo both in interviews, applied to 10+ more positions

---

### Week 3-4: Interview Loop & Targeted Learning (26-50 hours)

**Interview Preparation** (20-40 hours, variable)
- [ ] Pre-interview prep (2-3 hours per interview)
- [ ] Mock interviews (1-2 hours each)
- [ ] Post-interview documentation (capture questions, identify gaps)
- [ ] Targeted gap filling (2-4 hours per gap)
- [ ] Additional job applications (target: 15 total by end of Week 4)

**Consultancy-Specific Prep** (6-10 hours)
- [ ] Multi-client adaptability scenarios
- [ ] Cost/benefit analysis practice
- [ ] STAR format refinement for consulting context
- [ ] Practice explaining technical concepts to non-technical stakeholders

**Week 3-4 Goal**: 15+ applications, 3+ first-round interviews completed, second-round interviews scheduled

---

### Week 5-10: Ongoing Interview Loop & Offer Negotiation

**As interviews happen**:
- Document every interview question asked
- Identify knowledge gaps → create targeted learning tasks (2-4 hours each)
- Refine portfolio based on recruiter feedback
- Continue applications (target: 25-30 total)

**Week 8 Goal**: Final round interviews completed, offer received, salary negotiation

**Week 10 Goal**: Offer accepted, June 1st start date confirmed

---

## Swiss Market Alignment

### Consultancy Focus (PRIMARY TARGET)

**Why Consultancies?**:
- Multi-industry exposure (tech, healthcare, banking, fintech)
- Breadth over depth (matches this learning approach)
- International work environment (English-primary)
- High-value skill set (technical versatility + client communication)

**Key Skills for Consultancies**:
1. **Technical Breadth**: Can discuss AWS, K8s, Terraform, DataDog across contexts
2. **Client Communication**: Translate technical concepts to business stakeholders
3. **Multi-Industry Awareness**: Understand different compliance requirements (GDPR, FINMA, ISO 27001)
4. **Adaptability**: Demonstrate versatility through KPZ portfolio
5. **Cost/Benefit Analysis**: Explain trade-offs clearly for different client needs

**Target Consultancies**:
- PwC Switzerland
- Deloitte Switzerland
- Accenture Switzerland
- Swisscom (internal consulting)
- Boutique firms (smaller, specialized)

---

## KPZ Portfolio Highlights

**Map learning to interview talking points**:

| Milestone | KPZ Implementation | Interview Story |
|-----------|-------------------|-----------------|
| M1 (AWS) | Serverless architecture (Lambda, API Gateway, S3, CloudFront) | "Architected serverless platform serving 1000+ users, 99.9% uptime" |
| M2 (Terraform) | IaC managing 50+ resources, OIDC auth, remote state | "Implemented zero-credential CI/CD with Terraform and GitHub OIDC" |
| M3 (K8s) | Migrated backend from Lambda to EKS | "Migrated to Kubernetes for better cost predictability and control" |
| M4 (CI/CD) | GitHub Actions with automated deployments | "Built automated deployment pipeline with rollback capabilities" |
| M6 (Observability) | DataDog APM with dashboards and alerting | "Implemented comprehensive monitoring with SLIs/SLOs" |
| M7 (Security) | IAM least-privilege, secrets management, HTTPS | "Applied zero-trust security with least-privilege IAM policies" |
| M8 (Networking) | Custom domain with ACM, cross-account DNS | "Configured multi-account DNS with automated TLS certificate management" |

---

## Success Metrics

**Week 2**:
✅ Kubernetes implemented in KPZ (can demo)
✅ DataDog APM monitoring live
✅ Can explain both in interviews
✅ LinkedIn/resume updated
✅ Applied to 10-15 positions

**Week 4**:
✅ 15+ applications submitted
✅ 3+ first-round interviews completed
✅ Knowledge gaps documented and filled
✅ Second-round interviews scheduled

**Week 8**:
✅ Final round interviews completed
✅ Offer received (consultancy or tech company)
✅ Salary negotiation in progress

**Week 10**:
✅ Offer accepted
✅ June 1st, 2026 start date confirmed

---

## Next Steps

1. **TODAY**: Start with [Swiss-Market-DevOps-Guide.md](Swiss-Market-DevOps-Guide.md) - research consultancies
2. **THIS WEEK**: Complete [DevOps-Interview-Prep.md](DevOps-Interview-Prep.md) - Top 20 Q&A
3. **WEEK 2**: Focus on Kubernetes and DataDog implementation (highest impact)
4. **ONGOING**: Document insights in [DevOps-Learning-Insights.md](DevOps-Learning-Insights.md)

**Remember**: The goal is OFFER by Week 8, not complete mastery. Good enough to land the job, then learn more on the job.
