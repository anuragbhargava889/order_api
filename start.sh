#!/usr/bin/env bash

red=$'\e[1;31m'
grn=$'\e[1;32m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
white=$'\e[0m'

set -e

echo Starting services
sudo chmod 777 -R data
sleep 5
sudo docker-compose up -d

echo " $grn -------Installing Dependencies -----------$blu "
sudo sleep 200s #this line is included for composer to finish the dependency installation so that test case can execute without error.

echo Starting test inside container
sudo docker-compose exec order_api_app npm test
