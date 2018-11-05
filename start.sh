#!/usr/bin/env bash

# Installing Docker CE
if [ ! -f /usr/bin/docker ]; then
    echo 'Installing Docker CE'
    # Install Docker CE from the Debian-based distributions repository
    sudo apt-get install -y docker-ce

else
    echo "Docker CE already installed.  Skipping..."
fi

# Installing Docker Compose
if [ ! -f /usr/bin/docker-compose ]; then
    echo 'Installing Docker Compose'
    # Install Docker Compose from the Debian-based distributions repository
    sudo apt-get install -y docker-compose

else
    echo "Docker Compose already installed.  Skipping..."
fi

echo Starting services
docker-compose up -d
