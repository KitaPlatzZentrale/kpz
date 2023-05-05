FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
RUN npm install -g nodemon

COPY . .

RUN npm run build