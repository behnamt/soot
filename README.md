# ĐSoot

## Prerequisites

(they will be checked during the `make setup` phase)

- [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  - Node 14(`nvm install 14`)
- [Yarn](https://yarnpkg.com/)
  - `nvm use 14 && npm install -g yarn` (optional and soon to be deprecated)
- create your own BIP-39 Mnmonic [like this](https://iancoleman.io/bip39) and store it in .env and contracts/.env.local 
- create an account on infura.io and create a project. Store the infura_key in contract/.env.local

## `make setup` to launch

## docker services

- `make start` aliases `docker-compose up -d` starts an ipfs daemon, local blockchain (ganache) and a signaling service using webrtc.

- Use `make logs` or `docker-compose logs -f` to see logs.

- Use `docker-compose logs ganache` to see blockchain logs and see the default accounts' private keys

## start the frontend

- `cd packages/app`
- `yarn start`

Look through the frontend [README](app/README.md)

#### TODO
1. [] move all fetch apis to constants
1. [x] ~~use react-async to call api and remove async useEffects~~ :(
1. [x] ~~implement token-based incidents~~
1. [x] ~~implement contract-tests for tocken-bases~~
1. [] refactor messenger component to use orbitDB
1. [] investigate on how to validate participants in a chat room using blockchain status
1. [x] ~~fix encryption of an incident with client's key~~ >> works on chrome but not on brave
1. [] post an incident with a custom location on map
1. [] update node to v.14
1. [x] ~~move core outside of src directory~~
1. [x] ~~encrypt harasser's name to stop mobing~~
1. [x] ~~use lerna and make monorepo~~
1. [] use `notistack` to show toast messages
1. [] remove duplicated data from sootRegistery.sol: location data, date, cid
1. [] use encryption to store harasser name in orbitDB
1. [] decrypt harasser's name in my reports using metamask's `eth_decrypt`
1. [] fix bug to show the same harasser message only once
1. [] implement wallet connect
1. [] remove local wallet and related forms, types and scripts 