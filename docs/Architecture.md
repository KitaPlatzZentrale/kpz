# Architecture

This document describes the high-level architecture of Kitaplatz-Zentrale (KPZ).

## System Overview

KPZ is a cloud-native application built on AWS, following a microservices architecture with event-driven communication.

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────────┐
│   CloudFront    │ (CDN)
│   + S3 Bucket   │ (Frontend Static Files)
└─────────────────┘
       │
       │ API Calls
       │
┌──────▼──────────┐
│  Load Balancer  │
└──────┬──────────┘
       │
┌──────▼──────────┐
│   ECS Cluster   │
│  (Backend API)  │
└──────┬──────────┘
       │
       │ Reads/Writes
       │
┌──────▼──────────┐         ┌─────────────┐
│    MongoDB      │────────▶│ EventBridge │
│  (Database)     │ Change  └──────┬──────┘
└─────────────────┘ Streams        │
                                   │ Triggers
                    ┌──────────────┼──────────────┐
                    │              │              │
             ┌──────▼────┐  ┌──────▼────┐  ┌──────▼────┐
             │   Email   │  │Notification│  │  Scraper  │
             │  Lambda   │  │  Lambda   │  │  Lambda   │
             └──────┬────┘  └──────┬────┘  └───────────┘
                    │              │
             ┌──────▼────┐  ┌──────▼────┐
             │    SES    │  │    SNS    │
             │  (Email)  │  │  (Slack)  │
             └───────────┘  └───────────┘
```

## Components

### Frontend (React SPA)

**Technology**: React 18, TypeScript, Vite, MUI Joy, Mapbox GL

**Responsibilities**:
- User interface for Kita search
- Interactive map visualization
- User signup forms
- Consent management

**Deployment**:
- Built as static files
- Hosted on AWS S3
- Distributed via CloudFront CDN
- HTTPS via ACM certificate

**Key Files**:
- `frontend/src/router.tsx` - Route definitions
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components

### Backend API (Node.js/Express)

**Technology**: Node.js 18, Express, TypeScript, Mongoose

**Responsibilities**:
- RESTful API endpoints
- Business logic
- Database operations
- Request validation
- Security (Helmet, rate limiting, HPP)

**Deployment**:
- Containerized with Docker
- Pushed to ECR
- Deployed to ECS cluster
- Behind Application Load Balancer

**API Endpoints**:
```
POST   /signup/kita-finder        # Subscribe to Kita finder
POST   /signup/single             # Subscribe to single Kita
GET    /revoke-consent/:id        # Revoke email consent
GET    /confirm-consent/:id       # Confirm email consent
```

**Entity Structure**:
```
entities/
├── signups/
│   ├── handler/        # Express route handlers
│   ├── service.ts      # Business logic
│   ├── model.ts        # Mongoose schemas
│   └── types.ts        # TypeScript interfaces
└── user/
    ├── handler/
    └── validator/      # Shared validators
