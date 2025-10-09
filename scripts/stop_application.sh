#!/bin/bash
set -e

echo "Starting Application Stop phase..."

# Stop and remove existing container if running
CONTAINER_NAME="codebuild-app"

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Stopping existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME || true
    echo "Removing existing container: $CONTAINER_NAME"
    docker rm $CONTAINER_NAME || true
else
    echo "No existing container found with name: $CONTAINER_NAME"
fi

# Remove old images to save space (optional)
echo "Cleaning up old Docker images..."
docker image prune -af || true

echo "Application Stop phase completed successfully"
