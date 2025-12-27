import { cacheLife, cacheTag } from "next/cache";
import { getCopilotUsage, getCopilotBilling, getPremiumRequestUsage } from "./github";

/**
 * Cached version of getCopilotUsage with 'github' cache profile
 * This data updates daily so we can cache it for several hours
 */
export async function getCachedCopilotUsage(org: string) {
  "use cache";
  cacheLife({ stale: 3600 });
  cacheTag("usage-navikt");

  return await getCopilotUsage(org);
}

/**
 * Cached version of getCopilotBilling
 * Billing data changes infrequently so we can cache it longer
 */
export async function getCachedCopilotBilling(org: string) {
  "use cache";
  cacheLife({ stale: 3600 });
  cacheTag("billing-navikt");

  return await getCopilotBilling(org);
}

/**
 * Cached version of getPremiumRequestUsage
 * Premium usage data for current month updates frequently
 */
export async function getCachedPremiumRequestUsage(org: string, year?: number, month?: number) {
  "use cache";
  cacheLife({
    stale: 300, // 5 minutes until considered stale
    revalidate: 900, // 15 minutes until revalidated
    expire: 3600, // 1 hour until expired
  });
  cacheTag("premium-usage", org, `${year}-${month}`);

  return await getPremiumRequestUsage(org, year, month);
}
