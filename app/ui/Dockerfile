FROM node:22-slim
WORKDIR /app

RUN npm i -g -f corepack && corepack enable && \
   apt-get -y update && \
   apt-get -y install curl procps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

ENV HOSTNAME 0.0.0.0
ENV PORT 3000

ENTRYPOINT ["pnpm", "dev"]

