import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

const requiredEnvVars = [
  'GITHUB_APP_ID',
  'GITHUB_APP_PRIVATE_KEY',
  'GITHUB_APP_INSTALLATION_ID'
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is required but not set.`);
  }
}

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
    installationId: process.env.GITHUB_APP_INSTALLATION_ID,
  },
});

export async function getUsernameBySamlIdentity(identity: string, organization: string): Promise<{ user: string | null, error: string | null }> {
  const query = `
    query($organization: String!, $cursor: String) {
      organization(login: $organization) {
        samlIdentityProvider {
          externalIdentities(first: 100, after: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                guid
                samlIdentity {
                  nameId
                  username
                }
                user {
                  login
                }
              }
            }
          }
        }
      }
    }
  `;

  let cursor: string | null = null;

  try {
    while (true) {
      const variables = {
        organization,
        cursor,
      };

      const response = await octokit.graphql(query, variables) as {
        organization: {
          samlIdentityProvider: {
            externalIdentities: {
              pageInfo: {
                endCursor: string;
                hasNextPage: boolean;
              };
              edges: Array<{
                node: {
                  guid: string;
                  samlIdentity: {
                    nameId: string;
                    username: string;
                  };
                  user: {
                    login: string;
                  };
                };
              }>;
            };
          };
        };
      };

      const externalIdentities = response.organization.samlIdentityProvider.externalIdentities.edges;

      for (const edge of externalIdentities) {
        if (edge.node.samlIdentity.username && edge.node.samlIdentity.username.toLowerCase() === identity.toLowerCase()) {
          return { user: edge.node.user.login, error: null };
        }
      }

      if (!response.organization.samlIdentityProvider.externalIdentities.pageInfo.hasNextPage) {
        break;
      }

      cursor = response.organization.samlIdentityProvider.externalIdentities.pageInfo.endCursor;
    }

    return { user: null, error: `No user found for SAML identity ${identity}` };
  } catch (error) {
    return { user: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}

type CopilotAssignee = {
  login: string;
};

type CopilotStatus = {
  created_at: string;
  assignee: CopilotAssignee;
  pending_cancellation_date?: string | null;
  plan_type?: string;
  updated_at?: string;
  last_activity_at?: string | null;
  last_activity_editor?: string | null;
};

export async function getCopilotSubscription(org: string, username: string): Promise<{ copilot: CopilotStatus | null, error: string | null }> {
  try {
    const { data } = await octokit.request('GET /orgs/{org}/members/{username}/copilot', {
      org,
      username
    });
    return { copilot: data, error: null };
  } catch (error) {
    return { copilot: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function assignUserToCopilot(org: string, username: string): Promise<{ seats_created: number | null, error: string | null }> {
  try {
    const { data } = await octokit.request('POST /orgs/{org}/copilot/billing/selected_users', {
      org,
      data: {
        selected_usernames: [username]
      },
      selected_usernames: []
    });
    return { seats_created: data.seats_created, error: null };
  } catch (error) {
    return { seats_created: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function unassignUserFromCopilot(org: string, username: string): Promise<{ seats_cancelled: number | null, error: string | null }> {
  try {
    const { data } = await octokit.request('DELETE /orgs/{org}/copilot/billing/selected_users', {
      org,
      data: {
        selected_usernames: [username]
      },
      selected_usernames: []
    });
    return { seats_cancelled: data.seats_cancelled, error: null };
  } catch (error) {
    return { seats_cancelled: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}