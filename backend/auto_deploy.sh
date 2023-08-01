#!/bin/bash

set -e

# Parameters
DOCKER_IMAGE_NAME="kpz-api-k8ts"
DOCKER_IMAGE_TAG="v1.3"
ECR_REPOSITORY="public.ecr.aws/b2z0n9v4"
KUBERNETES_NAMESPACE="default"  # Change to your desired namespace
DEPLOYMENT_FILE="./kubernetes/deployment.yaml"

# Step 1: Log in to the ECR repository
echo "Logging in to ECR..."
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin "${ECR_REPOSITORY}"

# Step 2: Build the Docker image
echo "Building the Docker image..."
docker build -t "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" .

# Step 3: Tag the Docker image for the ECR repository
echo "Tagging the Docker image for ECR..."
docker tag "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" "${ECR_REPOSITORY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

# Step 4: Push the Docker image to the ECR repository
echo "Pushing the Docker image to ECR..."
docker push "${ECR_REPOSITORY}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

# Step 5: Apply the deployment manifest
echo "Applying the deployment manifest..."
kubectl apply -f "${DEPLOYMENT_FILE}" -n "${KUBERNETES_NAMESPACE}"

echo "Deployment complete!"
