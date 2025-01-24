FROM node:22-slim AS builder
WORKDIR /app

RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-slim AS production
WORKDIR /app

RUN npm upgrade -g
RUN npm i -g -f pnpm

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm i --prod --frozen-lockfile
COPY --from=builder /app/.next/ .next/

ENTRYPOINT ["pnpm", "start"]

