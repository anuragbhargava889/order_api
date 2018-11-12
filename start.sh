#!/usr/bin/env bash

set -eu

echo Starting services
docker-compose up -d
docker-compose exec app npm test
