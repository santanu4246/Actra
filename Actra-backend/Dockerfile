# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM oven/bun:1.2.18-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM oven/bun:1.2.18-alpine

WORKDIR /app

# copy deps from stage 1 (skips reinstall on rebuild if deps haven't changed)
COPY --from=deps /app/node_modules ./node_modules

# copy source
COPY . .

EXPOSE 3000

# run migrations then start the server
CMD ["sh", "-c", "bunx prisma migrate deploy && bunx prisma generate"]
