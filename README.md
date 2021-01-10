# ĐSoot

## Prerequisites

(they will be checked during the `make setup` phase)

- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  - Node 12(`nvm install 12`)
- [Yarn](https://yarnpkg.com/)
  - `nvm use 12 && npm install -g yarn` (optional and soon to be deprecated)
- create your own BIP-39 Mnmonic [like this](https://iancoleman.io/bip39) and store it in .env and contracts/.env.local 
- create an account on infura.io and create a project. Store the infura_key in contract/.env.local

## `make setup` to launch

## docker services

- `make start` aliases `docker-compose up -d` starts an ipfs daemon, local blockchain (ganache) and a signaling service using webrtc.

- Use `make logs` or `docker-compose logs -f` to see logs.

- Use `docker-compose logs ganache` to see blockchain logs and see the default accounts' private keys

## start the frontend

- `cd app`
- `yarn start`

Look through the frontend [README](app/README.md)

#### TODO
1. move all fetch apis to constants
1. use react-async to call api and remove async useEffects :(