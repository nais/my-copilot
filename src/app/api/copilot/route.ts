import { getUser } from '@/lib/auth';
import InMemoryCache from '@/lib/cache';
import { assignUserToCopilot, getCopilotSeat, getUsernameBySamlIdentity, unassignUserFromCopilot } from '@/lib/github';
import { getLoggerWithTraceContext } from '@/lib/logger';
import { context } from '@opentelemetry/api';
import { NextResponse } from 'next/server';

const cache = new InMemoryCache();

async function getCachedGitHubUsername(email: string, githubOrg: string, cache: InMemoryCache) {
  const { user, error } = await cache.get(
    `githubUsername_${email}`,
    async () => {
      return await getUsernameBySamlIdentity(email, githubOrg);
    },
    3600000 // Cache for 60 minutes
  )

  return { user, error };
}

async function getCachedCopilotStatus(githubUsername: string, gitHubOrg: string, cache: InMemoryCache) {
  const { copilot: subscription, error } = await cache.get(
    `copilotStatus_${githubUsername}`,
    async () => {
      return await getCopilotSeat(gitHubOrg, githubUsername);
    },
    60000 // Cache for 60 seconds
  )

  return { subscription, error };
}

export async function GET() {
  const log = getLoggerWithTraceContext(context.active());

  const org = 'navikt';
  const user = await getUser(false);

  const error = (message: string, status: number) => {
    if (status >= 500) {
      log.error(message);
    } else {
      log.warn(message);
    }

    return NextResponse.json({ error: message }, { status });
  }

  if (!user) {
    return error('User is not authenticated', 401);
  }

  if (!user.email) {
    return error('User email not found', 500);
  }

  // Get the GitHub username for the user
  const { user: githubUsername, error: githubError } = await getCachedGitHubUsername(user.email, org, cache);

  if (githubError) {
    return error(githubError, 500);
  }

  if (!githubUsername) {
    return error('GitHub username was not found for user email', 400);
  }

  // Get the Copilot subscription status for the user
  const { subscription, error: copilotError } = await getCachedCopilotStatus(githubUsername, org, cache);

  if (copilotError) {
    return error(copilotError, 500);
  }

  log.info({ email: user.email }, 'User Copilot subscription status');

  return NextResponse.json({
    icanhazcopilot: user.groups.length > 0,
    subscription,
    githubUsername,
  });
}

enum Action {
  Activate = 'activate',
  Deactivate = 'deactivate',
}

export async function POST(request: Request) {
  const log = getLoggerWithTraceContext(context.active());

  const org = 'navikt';
  const user = await getUser(false);

  const error = (message: string, status: number) => {
    if (status >= 500) {
      log.error(message);
    } else {
      log.warn(message);
    }

    return NextResponse.json({ error: message }, { status });
  }

  if (!user) {
    return error('User is not authenticated', 401);
  }

  if (!user.email) {
    return error('User email not found', 500);
  }

  // Check if user is eligible to get Copilot. This is done by checking if the
  // user is a member of any groups on the JWT token, groups are set when the
  // user logs in.
  if (user.groups.length === 0) {
    return error('User is not a member of any groups', 403);
  }

  const { action } = await request.json();

  if (!action) {
    return error('Action is required', 400);
  }

  // Get the GitHub username for the user
  const { user: githubUsername, error: githubError } = await getCachedGitHubUsername(user.email, org, cache);

  if (githubError) {
    return error(githubError, 500);
  }

  if (!githubUsername) {
    return error('GitHub username was not found for user email', 400);
  }

  // @TODO use the subscription to determine valid actions

  // Get the Copilot subscription status for the user
  // const { subscription, error: copilotError } = await getCachedCopilotStatus(githubUsername, org, cache);

  // if (copilotError) {
  //   console.error(copilotError);
  //   return NextResponse.json({ error: copilotError }, { status: 500 });
  // }

  log.info({ email: user.email, action }, 'User action on Copilot subscription');

  switch (action) {
    case Action.Activate:
      const { seats_created, error: activateError } = await assignUserToCopilot(org, githubUsername);

      cache.delete(`copilotStatus_${githubUsername}`);

      if (activateError) {
        return error(activateError, 500);
      }

      return NextResponse.json({ seats_created }, { status: 201 });
    case Action.Deactivate:
      const { seats_cancelled, error: deactivateError } = await unassignUserFromCopilot(org, githubUsername);

      cache.delete(`copilotStatus_${githubUsername}`);

      if (deactivateError) {
        return error(deactivateError, 500);
      }

      return NextResponse.json({ seats_cancelled }, { status: 200 });
    default:
      return error('Unknown action', 400);
  }
}
