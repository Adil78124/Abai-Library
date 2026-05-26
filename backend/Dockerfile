# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 --fetch-timeout=600000

FROM deps AS builder
WORKDIR /app
COPY . .
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/abai_library
RUN npm run prisma:generate
RUN npm run build

FROM deps AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm prune --omit=dev --no-audit
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
