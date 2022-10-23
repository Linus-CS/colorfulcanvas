#!/bin/bash
config_file="dev-docker-compose.yml"

if [ "$1" == "-r" ]; then
    config_file="docker-compose.yml" 
fi

if [ -d "./mongo-volume" ]; then
    sudo rm -r "./mongo-volume"
fi 

sudo docker system prune -af --volumes
sudo docker network create my_network
sudo docker-compose -f $config_file up