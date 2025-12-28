# 📋 Custom Instructions

Team and project-specific instructions to enhance GitHub Copilot's behavior for NAV technologies and coding practices.

### How to Use Custom Instructions

**To Install:**
- Click the **VS Code** or **VS Code Insiders** install button for the instruction you want to use
- Download the `*.instructions.md` file and manually add it to your project's instruction collection

**To Use/Apply:**
- Copy these instructions to your `.github/copilot-instructions.md` file in your workspace
- Create task-specific `.github/instructions/*.instructions.md` files in your workspace's `.github/instructions` folder
- Instructions automatically apply to Copilot behavior once installed in your workspace

## Available Instructions

| Title | Description | Location |
| ----- | ----------- | -------- |
| [Kotlin/Ktor Development](../.github/instructions/kotlin-ktor.instructions.md) | Guidelines for Kotlin/Ktor backend development following NAV patterns | `.github/instructions/kotlin-ktor.instructions.md` |
| [Next.js/Aksel Development](../.github/instructions/nextjs-aksel.instructions.md) | Next.js 16+ with Aksel Design System patterns and Norwegian formatting | `.github/instructions/nextjs-aksel.instructions.md` |
| [Database Development](../.github/instructions/database.instructions.md) | PostgreSQL best practices and migration patterns for NAV | `.github/instructions/database.instructions.md` |
| [Testing Standards](../.github/instructions/testing.instructions.md) | Testing guidelines for Kotlin (JUnit), TypeScript (Jest), and integration tests | `.github/instructions/testing.instructions.md` |

## Creating Custom Instructions

When creating instructions for NAV projects:

1. **Technology-Specific**: Focus on specific technologies used in NAV (Kotlin, Next.js, PostgreSQL, Kafka)
2. **NAV Patterns**: Include NAV-specific patterns (Rapids & Rivers, ApplicationBuilder, etc.)
3. **Security Standards**: Always reference NAV security requirements
4. **Code Quality**: Enforce strict type checking and quality standards
5. **Norwegian Support**: Include Norwegian language/number formatting requirements
6. **NAIS Integration**: Consider NAIS platform requirements and constraints

## Instruction Categories

### Backend Development
- **Kotlin/Ktor**: ApplicationBuilder pattern, sealed classes for environment config, kotliquery/HikariCP
- **Kafka**: Rapids & Rivers event handling patterns
- **Database**: PostgreSQL migrations, query patterns, connection pooling
- **Testing**: JUnit 5, Mockk, testcontainers

### Frontend Development
- **Next.js**: App Router, Server Components, TypeScript strict mode
- **Aksel Design System**: Component usage, spacing tokens (never Tailwind p-/m-)
- **Responsive Design**: Mobile-first with `xs`, `sm`, `md`, `lg`, `xl` breakpoints
- **Formatting**: Norwegian number formatting (151 354), date/time patterns

### Platform & Deployment
- **NAIS Manifests**: Required endpoints (/isalive, /isready, /metrics)
- **Authentication**: Azure AD, TokenX, ID-porten patterns
- **Observability**: OpenTelemetry auto-instrumentation, Prometheus metrics
- **Security**: Secrets management, network policies, access control

### Code Quality
- **TypeScript**: Strict mode enabled, comprehensive type coverage
- **Kotlin**: Idiomatic patterns, null safety, coroutines best practices
- **Testing**: Unit tests, integration tests, end-to-end tests
- **Documentation**: Norwegian documentation where applicable

## Workspace Structure

```
.github/
├── copilot-instructions.md          # Main workspace instructions
├── instructions/                     # Additional instruction files
│   ├── kotlin-ktor.instructions.md
│   ├── nextjs-aksel.instructions.md
│   ├── database.instructions.md
│   └── testing.instructions.md
├── agents/                          # Custom agents
├── prompts/                         # Reusable prompts
└── skills/                          # Agent skills
```

## Best Practices

- Keep instructions focused and technology-specific
- Reference official NAV documentation
- Include code examples following NAV patterns
- Consider both local development and NAIS deployment
- Support team autonomy and decision-making
- Maintain consistency across NAV projects
