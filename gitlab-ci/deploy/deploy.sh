#!/bin/bash
sudo docker-compose down
sudo docker login registry.gitlab.com -u gitlab+deploy-token-30320 -p eTR9PXMSs-41YrxgixZz
sudo docker pull registry.gitlab.com/thinker-ljn/ti:latest
sudo docker-compose build node
sudo docker-compose run node npm run tool migrate
sudo docker-compose down
sudo docker-compose up -d
sudo docker logout registry.gitlab.com
