#!/bin/bash

# EKS cluster startup script
# Usage: ./scripts/eks-up.sh [/path/to/aws/config]
# Example: ./scripts/eks-up.sh ~/.aws/config-personal

set -euo pipefail

# Prerequisites: terraform, kubectl, helm, aws cli
for cmd in terraform kubectl helm aws; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: '$cmd' is required but not installed." >&2
    exit 1
  fi
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Optional AWS config file — defaults to ~/.aws/config-personal
AWS_CONFIG_FILE="${1:-$HOME/.aws/config-personal}"
AWS_CONFIG_FILE="${AWS_CONFIG_FILE/#\~/$HOME}"

export AWS_CONFIG_FILE
export AWS_PROFILE="${AWS_PROFILE:-kpz-dev}"

echo "Spinning up EKS infrastructure..."
echo "AWS config: $AWS_CONFIG_FILE"
echo "AWS profile: $AWS_PROFILE"

terraform -chdir="$PROJECT_ROOT/terraform/environments/dev-eks" apply -auto-approve

echo "Updating kubeconfig..."
aws eks update-kubeconfig \
  --region eu-central-1 \
  --name kpz-dev-eks-cluster \
  --profile "$AWS_PROFILE"

echo "Verifying nodes..."
kubectl get nodes

echo "Installing AWS Load Balancer Controller..."
VPC_ID=$(terraform -chdir="$PROJECT_ROOT/terraform/environments/dev-eks" output -raw vpc_id)
LBC_ROLE_ARN=$(terraform -chdir="$PROJECT_ROOT/terraform/environments/dev-eks" output -raw aws_lbc_role_arn)

helm repo add eks https://aws.github.io/eks-charts 2>/dev/null || true
helm repo update

helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=kpz-dev-eks-cluster \
  --set serviceAccount.create=true \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set "serviceAccount.annotations.eks\.amazonaws\.com/role-arn=${LBC_ROLE_ARN}" \
  --set region=eu-central-1 \
  --set vpcId="${VPC_ID}"

echo "Waiting for Load Balancer Controller to be ready..."
kubectl rollout status deployment/aws-load-balancer-controller -n kube-system

echo "Applying Kubernetes manifests..."
kubectl apply -f "$PROJECT_ROOT/k8s/"

echo "EKS cluster ready."
osascript -e 'display notification "EKS cluster is up and ready." with title "KPZ Infrastructure"' 2>/dev/null || true
