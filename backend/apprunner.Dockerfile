FROM --platform=linux/amd64 node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npx tsc -p .

EXPOSE 8080

CMD [ "node", "dist/index.js" ]