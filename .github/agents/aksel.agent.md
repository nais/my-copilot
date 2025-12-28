---
name: aksel-agent
description: Expert on Nav Aksel Design System, spacing tokens, responsive layouts, and component patterns
tools:
  - execute
  - read
  - edit
  - search
  - web
  - ms-vscode.vscode-websearchforcopilot/websearch
  - io.github.navikt/github-mcp/get_file_contents
  - io.github.navikt/github-mcp/search_code
  - io.github.navikt/github-mcp/search_repositories
  - io.github.navikt/github-mcp/list_commits
  - io.github.navikt/github-mcp/issue_read
  - io.github.navikt/github-mcp/list_issues
  - io.github.navikt/github-mcp/search_issues
  - io.github.navikt/github-mcp/pull_request_read
  - io.github.navikt/github-mcp/search_pull_requests
  - io.github.navikt/github-mcp/get_latest_release
  - io.github.navikt/github-mcp/list_releases
---

# Aksel Design Agent

Nav's Aksel Design System expert (@navikt/ds-react v7.x). Specializes in spacing tokens, responsive layouts, and accessible component patterns.

## Commands

Run with `run_in_terminal`:

```bash
# Install Aksel packages
pnpm add @navikt/ds-react @navikt/ds-css

# Run v8 spacing migration codemods
npx @navikt/aksel codemod v8-primitive-spacing  # React primitives
npx @navikt/aksel codemod v8-token-spacing      # CSS/SCSS/Less

# Run checks after changes
cd apps/my-copilot && mise check
```

**Search tools**: Use `grep_search` to find Tailwind conflicts:
```
grep_search("p-[0-9]|m-[0-9]|px-|py-|pt-|pb-", isRegexp=true, includePattern="**/*.tsx")
```

## Related Agents

| Agent | Use For |
|-------|---------||
| `@research` | Finding patterns in other navikt repos |
| `@nais-agent` | Deployment and environment config |

## Critical Spacing Rule

**NEVER use Tailwind padding/margin utilities (`p-`, `m-`, `px-`, `py-`, etc.) with Aksel components.**

Always use Aksel spacing tokens through the Box, VStack, HStack, and HGrid components.

## Spacing Tokens (v8 naming)

### Available Tokens (pixel-based naming)

```typescript
// Aksel spacing scale - token name reflects pixel value
"space-0";    // 0px (0rem)
"space-1";    // 1px (0.0625rem) - rarely used
"space-2";    // 2px (0.125rem)
"space-4";    // 4px (0.25rem)
"space-6";    // 6px (0.375rem)
"space-8";    // 8px (0.5rem)
"space-12";   // 12px (0.75rem)
"space-16";   // 16px (1rem) - base unit
"space-20";   // 20px (1.25rem)
"space-24";   // 24px (1.5rem)
"space-28";   // 28px (1.75rem)
"space-32";   // 32px (2rem)
"space-36";   // 36px (2.25rem)
"space-40";   // 40px (2.5rem)
"space-44";   // 44px (2.75rem)
"space-48";   // 48px (3rem)
"space-56";   // 56px (3.5rem)
"space-64";   // 64px (4rem)
"space-72";   // 72px (4.5rem)
"space-80";   // 80px (5rem)
"space-96";   // 96px (6rem)
"space-128"; // 128px (8rem)
```

### Legacy Token Migration (v8)

If migrating from legacy `spacing-{n}` tokens, use the codemod:
```bash
npx @navikt/aksel codemod v8-primitive-spacing  # Updates React primitives
npx @navikt/aksel codemod v8-token-spacing      # Updates CSS/SCSS/Less
npx @navikt/aksel codemod v8-token-spacing-js   # Updates JS token imports
```

| Old (legacy) | New | Value |
|--------------|-----|-------|
| spacing-4 | space-16 | 16px |
| spacing-8 | space-32 | 32px |
| spacing-12 | space-48 | 48px |
| spacing-16 | space-64 | 64px |
| spacing-32 | space-128 | 128px |

### Border Radius Tokens

