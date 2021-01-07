#!/usr/bin/env bash

source ~/.nvm/nvm.sh && nvm use
cd contracts && npm install && cd ..
cd app && yarn install && cd ..
exit 0
