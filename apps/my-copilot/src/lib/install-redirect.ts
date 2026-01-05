import { redirect } from "next/navigation";

/**
 * Supported VS Code installation types and their corresponding paths.
 */
export const INSTALL_TYPES = {
  agent: "chat-agent",
  instructions: "chat-instructions",
  prompt: "chat-prompt",
} as const;

export type InstallType = keyof typeof INSTALL_TYPES;

/**
 * Validates if the URL is an allowed VS Code installation URL.
 *
 * Security: Only allows redirects to vscode: URLs that:
 * 1. Use vscode: or vscode-insiders: scheme
 * 2. Have the correct installation path for the type
 * 3. Install from raw.githubusercontent.com/navikt/ (our GitHub org)
 * 4. Do not contain path traversal sequences
 *
 * @param url - The URL to validate (already URL-decoded by Next.js)
 * @param type - The installation type (agent, instructions, prompt)
 * @returns true if the URL is allowed, false otherwise
 */
export function isAllowedInstallUrl(url: string, type: InstallType): boolean {
  // Reject path traversal attempts
  if (url.includes("..")) {
    return false;
  }

  const chatPath = INSTALL_TYPES[type];

  // Build patterns for this specific type
  // Note: Next.js automatically URL-decodes query params, so we match decoded URLs
  const patterns = [
    new RegExp(`^vscode:${chatPath}/install\\?url=https://raw\\.githubusercontent\\.com/navikt/`),
    new RegExp(`^vscode-insiders:${chatPath}/install\\?url=https://raw\\.githubusercontent\\.com/navikt/`),
  ];

  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Handles the redirect for VS Code installation URLs.
 *
 * @param url - The URL parameter from the request (may be null)
 * @param type - The installation type
 * @returns Response with error, or redirects (never returns normally)
 */
export function handleInstallRedirect(url: string | null, type: InstallType): Response {
  if (!url) {
    return new Response("Missing 'url' parameter", { status: 400 });
  }

  if (!isAllowedInstallUrl(url, type)) {
    return new Response(`Invalid URL. Only navikt GitHub ${type} installations are allowed.`, { status: 400 });
  }

  // Redirect to the vscode: protocol URL
  // This will throw NEXT_REDIRECT, so it never returns
  redirect(url);
}
