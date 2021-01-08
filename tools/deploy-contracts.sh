#!/usr/bin/env bash
cd contracts
npx oz remove SootRegistry
npx oz compile
npx oz add SootRegistry && npx oz push -n development
contract_address=`npx oz deploy --no-interactive --network development --kind upgradeable SootRegistry`
npx oz send-tx -n development --method initialize --to "$contract_address"

sed -e "s/^\(REACT_APP_SOOT_REGISTRY_CONTRACT_ADDRESS=\s*\).*\$/\1$contract_address/" ../app/.env.local > ../app/.env.tmp
mv ../app/.env.tmp ../app/.env.local


