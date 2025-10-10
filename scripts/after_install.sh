#!/bin/bash
set -e

echo "Starting After Install phase..."

# Navigate to application directory
cd /home/ec2-user/app

# Pull the latest Docker image from Docker Hub
echo "Pulling latest Docker image..."
docker pull abhijithdockerhub/codebuild:latest

echo "Docker image pulled successfully"
echo "After Install phase completed successfully"
# testing
