#!/bin/bash
set -e

echo "Starting Before Install phase..."

# Update system packages
echo "Updating system packages..."
apt update -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    apt install docker -y
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user
else
    echo "Docker is already installed"
    systemctl start docker
fi

# Clean up old application directory if exists
if [ -d "/home/ec2-user/app" ]; then
    echo "Cleaning up old application directory..."
    rm -rf /home/ec2-user/app
fi

echo "Before Install phase completed successfully"
