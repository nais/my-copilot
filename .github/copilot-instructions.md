# Copilot Instructions for my-copilot

## Project Overview

Self-service tool for managing GitHub Copilot subscriptions at Nav. Next.js 15 app deployed on NAIS with Azure AD authentication via sidecar proxy.

## Architecture

- **Auth**: Azure AD JWT validation, mock user in dev mode (`src/lib/auth.ts`)
- **GitHub**: Octokit with App auth for Copilot API (`src/lib/github.ts`)
- **Data**: Aggregates daily metrics across time periods (`src/lib/data-utils.ts`)
- **Routes**: `/` (subscription), `/usage` (analytics), `/overview` (licenses)

## Coding Patterns

### Numbers - Norwegian Locale

```typescript
import { formatNumber } from "@/lib/format";
formatNumber(151354); // "151 354" (space separator)
```

### UI - NAV Design System

```typescript
import { Table, BodyShort, Heading, HGrid, Box, HelpText } from "@navikt/ds-react";
```

### Spacing - Mobile-First Design

Always use NAV DS spacing tokens, never Tailwind padding/margin utilities.

**Page containers:**

```typescript
// ✅ Correct - responsive padding with NAV DS
<main className="max-w-7xl mx-auto">
  <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
    {children}
  </Box>
</main>

// ❌ Wrong - Tailwind utilities
<main className="p-4 mx-4">
<main className="p-2 sm:p-6 mx-1 sm:mx-4">
```

**Section spacing:**

```typescript
// ✅ Correct - VStack with gap
<VStack gap="space-24">
  <section>...</section>
  <section>...</section>
</VStack>

// ❌ Wrong - Tailwind classes
<section className="mb-8">
<div className="space-y-6">
```

**Component spacing:**

```typescript
// ✅ Correct - Box with responsive padding
<Box
  background="surface-subtle"
  padding={{ xs: "space-16", md: "space-24" }}
  borderRadius="large"
>

// HGrid with responsive gap
<HGrid columns={{ xs: 1, md: 2, lg: 4 }} gap={{ xs: "space-16", md: "space-24" }}>

// ❌ Wrong - numeric tokens without space- prefix or Tailwind
<Box padding="4">
<HGrid gap="6">
```

**Header spacing:**

```typescript
// ✅ Correct - VStack for vertical spacing
<VStack gap="space-8">
  <Heading size="xlarge" level="1">Title</Heading>
  <BodyShort className="text-gray-600">Description</BodyShort>
</VStack>

// ❌ Wrong - Tailwind margin
<Heading className="mb-2">Title</Heading>
<BodyShort className="mb-4">Description</BodyShort>
```

**Responsive breakpoints:**

- `xs`: 0px (mobile)
- `sm`: 480px (large mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

**Common spacing tokens:**

- `space-8` (0.5rem / 8px) - tight spacing
- `space-16` (1rem / 16px) - default spacing
- `space-24` (1.5rem / 24px) - section spacing
- `space-32` (2rem / 32px) - large section spacing
- `space-40` (2.5rem / 40px) - page padding

### API Routes

```typescript
export async function GET() {
  const { usage, error } = await getCopilotUsage("navikt");
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(usage);
}
```

### Auth Check

```typescript
const user = await getUser(); // redirects if not auth
const user = await getUser(false); // returns null if not auth
```

### Error Handling

```typescript
const { copilot, error } = await getCopilotSeat("navikt", username);
if (error) {
  /* handle */
}
```

### Data Aggregation

```typescript
const aggregated = getAggregatedMetrics(usage); // period totals
const latest = getLatestUsage(usage); // current values only
```

## Copilot Behavior

**Do:**

- Show code, not explanations
- Be direct and concise
- Write optimized, well-integrated code
- Follow existing patterns in the codebase
- Use TypeScript strictly
- Run `pnpm check` after making code changes
- Verify changes in browser at http://localhost:3000 (assume dev server is running)

**Don't:**

- Add code comments unless explicitly asked
- Create documentation files unless explicitly asked
- Use verbose or overly polite language
- Add unnecessary explanations
- Create summaries after coding sessions

**Examples over explanations** - When asked to implement something, provide the code implementation directly rather than describing how to do it.
