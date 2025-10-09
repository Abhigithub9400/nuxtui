#!/bin/bash
set -e

echo "Starting Application Start phase..."

CONTAINER_NAME="codebuild-app"
IMAGE_NAME="abhijithdockerhub/codebuild:latest"

# Run the Docker container
# Adjust port mapping based on your application (example uses port 80:80)
echo "Starting Docker container: $CONTAINER_NAME"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 80:80 \
    $IMAGE_NAME

# Wait for container to be healthy
echo "Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container $CONTAINER_NAME is running successfully"
    docker ps | grep $CONTAINER_NAME
else
    echo "ERROR: Container failed to start"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo "Application Start phase completed successfully"
