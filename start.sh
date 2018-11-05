#!/usr/bin/env bash

set -eu

# Installing Docker CE
if [ ! -f /usr/bin/docker ]; then
    echo 'Installing Docker CE'
    # Install Docker CE from the Debian-based distributions repository
    sudo apt update
    sudo apt --no-install-recommends install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    apt-cache policy docker-ce
    sudo apt-get install -y docker-ce
    sudo usermod --append --groups docker "$USER"
    sudo systemctl status docker
    sudo systemctl enable docker
    sudo service docker restart
    printf '\nDocker installed successfully\n\n'
else
    echo "Docker CE already installed.  Skipping..."
fi

# Installing Docker Compose
if [ ! -f /usr/local/bin/docker-compose ]; then
    echo 'Installing Docker Compose'
    sudo curl -L "https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed.  Skipping..."
fi

echo Starting services
docker-compose up -d
