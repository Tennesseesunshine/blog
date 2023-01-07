#!/bin/bash

NODE_VERSION="$(node -v)"

MAIN_VERSION=${NODE_VERSION: 1: 2}

echo "[DEV.SH LOG] => nodejs version  [$NODE_VERSION]"

if [[ $MAIN_VERSION = "18" ]]; then

    export NODE_OPTIONS=--openssl-legacy-provider

    echo "USE NODE_OPTIONS"

fi

npm run docs:dev