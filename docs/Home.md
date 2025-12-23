# Kitaplatz-Zentrale Documentation

Welcome to the Kitaplatz-Zentrale (KPZ) documentation wiki!

## What is Kitaplatz-Zentrale?

Kitaplatz-Zentrale is a platform that helps parents in Berlin find and apply to kindergartens (Kitas) while allowing kindergartens to manage applications efficiently. The system addresses the struggle of finding childcare in big cities like Berlin where parents often need to start applying even before their child is born.

## Quick Links

- **[Getting Started](Development-Guide.md)** - Set up your development environment
- **[Architecture](Architecture.md)** - System architecture and design
- **[API Reference](API-Reference.md)** - Backend API documentation
- **[Deployment](Deployment.md)** - How to deploy the application
- **[Terraform Migration](Terraform-Migration.md)** - Infrastructure as Code migration plan

## Project Overview

### Features

- **Kita Search** - Find kindergartens based on location and requirements
- **Application Management** - Apply to multiple Kitas efficiently
- **Email Notifications** - Get notified when Kitas have availability
- **Interactive Map** - Visual search interface with Mapbox

### Technology Stack

#### Frontend
- React 18 with TypeScript
- Vite for build tooling
- MUI Joy for UI components
- Mapbox GL for maps
- React Router for routing

#### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Security: Helmet, HPP, Rate Limiting

#### Infrastructure
- AWS ECS (Backend API)
- AWS Lambda (Email, Notifications, Scraping)
- AWS S3 + CloudFront (Frontend)
- AWS EventBridge (Event orchestration)
- AWS SES (Email delivery)
- AWS SNS (Slack notifications)

## Repository Structure

```
kpz/
├── backend/        # Node.js Express API
├── frontend/       # React SPA
├── email/          # AWS Lambda email functions
├── notification/   # AWS Lambda Slack functions
├── scraper/        # AWS Lambda scraper
├── location-service/ # AWS Lambda geospatial search
├── docs/           # Documentation (synced to wiki)
└── pesonal-notes/  # Internal project notes
```

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/KitaPlatzZentrale/kpz/issues)
- **API Docs**: [SwaggerHub](https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0)
- **Live Site**: [kitaplatz-zentrale.de](https://kitaplatz-zentrale.de)

## Contributing

This is an internal project. For contribution guidelines, see the [Development Guide](Development-Guide.md).

## License

[Add license information here]

---

Last updated: 2025-12-23
