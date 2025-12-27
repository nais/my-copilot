# Nav MCP Hello World

A reference MCP (Model Context Protocol) server demonstrating GitHub OAuth authentication for use with GitHub Copilot in VS Code.

## Overview

This server implements:

- **OAuth 2.1 with PKCE** - Secure authentication flow required by MCP spec
- **GitHub OAuth proxy** - Acts as OAuth authorization server, proxying to GitHub
- **Organization access control** - Validates user membership in allowed GitHub organizations
- **MCP JSON-RPC** - Full protocol implementation with streamable HTTP transport

## Architecture

```
┌─────────────────┐     ┌─────────────────────────┐     ┌─────────────┐
│   VS Code       │────▶│  mcp-hello-world    │────▶│   GitHub    │
│   (MCP Client)  │◀────│  (OAuth + MCP Server)   │◀────│   OAuth     │
└─────────────────┘     └─────────────────────────┘     └─────────────┘
```

**Flow:**
1. VS Code discovers OAuth metadata via `/.well-known/oauth-authorization-server`
2. User is redirected to GitHub for authentication
3. Server exchanges GitHub code for tokens and validates org membership
4. Server issues its own access token mapped to GitHub session
5. VS Code uses token to call MCP tools

## Available Tools

| Tool          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `hello_world` | Returns a greeting with authenticated user's GitHub username |
| `greet`       | Returns a personalized greeting message                      |
| `whoami`      | Returns information about the authenticated GitHub user      |
| `echo`        | Echoes back a provided message                               |
| `get_time`    | Returns current server time in various formats               |

## Configuration

| Environment Variable   | Description                         | Default                 |
| ---------------------- | ----------------------------------- | ----------------------- |
| `PORT`                 | Server port                         | `8080`                  |
| `BASE_URL`             | Public URL for OAuth redirects      | `http://localhost:8080` |
| `GITHUB_CLIENT_ID`     | GitHub OAuth App client ID          | (required)              |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret      | (required)              |
| `ALLOWED_ORGANIZATION` | GitHub org users must belong to     | `navikt`                |
| `LOG_LEVEL`            | Log level: DEBUG, INFO, WARN, ERROR | `INFO`                  |

## Setup

### 1. Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App with:
   - **Homepage URL**: Your server URL
   - **Authorization callback URL**: `{BASE_URL}/oauth/callback`
3. Note the Client ID and generate a Client Secret

### 2. Run Locally

```bash
export GITHUB_CLIENT_ID=your_client_id
export GITHUB_CLIENT_SECRET=your_client_secret
export BASE_URL=http://localhost:8080

mise run dev
```

### 3. Test Endpoints

```bash
curl http://localhost:8080/.well-known/oauth-authorization-server | jq
curl http://localhost:8080/.well-known/oauth-protected-resource | jq

curl http://localhost:8080/mcp
```

## Development

```bash
mise run version  # Generate version string
mise run install  # Download dependencies
mise run check    # Run all checks (fmt, vet, lint, test)
mise run test     # Run tests
mise run build    # Build binary to bin/mcp-hello-world
mise run dev      # Run with DEBUG logging
mise run lint     # Run golangci-lint
```

## Deployment

Automatic deployment via GitHub Actions on merge to main and pull requests.

- **Production**: `https://mcp-hello-world.nav.no`
- **Development**: `https://mcp-hello-world.intern.dev.nav.no`

Deployed to Nais using the reusable `mise-build-deploy-nais` workflow.

## API Endpoints

| Endpoint                                  | Method | Description                 |
| ----------------------------------------- | ------ | --------------------------- |
| `/.well-known/oauth-authorization-server` | GET    | OAuth server metadata       |
| `/.well-known/oauth-protected-resource`   | GET    | Protected resource metadata |
| `/oauth/authorize`                        | GET    | Start OAuth flow            |
| `/oauth/callback`                         | GET    | GitHub OAuth callback       |
| `/oauth/token`                            | POST   | Token exchange              |
| `/mcp`                                    | POST   | MCP JSON-RPC endpoint       |
| `/health`                                 | GET    | Health check                |
| `/ready`                                  | GET    | Readiness check             |

## MCP Registry

This server is registered in Nav's MCP registry as `io.github.navikt/hello-world`.

## Security

- Uses OAuth 2.1 with PKCE (Proof Key for Code Exchange)
- Validates GitHub organization membership before issuing tokens
- Tokens expire after 1 hour (refresh tokens: 30 days)
- All tokens stored in memory (lost on restart)

## License

MIT
