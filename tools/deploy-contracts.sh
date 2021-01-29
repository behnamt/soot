#!/usr/bin/env bash
cd packages/contracts
npx oz remove SootToken
npx oz remove SootRegistry
npx oz compile
npx oz add SootRegistry SootToken && npx oz push -n development
soot_token_contract_address=`npx oz deploy --no-interactive --network development --kind regular SootToken`
registry_contract_address=`npx oz deploy --no-interactive --network development --kind regular SootRegistry $soot_token_contract_address`

sed -e "s/^\(REACT_APP_SOOT_REGISTRY_CONTRACT_ADDRESS=\s*\).*\$/\1$registry_contract_address/" ../app/.env.local > ../app/.env.tmp
mv ../app/.env.tmp ../app/.env.local


