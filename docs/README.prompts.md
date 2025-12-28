# 🎯 Reusable Prompts

Reusable prompt templates for NAV development scenarios and tasks, optimized for Norwegian public sector workflows.

### How to Use Reusable Prompts

**To Install:**
- Click the **VS Code** or **VS Code Insiders** install button for the prompt you want to use
- Download the `*.prompt.md` file and manually add it to your prompt collection

**To Run/Execute:**
- Use `/prompt-name` in VS Code chat after installation
- Run the `Chat: Run Prompt` command from the Command Palette
- Hit the run button while you have a prompt file open in VS Code

## Available Prompts

| Title       | Description                             | Location           |
| ----------- | --------------------------------------- | ------------------ |
| Coming Soon | NAV-specific prompts will be added here | `.github/prompts/` |

## Creating NAV Prompts

When creating reusable prompts for NAV projects:

1. **Norwegian Context**: Support Norwegian language and formatting requirements
2. **NAIS Platform**: Include NAIS deployment and configuration patterns
3. **Security**: Always include security considerations for public sector
4. **Accessibility**: Follow UU (universal design) requirements
5. **Mobile-First**: Default to mobile-first responsive design patterns
6. **Team Autonomy**: Respect team decision-making and autonomous practices

## Prompt Categories

### Platform & Infrastructure
- NAIS manifest generation
- Kubernetes configuration
- Google Cloud Platform setup
- Network policies and security

### Authentication & Authorization
- Azure AD integration
- TokenX configuration
- ID-porten setup
- Maskinporten integration

### Frontend Development
- Aksel Design System implementation
- Next.js 16 patterns
- Norwegian number/date formatting
- Responsive design validation

### Backend Development
- Kotlin/Ktor application structure
- PostgreSQL schema design
- Kafka event handling
- Rapids & Rivers implementation

### Observability
- Prometheus metrics setup
- Grafana Loki configuration
- Tempo tracing implementation
- Alert rule creation

## Best Practices

- Keep prompts focused on single, well-defined tasks
- Include practical examples from NAV projects
- Reference official NAV documentation
- Consider both dev and prod environments
- Support automated testing and validation
