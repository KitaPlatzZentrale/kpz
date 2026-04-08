ARG TARGETARCH=linux/amd64
###################
### Build Stage ###
###################
FROM --platform=${TARGETARCH} node:18-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx tsc -p ./
########################
### Production Stage ###
########################
FROM --platform=${TARGETARCH} node:18-slim AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist/ ./dist/

RUN npm ci --only=production

EXPOSE 8080

CMD [ "node", "dist/index.js" ]