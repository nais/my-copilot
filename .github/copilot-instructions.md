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
formatNumber(151354) // "151 354" (space separator)
```

### UI - NAV Design System
```typescript
import { Table, BodyShort, Heading, HGrid, Box, HelpText } from "@navikt/ds-react";
```

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
if (error) { /* handle */ }
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
