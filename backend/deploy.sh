#!/bin/bash
git pull
npm install
npm run build
pm2 reload ecosystem.config.js --env production
# EOF