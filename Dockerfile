FROM node:24 AS base

RUN corepack enable

FROM base AS deps
WORKDIR /app

ARG READER_TOKEN

RUN pnpm config set registry https://registry.npmjs.org/
RUN pnpm config set @navikt:registry https://npm.pkg.github.com
RUN if [ -n "$READER_TOKEN" ]; then \
        pnpm config set //npm.pkg.github.com/:_authToken=$READER_TOKEN; \
    else \
        echo "Warning: READER_TOKEN not provided, skipping pnpm authentication for @navikt packages"; \
    fi

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

FROM gcr.io/distroless/nodejs24:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["server.js"]