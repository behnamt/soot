#!/usr/bin/env bash
cd contracts

infura_key=`cat .env.local | grep INFURA_KEY= | cut -d '=' -f2`
mnemonic=`cat .env.local | grep MNEMONIC= | cut -d '=' -f2`
bing_api_key=`cat ../app/.env.local | grep REACT_APP_BING_API_KEY= | cut -d '=' -f2`

sed -e "s/^\(INFURA_KEY=\s*\).*\$/\1$infura_key/" .env.production > .env.tmp
mv .env.tmp .env.production
sed -e "s/^\(MNEMONIC=\s*\).*\$/\1$mnemonic/" .env.production > .env.tmp
mv .env.tmp .env.production

sed -e "s/^\(REACT_APP_BING_API_KEY=\s*\).*\$/\1$bing_api_key/" ../app/.env.production > ../app/.env.tmp
mv ../app/.env.tmp ../app/.env.production

sed -e "s/^\(REACT_APP_ETHEREUM_NODE=\s*\).*\$/\1wss\:\/\/goerli\.infura\.io\/ws\/v3\/$infura_key/" ../app/.env.production > ../app/.env.tmp
mv ../app/.env.tmp ../app/.env.production


npx oz compile
contract_address=`NODE_ENV=production npx oz deploy --no-interactive --kind upgradable --network goerli SootRegistry`
npx oz send-tx -n development --method initialize --to "$contract_address"

sed -e "s/^\(REACT_APP_SOOT_REGISTRY_CONTRACT_ADDRESS=\s*\).*\$/\1$contract_address/" ../app/.env.production > ../app/.env.tmp
mv ../app/.env.tmp ../app/.env.production

cd ../app
yarn deploy

git restore .env.production
git restore ../contracts/.env.production