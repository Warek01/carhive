FROM node:22-alpine AS builder
WORKDIR /app

RUN apk update
RUN apk upgrade
RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . .
RUN pnpm build

FROM node:22-alpine AS production
WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add curl
RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i --prod
COPY --from=builder /app/dist/ dist/

ENTRYPOINT ["pnpm", "start:prod"]
