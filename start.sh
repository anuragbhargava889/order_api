#!/usr/bin/env bash

# Installing Docker CE
if [ ! -f /usr/bin/docker ]; then
    echo 'Installing Docker CE'
    # Install Docker CE from the Debian-based distributions repository
    sudo apt update
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    apt-cache policy docker-ce
    sudo apt-get install -y docker-ce
    sudo usermod -aG docker ${USER}

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
