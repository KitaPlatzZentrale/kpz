#!/bin/bash

# EKS cluster teardown script
# Usage: ./scripts/eks-down.sh [/path/to/aws/config]
# Example: ./scripts/eks-down.sh ~/.aws/config-personal

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Optional AWS config file — defaults to ~/.aws/config-personal
AWS_CONFIG_FILE="${1:-$HOME/.aws/config-personal}"
AWS_CONFIG_FILE="${AWS_CONFIG_FILE/#\~/$HOME}"

export AWS_CONFIG_FILE
export AWS_PROFILE="${AWS_PROFILE:-kpz-dev}"

echo "Tearing down EKS infrastructure..."
echo "AWS config: $AWS_CONFIG_FILE"
echo "AWS profile: $AWS_PROFILE"

terraform -chdir="$PROJECT_ROOT/terraform/environments/dev-eks" destroy -auto-approve

echo "EKS infrastructure successfully destroyed."
osascript -e 'display notification "EKS cluster destroyed — billing stopped." with title "KPZ Infrastructure"' 2>/dev/null || true