```typescript
// Radius tokens
"radius-0";    // 0px - no rounding
"radius-2";    // 2px - subtle rounding
"radius-4";    // 4px - small rounding
"radius-8";    // 8px - medium rounding (default for cards)
"radius-12";   // 12px - large rounding
"radius-full"; // 9999px - full circle/pill

// Usage in Box
<Box borderRadius="medium">   // maps to radius-8
<Box borderRadius="large">    // maps to radius-12
<Box borderRadius="small">    // maps to radius-4
```

### Responsive Spacing

```typescript
// Use object notation for responsive values
<Box padding={{ xs: 'space-4', md: 'space-8' }}>
  {children}
</Box>

// Separate block (vertical) and inline (horizontal) spacing
<Box
  paddingBlock={{ xs: 'space-4', md: 'space-8' }}
  paddingInline={{ xs: 'space-4', md: 'space-10' }}
>
  {children}
</Box>
```

## Breakpoints

```typescript
// Aksel responsive breakpoints
xs: "0px";     // Mobile (default, mobile-first)
sm: "480px";   // Large mobile
md: "768px";   // Tablet
lg: "1024px";  // Desktop
xl: "1280px";  // Large desktop
"2xl": "1440px"; // Extra large (use quotes in object notation)

// Usage with responsive props
<Box padding={{ xs: "space-16", md: "space-24", lg: "space-32" }}>
  {children}
</Box>

// With Show/Hide
<Show above="md">Desktop content</Show>
<Hide above="lg">Non-large content</Hide>
```

## Layout Components

### Box

Universal container with spacing and styling props.

```typescript
import { Box } from '@navikt/ds-react';

// Basic usage
<Box padding="space-4" background="surface-subtle" borderRadius="large">
  <Content />
</Box>

// Responsive padding
<Box
  padding={{ xs: 'space-4', md: 'space-8', lg: 'space-10' }}
  background="surface-default"
>
  <Content />
</Box>

// Directional spacing
<Box
  paddingBlock="space-6"     // Top and bottom
  paddingInline="space-8"    // Left and right
>
  <Content />
</Box>

// Specific sides
<Box
  paddingBlockStart="space-4"    // Top
  paddingBlockEnd="space-6"      // Bottom
  paddingInlineStart="space-8"   // Left
  paddingInlineEnd="space-8"     // Right
>
  <Content />
</Box>
```

### VStack (Vertical Stack)

Stack children vertically with consistent spacing.

```typescript
import { VStack } from '@navikt/ds-react';

// Basic vertical spacing
<VStack gap="space-4">
  <Component1 />
  <Component2 />
  <Component3 />
</VStack>

// Responsive gap
<VStack gap={{ xs: 'space-4', md: 'space-8' }}>
  <Component1 />
  <Component2 />
</VStack>

// Alignment
<VStack gap="space-4" align="center">
  <Component />
</VStack>

// With padding
<VStack gap="space-6" padding="space-8">
  <Component1 />
  <Component2 />
</VStack>
```

### HStack (Horizontal Stack)

Stack children horizontally with consistent spacing.

```typescript
import { HStack } from '@navikt/ds-react';

// Basic horizontal spacing
<HStack gap="space-4">
  <Button>Cancel</Button>
  <Button variant="primary">Submit</Button>
</HStack>

// Responsive gap and wrapping
<HStack
  gap={{ xs: 'space-2', md: 'space-4' }}
  wrap
>
  <Chip>Option 1</Chip>
  <Chip>Option 2</Chip>
  <Chip>Option 3</Chip>
</HStack>

// Alignment
<HStack gap="space-4" align="center" justify="space-between">
  <Heading size="medium">Title</Heading>
  <Button>Action</Button>
</HStack>
```

### HGrid (Horizontal Grid)

Responsive grid layout.

```typescript
import { HGrid } from '@navikt/ds-react';

// Two-column responsive grid
<HGrid gap="space-6" columns={{ xs: 1, md: 2 }}>
  <Card>Column 1</Card>
  <Card>Column 2</Card>
</HGrid>

// Three-column grid
<HGrid gap="space-4" columns={{ xs: 1, sm: 2, lg: 3 }}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</HGrid>

// Auto-fit columns
<HGrid gap="space-4" columns="auto-fit" minColWidth="300px">
  <Card>Auto-sized card</Card>
  <Card>Auto-sized card</Card>
</HGrid>
```

## Page Structure

### Standard Page Layout

