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
    query($organization: String!, $identity: String!) {
      organization(login: $organization) {
        samlIdentityProvider {
          externalIdentities(first: 1, userName: $identity) {
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

  try {
    const variables = {
      organization,
      identity,
    };

    const response = await octokit.graphql(query, variables) as {
      organization: {
        samlIdentityProvider: {
          externalIdentities: {
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

    if (externalIdentities.length > 0) {
      return { user: externalIdentities[0].node.user.login, error: null };
    }

    return { user: null, error: `No user found for SAML identity ${identity} in the ${organization} GitHub organization.` };
  } catch (error) {
    return { user: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}

type CopilotBilling = {
  seat_breakdown: {
    total?: number | undefined,
    added_this_cycle?: number | undefined,
    pending_invitation?: number | undefined,
    pending_cancellation?: number | undefined,
    active_this_cycle?: number | undefined,
    inactive_this_cycle?: number | undefined
  },
  seat_management_setting?: string | undefined,
  ide_chat?: string | undefined,
  platform_chat?: string | undefined,
  cli?: string | undefined,
  public_code_suggestions?: string | undefined
}

export async function getCopilotBilling(org: string): Promise<{ billing: CopilotBilling, error: string | null }> {
  try {
    const { data } = await octokit.request('GET /orgs/{org}/copilot/billing', {
      org
    });

    return { billing: data, error: null };
  } catch (error) {
    return { billing: {} as CopilotBilling, error: (error instanceof Error ? error.message : String(error)) };
  }
}

type CopilotAssignee = {
  login: string;
};

type CopilotSeat = {
  created_at: string;
  assignee?: CopilotAssignee | null;
  pending_cancellation_date?: string | null;
  plan_type?: string;
  updated_at?: string;
  last_activity_at?: string | null;
  last_activity_editor?: string | null;
};

export async function getCopilotSeats(org: string): Promise<{ total_seats: number | undefined, seats: CopilotSeat[] | undefined, error: string | null }> {
  try {
    const { data } = await octokit.request('GET /orgs/{org}/copilot/billing/seats', {
      org
    });

    const total_seats = data.total_seats;
    const seats = data.seats;

    return { total_seats, seats, error: null };
  } catch (error) {
    return { total_seats: undefined, seats: undefined, error: (error instanceof Error ? error.message : String(error)) };
  }
}

export async function getCopilotSeat(org: string, username: string): Promise<{ copilot: CopilotSeat | null, error: string | null }> {
  try {
    const { data } = await octokit.request('GET /orgs/{org}/members/{username}/copilot', {
      org,
      username
    });
    return { copilot: data, error: null };
  } catch (error) {
    // 404 means the user has not been assigned to Copilot yet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).status === 404) {
      return { copilot: null, error: null };
    }
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

export type CopilotMetrics = {
  date: string;
  total_active_users?: number | undefined;
  total_engaged_users?: number | undefined;
  copilot_ide_code_completions?: {
    total_engaged_users?: number | undefined;
    languages?: Array<{
      name?: string | undefined;
      total_engaged_users?: number | undefined;
    }> | undefined;
    editors?: Array<{
      name?: string | undefined;
      total_engaged_users?: number | undefined;
      models?: Array<{
        name?: string | undefined;
        is_custom_model?: boolean | undefined;
        custom_model_training_date?: string | null | undefined;
        total_engaged_users?: number | undefined;
        languages?: Array<{
          name?: string | undefined;
          total_engaged_users?: number | undefined;
          total_code_suggestions?: number | undefined;
          total_code_acceptances?: number | undefined;
          total_code_lines_suggested?: number | undefined;
          total_code_lines_accepted?: number | undefined;
        }> | undefined;
      }> | undefined;
    }> | undefined;
  } | null | undefined;
  copilot_ide_chat?: {
    total_engaged_users?: number | undefined;
    editors?: Array<{
      name?: string | undefined;
      total_engaged_users?: number | undefined;
      models?: Array<{
        name?: string | undefined;
        is_custom_model?: boolean | undefined;
        custom_model_training_date?: string | null | undefined;
        total_engaged_users?: number | undefined;
        total_chats?: number | undefined;
        total_chat_insertion_events?: number | undefined;
        total_chat_copy_events?: number | undefined;
      }> | undefined;
    }> | undefined;
  } | null | undefined;
  copilot_dotcom_chat?: {
    total_engaged_users?: number | undefined;
    models?: Array<{
      name?: string | undefined;
      is_custom_model?: boolean | undefined;
      custom_model_training_date?: string | null | undefined;
      total_engaged_users?: number | undefined;
      total_chats?: number | undefined;
    }> | undefined;
  } | null | undefined;
  copilot_dotcom_pull_requests?: {
    total_engaged_users?: number | undefined;
    repositories?: Array<{
      name?: string | undefined;
      total_engaged_users?: number | undefined;
      models?: Array<{
        name?: string | undefined;
        is_custom_model?: boolean | undefined;
        custom_model_training_date?: string | null | undefined;
        total_pr_summaries_created?: number | undefined;
        total_engaged_users?: number | undefined;
      }> | undefined;
    }> | undefined;
  } | null | undefined;
};

export async function getCopilotUsage(org: string): Promise<{ usage: CopilotMetrics[] | null, error: string | null }> {
  try {
    const { data } = await octokit.request('GET /orgs/{org}/copilot/metrics', {
      org
    });

    return { usage: data, error: null };
  } catch (error) {
    return { usage: null, error: (error instanceof Error ? error.message : String(error)) };
  }
}
