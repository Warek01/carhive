FROM node:22-alpine AS builder
WORKDIR /app

RUN apk update
RUN apk upgrade --no-cache
RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
RUN pnpm i
COPY . .
RUN pnpm build

FROM node:22-alpine AS production

WORKDIR /app

RUN apk update
RUN apk upgrade --no-cache
RUN apk add curl
RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
RUN pnpm i --prod
COPY --from=builder /app/dist/ dist/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=2s --start-period=10s --retries=3  CMD curl --fail http://localhost:3000/api/v1/health || exit

ENTRYPOINT ["pnpm", "start:prod"]