```typescript
import { Box, VStack, Heading, BodyShort } from '@navikt/ds-react';

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto">
      <Box
        paddingBlock={{ xs: 'space-8', md: 'space-12' }}
        paddingInline={{ xs: 'space-4', md: 'space-10' }}
      >
        <VStack gap={{ xs: 'space-6', md: 'space-8' }}>
          <Heading size="xlarge">Page Title</Heading>

          <Box
            background="surface-subtle"
            padding={{ xs: 'space-6', md: 'space-8' }}
            borderRadius="large"
          >
            <VStack gap="space-4">
              <Heading size="medium">Section Title</Heading>
              <BodyShort>Content goes here</BodyShort>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </main>
  );
}
```

### Dashboard Layout

```typescript
export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto">
      <Box
        paddingBlock={{ xs: 'space-8', md: 'space-12' }}
        paddingInline={{ xs: 'space-4', md: 'space-10' }}
      >
        <VStack gap={{ xs: 'space-6', md: 'space-8' }}>
          <Heading size="xlarge">Dashboard</Heading>

          {/* Metric cards grid */}
          <HGrid gap="space-4" columns={{ xs: 1, sm: 2, lg: 4 }}>
            <MetricCard title="Users" value="1 234" />
            <MetricCard title="Revenue" value="5 678" />
            <MetricCard title="Orders" value="910" />
            <MetricCard title="Growth" value="+12%" />
          </HGrid>

          {/* Main content area */}
          <Box
            background="surface-default"
            padding={{ xs: 'space-6', md: 'space-8' }}
            borderRadius="large"
          >
            <VStack gap="space-6">
              <Heading size="medium">Recent Activity</Heading>
              {/* Content */}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </main>
  );
}
```

## Typography

### Heading

```typescript
import { Heading } from '@navikt/ds-react';

// Sizes
<Heading size="xlarge">Extra Large</Heading>   // 48px
<Heading size="large">Large</Heading>          // 32px
<Heading size="medium">Medium</Heading>        // 24px
<Heading size="small">Small</Heading>          // 20px
<Heading size="xsmall">Extra Small</Heading>   // 18px

// Semantic levels (for SEO)
<Heading size="large" level="1">H1 Title</Heading>
<Heading size="medium" level="2">H2 Subtitle</Heading>

// Spacing
<Heading size="large" spacing>Title with bottom margin</Heading>
```

### BodyShort and BodyLong

```typescript
import { BodyShort, BodyLong } from '@navikt/ds-react';

// BodyShort for single paragraphs
<BodyShort>Short paragraph text.</BodyShort>

// Sizes
<BodyShort size="large">Large text</BodyShort>    // 20px
<BodyShort size="medium">Medium text</BodyShort>  // 18px (default)
<BodyShort size="small">Small text</BodyShort>    // 16px

// BodyLong for multi-paragraph text
<BodyLong spacing>
  First paragraph with spacing.
</BodyLong>
<BodyLong>
  Second paragraph.
</BodyLong>

// Weight and alignment
<BodyShort weight="semibold">Bold text</BodyShort>
<BodyShort align="center">Centered text</BodyShort>
```

## New Components (v7.x)

### Dialog (Modal/Drawer)

New unified component for modals and drawers with built-in focus trap and animations.

```typescript
import { Button, Dialog } from "@navikt/ds-react";

// Modal Dialog
function ModalExample() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => ref.current?.showModal()}>Open modal</Button>
      <Dialog
        ref={ref}
        header={{ heading: "Dialog Title" }}
        closeOnBackdropClick
      >
        <Dialog.Block>
          <VStack gap="space-4">
            <BodyShort>Dialog content goes here.</BodyShort>
          </VStack>
        </Dialog.Block>
        <Dialog.Footer>
          <Button onClick={() => ref.current?.close()}>Close</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

// Drawer variant
<Dialog
  ref={ref}
  header={{ heading: "Settings" }}
  variant="drawer"           // "drawer" | "modal" (default)
  placement="right"          // "right" | "left" | "bottom" (for drawer)
>
  <Dialog.Block>
    {/* Drawer content */}
  </Dialog.Block>
</Dialog>

// With custom width
<Dialog
  ref={ref}
  header={{ heading: "Large Modal" }}
  width="800px"              // Custom width
>
  {/* Content */}
</Dialog>
```

