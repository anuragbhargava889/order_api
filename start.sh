#!/usr/bin/env bash

set -e

echo Starting services
sudo chmod 777 -R data
sleep 5
sudo docker-compose up -d
sleep 5
echo Starting test inside container
sudo docker-compose exec order_api_app npm test
