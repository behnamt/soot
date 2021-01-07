#!/usr/bin/env bash
cd cli
echo "test" | node dist/src wallet:create --privateKey 0x22aabb811efca4e6f4748bd18a46b502fa85549df9fa07da649c0a148d7d5530
cd ..
