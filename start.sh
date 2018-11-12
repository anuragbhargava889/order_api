#!/usr/bin/env bash

set -e

echo Starting services
sudo chmod 777 -R data
sleep 5
docker-compose up -d
sleep 5
echo Starting test inside container
docker-compose exec app npm test