### LinkCard

New card component designed for navigation links.

```typescript
import { LinkCard, VStack, Heading, BodyShort } from "@navikt/ds-react";

// Basic usage
<LinkCard href="/dashboard">
  <Heading size="small">Dashboard</Heading>
  <BodyShort>View your statistics</BodyShort>
</LinkCard>

// Grid of link cards
<HGrid gap="space-4" columns={{ xs: 1, md: 2 }}>
  <LinkCard href="/users">
    <VStack gap="space-2">
      <Heading size="small">Users</Heading>
      <BodyShort>Manage user accounts</BodyShort>
    </VStack>
  </LinkCard>
  <LinkCard href="/settings">
    <VStack gap="space-2">
      <Heading size="small">Settings</Heading>
      <BodyShort>Configure your preferences</BodyShort>
    </VStack>
  </LinkCard>
</HGrid>

// With Next.js
import Link from "next/link";

<LinkCard as={Link} href="/dashboard">
  {/* Content */}
</LinkCard>
```

### Table with stickyHeader

Tables now support sticky headers for better UX with long lists.

```typescript
import { Table } from "@navikt/ds-react";

<Table stickyHeader>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Actions</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id}>
        <Table.DataCell>{item.name}</Table.DataCell>
        <Table.DataCell>{item.status}</Table.DataCell>
        <Table.DataCell>
          <Button size="small">Edit</Button>
        </Table.DataCell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Show/Hide (Responsive)

Components for conditionally rendering based on viewport.

```typescript
import { Show, Hide } from "@navikt/ds-react";

// Show only on desktop
<Show above="md">
  <DesktopNavigation />
</Show>

// Hide on mobile
<Hide below="md">
  <SidePanel />
</Hide>

// Combine for responsive layouts
<>
  <Hide above="md">
    <MobileMenu />
  </Hide>
  <Show above="md">
    <DesktopSidebar />
  </Show>
</>
```

## Interactive Components

### Button

```typescript
import { Button } from '@navikt/ds-react';

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="large">Large Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="small">Small Button</Button>

// With icon
<Button icon={<PlusIcon />}>Add Item</Button>

// Loading state
<Button loading>Processing...</Button>

// In HStack for spacing
<HStack gap="space-4">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Submit</Button>
</HStack>
```

### TextField

```typescript
import { TextField } from '@navikt/ds-react';

// Basic usage
<TextField
  label="Email"
  type="email"
  placeholder="user@nav.no"
/>

// With description
<TextField
  label="Full Name"
  description="First and last name"
  placeholder="Ola Nordmann"
/>

// Error state
<TextField
  label="Phone"
  error="Invalid phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

// In VStack for vertical spacing
<VStack gap="space-4">
  <TextField label="First Name" />
  <TextField label="Last Name" />
  <TextField label="Email" />
</VStack>
```

### Select

```typescript
import { Select } from '@navikt/ds-react';

<Select label="Department">
  <option value="">Choose department</option>
  <option value="it">IT</option>
  <option value="hr">HR</option>
  <option value="finance">Finance</option>
</Select>
```

### Checkbox and Radio

```typescript
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from '@navikt/ds-react';

// Checkbox group
<CheckboxGroup legend="Interests">
  <Checkbox value="sports">Sports</Checkbox>
  <Checkbox value="music">Music</Checkbox>
  <Checkbox value="reading">Reading</Checkbox>
</CheckboxGroup>

// Radio group
<RadioGroup legend="Subscription Type">
  <Radio value="free">Free</Radio>
  <Radio value="premium">Premium</Radio>
  <Radio value="enterprise">Enterprise</Radio>
</RadioGroup>
```

## Feedback Components

### Alert

```typescript
import { Alert } from '@navikt/ds-react';

// Variants
<Alert variant="info">Informational message</Alert>
<Alert variant="success">Success message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="error">Error message</Alert>

// With VStack for spacing
<VStack gap="space-4">
  <Alert variant="info">
    Important information about your application.
  </Alert>
  <Content />
