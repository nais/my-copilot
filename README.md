# Nav Copilot Customizations

This repository contains reusable GitHub Copilot customizations (agents, instructions, prompts, and skills) for building Nav applications following Nav's development standards and NAIS platform patterns.

## 📚 Overview

All customizations are located in the `.github` directory and can be installed using the VS Code tasks provided in this repository.

- **6 Agents** - Specialized AI assistants for specific domains
- **4 Instructions** - File-pattern-based code generation rules
- **3 Prompts** - Quick scaffolding templates
- **5 Skills** - Production patterns from Nav repositories

## 🚀 Quick Start

### Install All Customizations

Run the task: **"Install Nav Copilot Customizations"** from VS Code tasks menu (`Cmd+Shift+P` → "Tasks: Run Task")

Or install individually:

- **Install Copilot Instructions** - Main project instructions
- **Install All Agents** - All 6 specialized agents
- **Install All Instructions** - All 4 file-pattern rules
- **Install All Prompts** - All 3 scaffolding templates
- **Install All Skills** - All 5 production patterns

---

## 🤖 Agents

Specialized AI assistants you can invoke with `@agent-name` in Copilot Chat.

### @auth

Expert on Azure AD, TokenX, ID-porten authentication

Use for:

- Azure AD authentication for internal Nav users
- TokenX service-to-service token exchange
- ID-porten citizen authentication (BankID/MinID)
- JWT validation and role-based access control

### @aksel-design

Expert on Nav Aksel Design System

Use for:

- Converting Tailwind spacing to Aksel tokens
- Responsive layouts with Box, VStack, HStack, HGrid
- Mobile-first design (xs, sm, md, lg, xl breakpoints)
- Norwegian number formatting

### @security-champion

Expert on Nav security practices and NAIS security

Use for:

- Network policies and access controls
- Secrets management with Azure Key Vault
- GDPR compliance (data retention, audit logging)
- Security testing and vulnerability response

### @nais-platform

Expert on NAIS platform deployment

Use for:

- Creating `.nais/app.yaml` manifests
- Adding PostgreSQL, Kafka, observability
- Health endpoints configuration
- Troubleshooting pod startup issues

### @kafka-events

Expert on Rapids & Rivers event-driven architecture

Use for:

- Creating Kafka event consumers (Rivers)
- Designing event schemas (past tense, immutable)
- Publishing events with proper metadata
- Testing with TestRapid

### @observability

Expert on Prometheus, OpenTelemetry, Grafana

Use for:

- Health endpoints (`/isalive`, `/isready`, `/metrics`)
- Business metrics and alerting rules
- OpenTelemetry tracing
- DORA metrics tracking

---

## 📋 Instructions

File-pattern-based rules that Copilot applies automatically when creating or modifying files.

### Testing Instructions

**Applies to:** `**/*.test.{ts,tsx,kt,kts}`

Standards for Kotlin (Kotest) and TypeScript (Jest) tests with coverage requirements.

### Kotlin/Ktor Instructions

**Applies to:** `**/*.kt`

ApplicationBuilder patterns, sealed class config, Kotliquery database access, Rapids & Rivers.

### Next.js/Aksel Instructions

**Applies to:** `src/**/*.{tsx,ts}`

**CRITICAL**: Enforces Aksel spacing tokens instead of Tailwind padding/margin. Mobile-first responsive design.

### Database Instructions

**Applies to:** `**/db/migration/**/*.sql`

Flyway migration standards: naming conventions, schema patterns, safe alterations.

---

## ⚡ Prompts

Quick scaffolding templates accessible via Copilot Chat.

### #aksel-component

Scaffold responsive React components with Aksel Design System.

```text
#aksel-component Create a user profile card
```

### #kafka-topic

Add Kafka topic to NAIS manifest and create event handlers.

```text
#kafka-topic Add topic for user-events
```

### #nais-manifest

Generate production-ready NAIS application manifest.

```text
#nais-manifest Create manifest with PostgreSQL and Azure AD
```

---

## 🎯 Skills

Production patterns extracted from real Nav repositories.

### TokenX Auth

Service-to-service authentication with token exchange and caching patterns.

### Observability Setup

Complete observability: health endpoints, metrics, tracing, alerts, DORA metrics.

### Aksel Spacing

Responsive layout patterns using Aksel spacing tokens (NO Tailwind padding/margin).

### Kotlin App Config

Type-safe environment configuration with sealed classes (Local/Dev/Prod).

### Flyway Migration

Database migrations with versioned SQL scripts and safe schema changes.

---

## 🏗️ Nav Development Standards

These customizations enforce Nav's core principles:

### Principles

- **Team First** - Autonomous teams with circles of autonomy
- **Product Development** - Continuous development over ad hoc approaches
- **Essential Complexity** - Focus on essential, avoid accidental complexity
- **DORA Metrics** - Measure and improve team performance

### Tech Stack

- **Backend**: Kotlin, Ktor, PostgreSQL, Kafka
- **Frontend**: Next.js 15+, React, TypeScript, Aksel Design System
- **Platform**: NAIS (Kubernetes on GCP)
- **Auth**: Azure AD, TokenX, ID-porten, Maskinporten
- **Observability**: Prometheus, Grafana Loki, Tempo (OpenTelemetry)

---

## 📦 Applications

### my-copilot

Self-service tool for managing GitHub Copilot subscriptions at Nav.

- **Tech**: Next.js 16, TypeScript, Aksel Design System, Octokit
- **Auth**: Azure AD JWT validation via NAIS sidecar proxy
- **Deployment**: NAIS (dev-gcp, prod-gcp)

**Commands:**

```bash
pnpm dev        # Start dev server
pnpm check      # Run all checks (ESLint, TypeScript, Prettier, Knip, Jest)
pnpm test       # Run Jest tests
pnpm build      # Production build
```

---

## 🤝 Contributing

To add new customizations:

1. **Agents**: Add `*.agent.md` to `.github/agents/`
2. **Instructions**: Add `*.instructions.md` to `.github/instructions/`
3. **Prompts**: Add `*.prompt.md` to `.github/prompts/`
4. **Skills**: Add folder with `SKILL.md` to `.github/skills/`

Update the tasks in `.vscode/tasks.json` to include installation steps for new files.

---

## 📄 License

See [LICENSE](LICENSE) file.

---

## 🔗 Resources

- [NAIS Documentation](https://doc.nais.io)
- [Aksel Design System](https://aksel.Nav.no)
- [Nav GitHub](https://github.com/Navikt)
