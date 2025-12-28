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

| Title                                                                         | Description                                                                                                | Location                                          |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Nais Platform Agent](../.github/agents/nais-platform-agent.agent.md)         | Expert assistant for NAIS platform deployments, Kubernetes configurations, and NAV infrastructure patterns | `.github/agents/nais-platform-agent.agent.md`     |
| [Auth Agent](../.github/agents/auth-agent.agent.md)                           | Specialist for Azure AD, TokenX, ID-porten, and Maskinporten authentication in NAV applications            | `.github/agents/auth-agent.agent.md`              |
| [Observability Agent](../.github/agents/observability-agent.agent.md)         | Expert for Prometheus metrics, Grafana Loki logs, and Tempo tracing in NAIS applications                   | `.github/agents/observability-agent.agent.md`     |
| [Kafka Events Agent](../.github/agents/kafka-events-agent.agent.md)           | Specialist for Apache Kafka event handling using Rapids & Rivers pattern                                   | `.github/agents/kafka-events-agent.agent.md`      |
| [Aksel Design Agent](../.github/agents/aksel-design-agent.agent.md)           | Expert for NAV's Aksel Design System implementation with Next.js and React                                 | `.github/agents/aksel-design-agent.agent.md`      |
| [Security Champion Agent](../.github/agents/security-champion-agent.agent.md) | Security specialist ensuring NAV security standards and best practices                                     | `.github/agents/security-champion-agent.agent.md` |

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