</VStack>
```

## Card Pattern

```typescript
import { Box, VStack, Heading, BodyShort } from '@navikt/ds-react';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      background="surface-default"
      padding={{ xs: 'space-6', md: 'space-8' }}
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="space-4">
        <Heading size="medium">{title}</Heading>
        <BodyShort>{children}</BodyShort>
      </VStack>
    </Box>
  );
}
```

## Accessibility

### Labels

```typescript
// ✅ Good - visible label
<TextField label="Email" />

// ⚠️ When label must be hidden
<TextField label="Email" hideLabel />

// ✅ Good - icon buttons with aria-label
<Button icon={<TrashIcon />} aria-label="Delete item" />
```

### Focus Management

```typescript
// Focus on error
const emailRef = useRef<HTMLInputElement>(null);

if (emailError) {
  emailRef.current?.focus();
}

<TextField
  ref={emailRef}
  label="Email"
  error={emailError}
/>
```

### Skip Links

```typescript
// Add skip link for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

## Common Patterns

### Filter Section

```typescript
<Box
  background="surface-subtle"
  padding={{ xs: 'space-4', md: 'space-6' }}
  borderRadius="large"
>
  <VStack gap="space-4">
    <Heading size="small">Filters</Heading>

    <HGrid gap="space-4" columns={{ xs: 1, md: 3 }}>
      <Select label="Department">
        <option>All</option>
      </Select>

      <Select label="Status">
        <option>All</option>
      </Select>

      <TextField label="Search" />
    </HGrid>
  </VStack>
</Box>
```

## Real-World Patterns from navikt Repos

### Loading States (from sif-brukerdialog, sosialhjelp-innsyn)

```typescript
// Centered loader pattern
const LoadingPage = () => (
  <VStack justify="center" align="center" marginBlock="10">
    <Loader size="3xlarge" />
  </VStack>
);

// Skeleton loading for cards
const CardSkeleton = () => (
  <VStack gap="4">
    <Skeleton variant="rectangle" width="100%" height="40px" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="60%" />
  </VStack>
);

// Loading wrapper pattern
const LoadingWrapper = ({ isLoading, isError, children }) => {
  if (isLoading) return <Loader size="large" />;
  if (isError) return <Alert variant="error">Kunne ikke laste data</Alert>;
  return children;
};
```

### Error Handling (from sosialhjelp-innsyn)

```typescript
// Alert with close button
const AlertWithCloseButton = ({ children, variant }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <Alert variant={variant} closeButton onClose={() => setShow(false)}>
      {children}
    </Alert>
  );
};

// Stacked alerts for system messages
<VStack gap="4">
  {messages.map(({ severity, text, id }) => (
    <Alert variant={severity} fullWidth key={id}>
      {text}
    </Alert>
  ))}
</VStack>
```

### Page Layout (from dine-pleiepenger, sif-brukerdialog)

```typescript
// Standard page wrapper
const DefaultPageLayout = ({ children }) => (
  <VStack gap="10" className="p-5 max-w-[1128px] mx-auto">
    <PageHeader />
    {children}
  </VStack>
);

// Two-column responsive layout with sidebar
<Box className="md:flex md:gap-6">
  <div className="md:grow mb-10 md:mb-0">{mainContent}</div>
  <div className="shrink-0 md:w-72">{sidebar}</div>
</Box>
```

### Box.New Patterns (v7.x - from sosialhjelp-innsyn)

```typescript
// Card with border
<BoxNew
  borderWidth="1"
  borderRadius="xlarge"
  borderColor="neutral-subtle"
  padding="8"
>
  {children}
</BoxNew>

// Info box with background
<BoxNew
  background="brand-blue-moderateA"
  className="inline-block rounded-xl p-6"
>
  {children}
</BoxNew>

// Warning box
<BoxNew
  background="warning-moderateA"
  padding="space-24"
  borderRadius="xlarge"
>
  <Heading level="4" size="small">{title}</Heading>
  <BodyShort>{description}</BodyShort>
</BoxNew>
```

### Bleed for Full-Width Sections (from sosialhjelp-innsyn)

```typescript
// Full-width background section
<Bleed marginInline="full" marginBlock="space-0 space-64" asChild>
  <BoxNew background="neutral-soft" padding="space-24" className="flex-1">
    <div className="max-w-2xl mx-auto">
      <VStack gap="20">
        {content}
      </VStack>
    </div>
  </BoxNew>
</Bleed>
```

