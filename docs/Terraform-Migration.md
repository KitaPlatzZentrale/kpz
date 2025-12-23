# Terraform Migration Plan

> **Note**: This documentation is maintained in `pesonal-notes/terraform-migration-plan.md`
>
> This is a reference link for the wiki. The full migration plan is tracked in the project's personal notes folder.

## Quick Links

- **Full Migration Plan**: `../pesonal-notes/terraform-migration-plan.md` (in repository)
- **Current Status**: Planning Phase
- **Target**: Redeploy KPZ infrastructure to new AWS account with Terraform IaC

## Overview

We are planning a complete migration of the Kitaplatz-Zentrale infrastructure from the current AWS account to a new AWS account, using Terraform for infrastructure as code. This will provide:

- Version-controlled infrastructure
- Reproducible deployments
- Disaster recovery capabilities
- Multi-environment support (dev/staging/prod)

## Migration Phases

1. **Discovery & Documentation** - Understanding current infrastructure
2. **Terraform Setup** - Creating modules and configurations
3. **Development Environment** - Testing in new AWS account
4. **Production Migration** - Cutover to new infrastructure
5. **Documentation & Handoff** - Team enablement

## Key Decisions

Several architectural decisions need to be made:
- MongoDB hosting strategy (Atlas vs self-hosted)
- Multi-account strategy
- State file management
- Secrets management approach

## Current Progress

Track progress and detailed tasks in the full migration plan document.

## Resources

- AWS Account IDs (current): 897331788878 (backend), 400638005080 (frontend)
- Target Region: eu-central-1 (Frankfurt)
- Target Date: TBD

---

For the complete migration plan with detailed tasks and tracking, see:
**`pesonal-notes/terraform-migration-plan.md`** in the repository.
