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

| Prompt                                                                             | Description                                                                                                                                        | Install                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **#aksel-component**<br/>[View File](../.github/prompts/aksel-component.prompt.md) | Scaffold responsive React components with Aksel Design System. Generates mobile-first layouts with proper spacing tokens and Norwegian formatting. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Faksel-component.prompt.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Faksel-component.prompt.md) |
| **#kafka-topic**<br/>[View File](../.github/prompts/kafka-topic.prompt.md)         | Add Kafka topic to NAIS manifest and create event handlers. Includes Rapids & Rivers pattern and event schema design.                              | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Fkafka-topic.prompt.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Fkafka-topic.prompt.md)         |
| **#nais-manifest**<br/>[View File](../.github/prompts/nais-manifest.prompt.md)     | Generate production-ready NAIS application manifest. Supports PostgreSQL, Kafka, Azure AD, and observability configuration.                        | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Fnais-manifest.prompt.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-prompt/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fprompts%2Fnais-manifest.prompt.md)     |

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
