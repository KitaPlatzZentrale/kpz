# Kitaplatz-Zentrale

## Getting Started

To explore the features of Kitaplatz-Zentrale:

- **Production**: <https://kitaplatz-zentrale.de/> (Coming soon)
- **Dev Environment**: <https://dev.kitaplatz-zentrale.de/> (Currently active)

## Introduction

In big cities like Berlin it is a struggle to find a Kindergarten both for the parents who have to start applying for the Kindergarten even before the child is born and the kindergartens who are being flooded with calls and visits from parents even when they are already full.
Furthermore many parents have some requirements towards the kindergarten starting with distance but also more specific things like bilingual, raising concepts etc.
The Kindergarten also not just accepts any child that comes but rather picks children according to their age, gender etc. so that there is a good distribution of children present at all times.
This process is tedious and not optimal. We want to solve it by building a Kitaplatz-zentrale, an online platform that lets parents search for Kindergarten that match their requirements and apply there in the fastest way possible.
Kindergarten will then be able to accept the children they want in a convenient way.

## Architecture

![KPZ-Cloud Architecture + CD _ CD - CI _ CD   Current Design (5)](https://github.com/KitaPlatzZentrale/kpz/assets/32839416/73f30d25-c62b-45ae-9042-7b057787632c)

### Core Services

- **Backend API**: Node.js/Express service deployed as AWS Lambda function behind API Gateway. Handles incoming requests, writes and fetches data from MongoDB. Includes location-service logic.

- **Frontend**: React/Vite SPA deployed to S3 and served via CloudFront with HTTPS custom domain support (`dev.kitaplatz-zentrale.de`).

- **AWS EventBridge**: Consumes events emitted by MongoDB change streams and triggers various Lambda functions based on different event types.

- **Email Service**: Integrates with AWS SES and consists of multiple Lambda functions responsible for sending different types of emails (signup confirmations, notifications, etc.).

- **Slack Notification Service**: Handles SNS integration with Lambda functions triggered by SNS notifications for errors and signups, sending messages to Slack.

- **Scraper Service**: Scheduled Lambda function (runs daily at 2 AM UTC via EventBridge) that scrapes Kita data from berlin.de and updates MongoDB.

- **Location Service**: Lambda function providing geospatial search using MongoDB geoNear for finding Kitas within a specified radius.

### Infrastructure

- **Terraform**: Infrastructure as Code managing all AWS resources (Lambda, API Gateway, S3, CloudFront, ACM certificates, IAM roles, EventBridge)
- **HTTPS/SSL**: ACM certificates provisioned in us-east-1 for CloudFront integration
- **Custom Domains**: DNS managed in management account with cross-account validation
- **CI/CD**: GitHub Actions workflows for automated deployment to dev environment

For detailed architecture documentation, see `docs/Deployment-Architecture.md` and `docs/Architecture.md`.

## Development Setup

### Prerequisites

- Node.js v18.16.0 (backend requirement)
- Terraform 1.13.1
- [MongoDB setup for local development](https://www.mongodb.com/docs/manual/installation/)
- AWS CLI configured with profile from `/Users/anthonysherrill/.aws/config-personal`

### Environment Variables

Each service (`backend`, `email`, `notification`) requires a `.env` file for local development. Contact a main contributor for environment variable values.

### Backend

```bash
cd backend
npm install

# Compile TypeScript (watch mode)
npx tsc --watch

# In a new terminal, run the server
npm run local

# Build Lambda deployment package
npm run build:lambda
```

### Frontend

```bash
cd frontend
npm install    # or: yarn install
npm run dev    # or: yarn dev

# Production build
npm run build
```

### Email Service (Lambda)

```bash
cd email
yarn install
yarn build    # Creates dist/ and zips each function

# Local email development
yarn dev      # React Email dev server
```

### Notification Service (Lambda)

```bash
cd notification
yarn install
yarn build    # Creates dist/ and zips functions
```

### Scraper Service (Lambda)

```bash
cd scraper
npm install
npm run build # Creates dist/index.zip for Lambda deployment
```

### Location Service (Lambda)

```bash
cd location-service
npm install
# Build using esbuild (check package.json for specific commands)
```

### Terraform Infrastructure

```bash
cd terraform/environments/dev  # or prod

# Initialize Terraform
terraform init

# Plan infrastructure changes
terraform plan

# Apply infrastructure changes
terraform apply
```

## AWS Configuration for Local Development

When running Terraform or AWS CLI commands locally, set the appropriate AWS profile for the target environment.

**Profiles**:
- `<your-dev-profile>` - KPZ development environment
- `<your-prod-profile>` - KPZ production environment

**Usage**:
```bash
# Terraform
export AWS_PROFILE=<your-dev-profile>
terraform plan

# AWS CLI
AWS_PROFILE=<your-dev-profile> aws s3 ls

# If using a non-default AWS config file location, also set:
export AWS_CONFIG_FILE=/path/to/your/aws/config
```

**Example** (values will differ per developer):
```bash
export AWS_PROFILE=kpz-dev
terraform plan
```

**Important**: Always verify which profile to use based on the target AWS account.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Deployment-Setup.md](docs/Deployment-Setup.md)** - Step-by-step deployment workflow
- **[Deployment-Architecture.md](docs/Deployment-Architecture.md)** - Complete infrastructure overview
- **[Domain-Setup-Guide.md](docs/Domain-Setup-Guide.md)** - Custom domain and HTTPS setup
- **[Development-Guide.md](docs/Development-Guide.md)** - Local development best practices
- **[Architecture.md](docs/Architecture.md)** - System architecture and design decisions
- **[API-Reference.md](docs/API-Reference.md)** - API endpoint documentation

## API Documentation

Swagger/OpenAPI documentation: <https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0>