```

### Database (MongoDB)

**Technology**: MongoDB (Atlas or self-hosted)

**Collections**:
- **Kitas** - Kindergarten data
  - Location (GeoJSON Point for geospatial queries)
  - Address, contact details
  - Availability calendar
  - Capacity, age requirements
  - Pedagogical approach

- **Signups** - User signup records
  - User email and preferences
  - Consent status
  - Notification preferences

- **Users** - User consent tracking
  - Consent confirmation
  - Consent revocation

**Indexes**:
- Geospatial index on Kita locations
- UUID indexes for fast lookups

### Email Service (AWS Lambda)

**Technology**: Node.js, AWS SDK, React Email, SES

**Lambda Functions**:
1. `sendKitaFinderSignupEmail` - Welcome email for new signups
2. `sendSingleKitaNotificationsEmail` - Single Kita availability alerts
3. `sendKitaAvailabilityNotification` - General availability notifications
4. `confirmConsent` - Consent confirmation emails
5. `revokeConsent` - Consent revocation confirmations

**Triggers**: EventBridge rules (MongoDB change streams)

**Email Templates**: Built with React Email components

### Notification Service (AWS Lambda)

**Technology**: Node.js, AWS SDK, SNS

**Lambda Functions**:
1. `handleSignupNotification` - Notify team of new signups
2. `handleErrorNotification` - Alert team of errors
3. `handleScraping` - Scraping job notifications
4. `handleRetentionPeriod` - Data retention alerts

**Destination**: Slack channels via SNS webhooks

### Scraper Service (AWS Lambda)

**Technology**: Node.js, Axios, Mongoose

**Responsibilities**:
- Scrape Kita data from berlin.de
- Parse and structure data
- Update MongoDB with new information
- Track availability changes

**Trigger**: Scheduled (EventBridge cron)

### Location Service (AWS Lambda)

**Technology**: Node.js, Mongoose

**Responsibilities**:
- Geospatial Kita search
- Radius-based queries using MongoDB $geoNear
- Paginated results

**API**:
```
Input:  { lat, lng, radius, page, limit }
Output: { kitas: [...], total, page, hasMore }
```

**Trigger**: API Gateway or direct invocation from backend

## Data Flow

### User Signup Flow

1. **User** fills signup form on frontend
2. **Frontend** sends POST to `/signup/kita-finder`
3. **Backend API** validates request
4. **Backend** saves signup to MongoDB
5. **MongoDB** emits change stream event
6. **EventBridge** catches event and triggers Lambda
7. **Email Lambda** sends confirmation email via SES
8. **Notification Lambda** sends Slack notification via SNS

### Kita Search Flow

1. **User** enters location on frontend
2. **Frontend** requests user geolocation or address
3. **Frontend** calls Location Lambda (or backend endpoint)
4. **Location Service** queries MongoDB with $geoNear
5. **Location Service** returns paginated Kitas
6. **Frontend** displays results on map

### Scraping Flow

1. **EventBridge** triggers scraper on schedule
2. **Scraper Lambda** fetches data from berlin.de
3. **Scraper** parses HTML and extracts Kita data
4. **Scraper** updates MongoDB with changes
5. If availability changes:
   - MongoDB change stream triggers
   - EventBridge triggers notification Lambda
   - Email sent to subscribed users

## Security Architecture

### Frontend Security
- HTTPS only (CloudFront + ACM)
- Content Security Policy headers
- No sensitive data in client

### Backend Security
- **Helmet.js** - Security headers (HSTS, CSP, X-Frame-Options)
- **HPP** - HTTP Parameter Pollution protection
- **Rate Limiting** - 100 requests per 15 min per IP
- **Payload Limiting** - 100kb max request size
- **CORS** - Configured for frontend origin
- **Input Validation** - class-validator for all inputs
- **X-Powered-By Obfuscation** - Obscured as PHP

### Database Security
- Connection string in environment variables
- IAM authentication (if on AWS)
- Encrypted at rest
- Encrypted in transit (TLS)

### Lambda Security
- Execution roles with least privilege
- VPC configuration for database access
- Environment variables encrypted with KMS
- No public internet access (via VPC NAT)

### Secrets Management
- Environment variables for sensitive data
- AWS Secrets Manager (optional, for rotation)
- Never committed to repository

## Scalability

### Horizontal Scaling
- **Frontend**: CloudFront CDN (global edge locations)
- **Backend**: ECS auto-scaling based on CPU/memory
- **Lambda**: Automatic scaling (1000+ concurrent executions)

### Database Scaling
- MongoDB Atlas auto-scaling (if used)
- Read replicas for high traffic
- Geospatial indexes for fast queries

### Caching Strategy
- CloudFront caches static frontend assets
- API responses can be cached (not currently implemented)
- Consider Redis for session/cache layer (future)

## Monitoring & Logging

### Application Monitoring
- **Datadog APM** - Backend performance monitoring
- **CloudWatch Logs** - Lambda and ECS logs
- **CloudWatch Metrics** - Resource utilization

### Error Tracking
- Lambda errors → SNS → Slack
- Backend errors logged with Winston
- Frontend errors (to be implemented)

### Alerts
- ECS service health checks
- Lambda error rates
- Database connection failures
- High latency warnings

## Disaster Recovery

### Backup Strategy
- **Database**: MongoDB automated backups (daily)
- **Code**: Git repository (GitHub)
- **Infrastructure**: Terraform state (to be implemented)

### Recovery Time Objectives
- **Database**: < 1 hour (restore from backup)
- **Application**: < 30 minutes (redeploy from ECR)
- **Frontend**: < 5 minutes (S3 versioning)

## CI/CD Architecture

### Backend Pipeline
```
GitHub Push (main/dev)
  → GitHub Actions
  → Build Docker Image
  → Push to ECR
  → (Manual) Deploy to ECS
```

### Frontend Pipeline
```
GitHub Push (main)
  → GitHub Actions
  → Yarn Build
  → Upload to S3
  → Invalidate CloudFront
```

### Lambda Pipeline
- Manual deployment (to be automated)
- Build → Zip → Upload to Lambda console

## Future Architecture Improvements

### Planned Enhancements
- [ ] API Gateway for Lambda functions
- [ ] Redis cache layer for API
- [ ] GraphQL API (optional)
- [ ] WebSocket support for real-time updates
- [ ] Separate dev/staging/prod environments
- [ ] Blue-green deployments
- [ ] Automated Lambda deployments
- [ ] Error monitoring (Sentry integration)
- [ ] Performance monitoring (Lighthouse CI)

### Infrastructure as Code
- [ ] Complete Terraform migration (see [Terraform Migration](Terraform-Migration.md))
- [ ] Separate AWS accounts for prod/dev
- [ ] Terraform modules for reusability
- [ ] Automated infrastructure testing

## Technology Decisions

### Why AWS?
- Mature serverless ecosystem
- Strong Lambda and ECS support
- EventBridge for event-driven architecture
- Cost-effective for current scale

### Why MongoDB?
- Geospatial query support ($geoNear)
- Flexible schema for Kita data
- Change streams for event-driven triggers
- Good Node.js support (Mongoose)

### Why Serverless (Lambda)?
- Cost-effective for variable workloads
- Auto-scaling without management
- Event-driven by design
- Pay only for execution time

### Why ECS (not Lambda for API)?
- Long-running requests
- WebSocket support potential
- More control over environment
- Easier local development

---

For implementation details, see:
- [Development Guide](Development-Guide.md)
- [Deployment Guide](Deployment.md)
- [API Reference](API-Reference.md)
