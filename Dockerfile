FROM node:24 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Accept build arg for npm authentication
ARG READER_TOKEN

RUN npm set registry https://registry.npmjs.org/
RUN npm set @navikt:registry https://npm.pkg.github.com
RUN if [ -n "$READER_TOKEN" ]; then \
        npm config set //npm.pkg.github.com/:_authToken=$READER_TOKEN; \
    else \
        echo "Warning: READER_TOKEN not provided, skipping npm authentication for @navikt packages"; \
    fi

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

FROM gcr.io/distroless/nodejs24:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=nonroot:nonroot /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["server.js"]