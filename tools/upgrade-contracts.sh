#!/usr/bin/env bash
cd contracts
npx oz compile
npx oz upgrade -n development --all


