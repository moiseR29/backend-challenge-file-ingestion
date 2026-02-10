#!/bin/bash

set -e

check_exists_docker() {
  echo "Checking if you have docker installed..."
  if [ -z "$(which docker 2>/dev/null)" ]; then
    echo "do you need have a docker installed"
    exit 1
  fi
}

up_compose() {
  echo "creating compose"
  docker compose up -d
}

down_compose() {
  echo "removing compose"
  docker compose down 
}

clean_compose() {
  echo "removing compose"
  docker compose down --rmi all -v
}

echo "Challenge"
printf "\n1. Up\n2. Down\n3. Clean\n"

read -p "Option, Please input the number: " OPT_N

check_exists_docker

if [ "$OPT_N" = "1" ]; then
  up_compose
  exit 0;
elif [ "$OPT_N" = "2" ]; then
  down_compose
  exit 0;
elif [ "$OPT_N" = "3" ]; then
  clean_compose
  exit 0;
else
    echo "Invalid Option"
    exit 1;
fi

