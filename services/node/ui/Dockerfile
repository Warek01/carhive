FROM node:22-slim
WORKDIR /app

RUN npm i -g corepack && corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

ENV HOSTNAME 0.0.0.0
ENV PORT 3000

ENTRYPOINT ["pnpm", "build", "&&", "pnpm", "start"]

