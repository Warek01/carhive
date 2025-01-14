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

RUN apt-get update \
   && apt-get install -y wget gnupg \
   && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
   && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
   && apt-get update \
   && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
   --no-install-recommends \
   && rm -rf /var/lib/apt/lists/*

RUN apt-get -y update && apt-get -y install curl

COPY package.json .
COPY pnpm-lock.yaml .

ENV PUPPETEER_SKIP_DOWNLOAD true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN pnpm i --prod --frozen-lockfile
COPY --from=builder /app/dist/ dist/

ENTRYPOINT ["pnpm", "start:prod"]
