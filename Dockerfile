FROM oven/bun:1 AS base

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock prisma/schema.prisma ./prisma/
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ENV SKIP_ENV_VALIDATION=1
RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "dev"]
