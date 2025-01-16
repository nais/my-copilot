import { getUser } from '@/lib/auth';
import InMemoryCache from '@/lib/cache';
import { assignUserToCopilot, getCopilotSubscription, getUsernameBySamlIdentity, unassignUserFromCopilot } from '@/lib/github';
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
      return await getCopilotSubscription(gitHubOrg, githubUsername);
    },
    60000 // Cache for 60 seconds
  )

  return { subscription, error };
}

export async function GET() {
  const org = 'navikt';
  const user = await getUser(false);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!user.email) {
    return NextResponse.json({ error: 'User email not found' }, { status: 500 });
  }

  // Get the GitHub username for the user
  const { user: githubUsername, error: githubError } = await getCachedGitHubUsername(user.email, org, cache);

  if (githubError) {
    console.error(githubError);
    return NextResponse.json({ error: githubError }, { status: 500 });
  }

  if (!githubUsername) {
    return NextResponse.json({ error: 'GitHub username not found' }, { status: 500 });
  }

  // Get the Copilot subscription status for the user
  const { subscription, error: copilotError } = await getCachedCopilotStatus(githubUsername, org, cache);

  if (copilotError) {
    console.error(copilotError);
    return NextResponse.json({ error: copilotError }, { status: 500 });
  }

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
  const org = 'navikt';
  const user = await getUser(false);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!user.email) {
    return NextResponse.json({ error: 'User email not found' }, { status: 500 });
  }

  // Check if user is eligible to get Copilot. This is done by checking if the
  // user is a member of any groups on the JWT token, groups are set when the
  // user logs in.
  if (user.groups.length === 0) {
    return NextResponse.json({ error: 'User is not a member of any groups' }, { status: 403 });
  }

  const { action } = await request.json();

  if (!action) {
    return NextResponse.json({ error: 'Action is required' }, { status: 400 });
  }

  // Get the GitHub username for the user
  const { user: githubUsername, error: githubError } = await getCachedGitHubUsername(user.email, org, cache);

  if (githubError) {
    console.error(githubError);
    return NextResponse.json({ error: githubError }, { status: 500 });
  }

  if (!githubUsername) {
    return NextResponse.json({ error: 'GitHub username not found' }, { status: 500 });
  }

  // @TODO use the subscription to determine valid actions

  // Get the Copilot subscription status for the user
  // const { subscription, error: copilotError } = await getCachedCopilotStatus(githubUsername, org, cache);

  // if (copilotError) {
  //   console.error(copilotError);
  //   return NextResponse.json({ error: copilotError }, { status: 500 });
  // }

  switch (action) {
    case Action.Activate:
      const { seats_created, error } = await assignUserToCopilot(org, githubUsername);

      cache.delete(`copilotStatus_${githubUsername}`);

      return NextResponse.json({ seats_created, error }, { status: error ? 500 : 201 });
    case Action.Deactivate:
      const { seats_cancelled, error: cancelError } = await unassignUserFromCopilot(org, githubUsername);

      cache.delete(`copilotStatus_${githubUsername}`);

      return NextResponse.json({ seats_cancelled, error: cancelError }, { status: cancelError ? 500 : 200 });
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
