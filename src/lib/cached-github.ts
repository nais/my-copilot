import { cacheLife, cacheTag } from 'next/cache';
import { getCopilotUsage, getCopilotBilling, getCopilotSeats, getPremiumRequestUsage, getBillingUsage } from './github';

/**
 * Cached version of getCopilotUsage with 'github' cache profile
 * This data updates daily so we can cache it for several hours
 */
export async function getCachedCopilotUsage(org: string) {
  'use cache'
  cacheLife('github')
  cacheTag('copilot-usage', org)

  return await getCopilotUsage(org);
}

/**
 * Cached version of getCopilotBilling
 * Billing data changes infrequently so we can cache it longer
 */
export async function getCachedCopilotBilling(org: string) {
  'use cache'
  cacheLife('github')
  cacheTag('copilot-billing', org)

  return await getCopilotBilling(org);
}

/**
 * Cached version of getCopilotSeats
 * Seat data changes when users are added/removed but not frequently
 */
export async function getCachedCopilotSeats(org: string) {
  'use cache'
  cacheLife({
    stale: 120, // 2 minutes until considered stale
    revalidate: 600, // 10 minutes until revalidated
    expire: 3600, // 1 hour until expired
  })
  cacheTag('copilot-seats', org)

  return await getCopilotSeats(org);
}

/**
 * Cached version of getPremiumRequestUsage
 * Premium usage data for current month updates frequently
 */
export async function getCachedPremiumRequestUsage(org: string, year?: number, month?: number) {
  'use cache'
  cacheLife({
    stale: 300, // 5 minutes until considered stale
    revalidate: 900, // 15 minutes until revalidated
    expire: 3600, // 1 hour until expired
  })
  cacheTag('premium-usage', org, `${year}-${month}`)

  return await getPremiumRequestUsage(org, year, month);
}

/**
 * Cached version of getBillingUsage
 * Historical billing data rarely changes so can be cached longer
 */
export async function getCachedBillingUsage(org: string, year?: number, month?: number) {
  'use cache'
  cacheLife({
    stale: 1800, // 30 minutes until considered stale
    revalidate: 7200, // 2 hours until revalidated
    expire: 86400, // 1 day until expired
  })
  cacheTag('billing-usage', org, `${year}-${month}`)

  return await getBillingUsage(org, year, month);
}