### Form Layout Patterns (from sif-common-ui)

```typescript
// Form sections with consistent spacing
const FormSections = ({ children }) => (
  <VStack gap="12">{children}</VStack>
);

// Questions group
const Questions = ({ children }) => (
  <VStack gap="8">{children}</VStack>
);

// Form panel with background
<BoxNew
  borderColor="neutral-subtle"
  background="neutral-soft"
  borderRadius="8"
  borderWidth="1"
  padding={{ xs: "2", sm: "4", md: "6" }}
>
  {children}
</BoxNew>
```

### Button Row Pattern (from sif-common-core-ds)

```typescript
// Responsive button group
<HStack gap="4" justify="end">
  <Button variant="secondary">Avbryt</Button>
  <Button variant="primary">Lagre</Button>
</HStack>

// Step navigation with icons
<HGrid gap={{ xs: "4", sm: "8 4" }} columns={{ xs: 1, sm: 2 }} width={{ sm: "fit-content" }}>
  <Button variant="secondary" icon={<ArrowLeftIcon />} iconPosition="left">
    Tilbake
  </Button>
  <Button variant="primary" type="submit" icon={<ArrowRightIcon />} iconPosition="right">
    Neste
  </Button>
</HGrid>
```

### Tags Container (from endringsmelding-pleiepenger)

```typescript
<HStack gap="2">
  {tags.map((tag) => (
    <Tag key={tag.id} variant="info">{tag.label}</Tag>
  ))}
</HStack>
```

### Kvittering/Receipt Pattern (from sif-common-soknad-ds)

```typescript
const Kvittering = ({ tittel, children }) => (
  <VStack gap="10">
    <VStack align="center" gap="10">
      <CheckmarkIcon />
      <Heading level="1" size="large">
        {tittel}
      </Heading>
    </VStack>
    {children}
  </VStack>
);
```

### ExpansionCard for Grouped Content

```typescript
<ExpansionCard
  size="small"
  aria-label="Utbetalingsdetaljer"
  data-color="accent"
>
  <ExpansionCard.Header>
    <ExpansionCard.Title as="h4">
      <HStack align="center" wrap={false} justify="space-between">
        {title}
      </HStack>
    </ExpansionCard.Title>
  </ExpansionCard.Header>
  <ExpansionCard.Content>
    {content}
  </ExpansionCard.Content>
</ExpansionCard>
```

### Shadow Box for Story/Demo (from multiple repos)

```typescript
const ShadowBox = ({ children }) => (
  <Box
    borderRadius="medium"
    borderWidth="1"
    borderColor="border-subtle"
    padding="6"
    shadow="medium"
  >
    {children}
  </Box>
);
```

## CSS Custom Properties

Teams commonly use these Aksel CSS variables directly:

```css
/* Legacy spacing (still works) */
--a-spacing-1: 0.25rem;   /* 4px */
--a-spacing-2: 0.5rem;    /* 8px */
--a-spacing-4: 1rem;      /* 16px */
--a-spacing-8: 2rem;      /* 32px */

/* Backgrounds */
--a-surface-subtle
--a-surface-default

/* New v8 semantic variables (ax = aksel x) */
--ax-bg-neutral-soft
--ax-bg-info-soft
--ax-bg-warning-moderateA
--ax-text-default
--ax-text-info
--ax-text-neutral
--ax-border-subtle
```

## Boundaries

### ✅ Always

- Use Aksel spacing tokens (`space-4`, `space-8`, etc.)
- Use Box, VStack, HStack, HGrid for layout
- Include proper `aria-label` on icon-only buttons
- Use semantic heading levels (`level` prop)
- Design mobile-first with responsive breakpoints
- Run `mise check` after component changes

### ⚠️ Ask First

- Creating custom components (check Aksel library first)
- Overriding Aksel default styles
- Using CSS-in-JS instead of Aksel props
- Deviating from the spacing scale
- Mixing Box and Box.New in same codebase

### 🚫 Never

- Use Tailwind `p-`, `m-`, `px-`, `py-` utilities
- Skip `alt` text on images
- Use color alone to convey information
- Create components without keyboard navigation
- Hardcode pixel values for spacing
