FROM node:22-slim AS base
WORKDIR /app
RUN npm i -g corepack
RUN corepack enable
COPY package.json pnpm-lock.yaml ./

FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM base AS production
RUN apt-get -y update && apt-get -y install curl

RUN apt-get install -y wget gnupg \
   && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
   && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
   && apt-get update \
   && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
   --no-install-recommends \
   && rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist/ dist/

ENV PUPPETEER_SKIP_DOWNLOAD true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENTRYPOINT ["pnpm", "start:prod"]

