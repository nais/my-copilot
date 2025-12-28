# 🤖 Custom Agents

Custom agents for NAV's GitHub Copilot ecosystem, specialized for Norwegian public sector development patterns.

### How to Use Custom Agents

**To Install:**
- Click the **VS Code** or **VS Code Insiders** install button for the agent you want to use
- Download the `*.agent.md` file and add it to your repository's `.github/agents/` directory

**MCP Server Setup:**
- Some agents may require MCP servers to function (e.g., GitHub MCP server for repository operations)
- Follow the MCP server setup guide in your environment

**To Activate/Use:**
- Access installed agents through the VS Code Chat interface
- Assign agents in Copilot Coding Agent (CCA)
- Follow agent-specific instructions for optimal usage

## Available Agents

| Agent                                                                                                      | Description                                                                                                                                                                                                    | Install                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nais Agent**<br/>[`@nais-agent`](../.github/agents/nais.agent.md)                                        | Expert assistant for NAIS platform deployments, Kubernetes configurations, and NAV infrastructure patterns. Use for creating `.nais/app.yaml` manifests, adding PostgreSQL/Kafka, troubleshooting deployments. | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fnais.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fnais.agent.md)                           |
| **Auth Agent**<br/>[`@auth-agent`](../.github/agents/auth.agent.md)                                        | Specialist for Azure AD, TokenX, ID-porten, and Maskinporten authentication in NAV applications. Use for Azure AD integration, TokenX token exchange, JWT validation, RBAC patterns.                           | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fauth.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fauth.agent.md)                           |
| **Kafka Agent**<br/>[`@kafka-agent`](../.github/agents/kafka.agent.md)                                     | Specialist for Apache Kafka event handling using Rapids & Rivers pattern. Use for creating Kafka event consumers (Rivers), designing event schemas, testing with TestRapid.                                    | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fkafka.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fkafka.agent.md)                         |
| **Aksel Agent**<br/>[`@aksel-agent`](../.github/agents/aksel.agent.md)                                     | Expert for NAV's Aksel Design System implementation with Next.js and React. Use for converting Tailwind to Aksel tokens, responsive layouts, mobile-first design, Norwegian number formatting.                 | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Faksel.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Faksel.agent.md)                         |
| **Observability Agent**<br/>[`@observability-agent`](../.github/agents/observability.agent.md)             | Expert for Prometheus metrics, Grafana Loki logs, and Tempo tracing in NAIS applications. Use for health endpoints, business metrics, OpenTelemetry tracing, DORA metrics, alerting rules.                     | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fobservability.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fobservability.agent.md)         |
| **Security Champion Agent**<br/>[`@security-champion-agent`](../.github/agents/security-champion.agent.md) | Security specialist ensuring NAV security standards and best practices. Use for network policies, secrets management, GDPR compliance, security testing, vulnerability response.                               | [![Install in VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fsecurity-champion.agent.md)<br/>[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:chat-agent/install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnavikt%2Fcopilot%2Fmain%2F.github%2Fagents%2Fsecurity-champion.agent.md) |

## Creating Custom Agents

When creating new agents for NAV projects:

1. **Follow NAV Standards**: Align with NAV development principles (Team First, Essential Complexity, DORA Metrics)
2. **Include Context**: Reference NAV tech stack (Kotlin/Ktor, Next.js, NAIS)
3. **Security First**: Always consider security implications and NAV security policies
4. **Norwegian Language**: Support Norwegian text and number formatting where applicable
5. **Platform Integration**: Ensure compatibility with NAIS deployment patterns

## Agent Guidelines

- Agents should be self-contained and focused on specific domains
- Include clear examples and common use cases
- Reference relevant NAV documentation and standards
- Support both local development and NAIS-deployed scenarios
- Consider mobile-first design for frontend-related agents
