# Copilot Instructions for my-copilot

## Project Overview

Self-service tool for managing GitHub Copilot subscriptions at Nav. Next.js 15 app deployed on NAIS with Azure AD authentication via sidecar proxy.

---

# NAV Development Standards

These standards apply across NAV projects. Project-specific guidelines follow below.

## NAV Principles

- **Team First**: Autonomous teams with circles of autonomy, supported by Architecture Advice Process
- **Product Development**: Continuous development and product-organized reuse over ad hoc approaches
- **Essential Complexity**: Focus on essential complexity, avoid accidental complexity
- **DORA Metrics**: Measure and improve team performance using DevOps Research and Assessment metrics

## NAV Tech Stack

- **Backend**: Kotlin with Ktor, PostgreSQL, Apache Kafka
- **Frontend**: Next.js 15+, React, TypeScript, Aksel Design System
- **Platform**: NAIS (Kubernetes on Google Cloud Platform)
- **Auth**: Azure AD, TokenX, ID-porten, Maskinporten
- **Observability**: Prometheus, Grafana Loki, Tempo (OpenTelemetry)

## NAV Code Standards

### Kotlin/Ktor Patterns

- ApplicationBuilder pattern for bootstrapping
- Sealed classes for environment configuration (Dev/Prod/Local)
- Kotliquery with HikariCP for database access
- Rapids & Rivers pattern for Kafka event handling

### Next.js/Aksel Requirements

- **CRITICAL**: Always use Aksel spacing tokens, never Tailwind padding/margin
- Mobile-first with responsive props: `xs`, `sm`, `md`, `lg`, `xl`
- Norwegian number formatting with space separators

### NAIS Deployment

- Manifests in `.nais/` directory
- Required endpoints: `/isalive`, `/isready`, `/metrics`
- OpenTelemetry auto-instrumentation for observability

---

# my-copilot Project Specifics

## Commands

- **Check all**: `pnpm check` (runs ESLint, TypeScript, Prettier, Knip, Jest)
- **Test**: `pnpm test` (runs Jest with TypeScript)
- **Dev server**: `pnpm dev` (starts Next.js at http://localhost:3000)
- **Build**: `pnpm build` (production build)
- **Lint**: `pnpm lint` (ESLint only)

## Project Knowledge

**Tech Stack:**

- Next.js 16 with App Router
- TypeScript strict mode
- NAV Design System (@navikt/ds-react)
- Tailwind CSS v4.1
- Octokit for GitHub API
- Jest for testing

**File Structure:**

```
src/
├── app/              # Next.js 15 App Router pages
│   ├── api/         # API routes for Copilot data
│   ├── usage/       # Analytics dashboard
│   └── overview/    # License management
├── components/       # Reusable React components
└── lib/             # Utilities and business logic
    ├── auth.ts      # Authentication logic
    ├── github.ts    # GitHub API client
    └── data-utils.ts # Data aggregation
```

**Architecture:**

- **Auth**: Azure AD JWT validation, mock user in dev mode (`src/lib/auth.ts`)
- **GitHub**: Octokit with App auth for Copilot API (`src/lib/github.ts`)
- **Data**: Aggregates daily metrics across time periods (`src/lib/data-utils.ts`)
- **Routes**: `/` (subscription), `/usage` (analytics), `/overview` (licenses)

## Testing

- **Framework**: Jest with TypeScript
- **Location**: `*.test.ts` files next to source
- **Run**: `pnpm test`
- **Coverage**: Focus on `lib/` utilities
- **Before commits**: All tests must pass

## Code Style

### Spacing - Mobile-First Design

Always use NAV DS spacing tokens, never Tailwind padding/margin utilities.

**Page containers:**

```typescript
// ✅ Good - responsive padding with NAV DS
<main className="max-w-7xl mx-auto">
  <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
    {children}
  </Box>
</main>

// ❌ Bad - Tailwind utilities
<main className="p-4 mx-4">
```

**Component spacing:**

```typescript
// ✅ Good - Box with responsive padding
<Box
  background="surface-subtle"
  padding={{ xs: "space-16", md: "space-24" }}
  borderRadius="large"
>

// ❌ Bad - numeric tokens without space- prefix
<Box padding="4">
```

**Responsive breakpoints:**

- `xs`: 0px (mobile), `sm`: 480px, `md`: 768px, `lg`: 1024px, `xl`: 1280px

**Common spacing tokens:**

- `space-8` (8px), `space-16` (16px), `space-24` (24px), `space-32` (32px), `space-40` (40px)

### Norwegian Locale Numbers

```typescript
// ✅ Good
import { formatNumber } from "@/lib/format";
formatNumber(151354); // "151 354" (space separator)

// ❌ Bad
const formatted = num.toLocaleString(); // Uses browser locale
```

### API Routes

```typescript
// ✅ Good - explicit error handling
export async function GET() {
  const { usage, error } = await getCopilotUsage("navikt");
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(usage);
}

// ❌ Bad - no error handling
export async function GET() {
  const usage = await getCopilotUsage("navikt");
  return NextResponse.json(usage);
}
```

### Auth Check

```typescript
const user = await getUser(); // redirects if not auth
const user = await getUser(false); // returns null if not auth
```

## Boundaries

✅ **Always:**

- Use NAV DS spacing tokens (space-8, space-16, etc.)
- Run `pnpm check` after code changes
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Write tests for new utilities in `lib/`

⚠️ **Ask first:**

- Changing authentication logic
- Modifying GitHub API integration
- Altering data aggregation algorithms
- Changing routing structure

🚫 **Never:**

- Use Tailwind padding/margin utilities (use NAV DS Box/VStack/HGrid)
- Use numeric padding without `space-` prefix
- Commit secrets or API keys
- Skip type checking
- Modify production deployment config
- Add code comments unless explicitly asked
- Create documentation files unless explicitly asked
