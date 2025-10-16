import { PremiumRequestUsage } from './types';

export interface PremiumMetrics {
  totalGrossAmount: number;
  totalDiscountAmount: number;
  totalNetAmount: number;
  totalGrossRequests: number;
  totalBilledRequests: number;
  totalIncludedRequests: number;
  modelBreakdown: Array<{
    model: string;
    requests: number;
    amount: number;
  }>;
}

export function calculatePremiumMetrics(premiumUsage: PremiumRequestUsage): PremiumMetrics {
  const totalGrossAmount = premiumUsage.usageItems.reduce((sum, item) => sum + item.grossAmount, 0);
  const totalDiscountAmount = premiumUsage.usageItems.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalNetAmount = premiumUsage.usageItems.reduce((sum, item) => sum + item.netAmount, 0);
  const totalGrossRequests = premiumUsage.usageItems.reduce((sum, item) => sum + item.grossQuantity, 0);
  const totalBilledRequests = premiumUsage.usageItems.reduce((sum, item) => sum + item.netQuantity, 0);
  const totalIncludedRequests = totalGrossRequests - totalBilledRequests;

  const modelBreakdown = premiumUsage.usageItems
    .reduce((acc, item) => {
      const existing = acc.find(m => m.model === item.model);
      if (existing) {
        existing.requests += item.grossQuantity;
        existing.amount += item.grossAmount;
      } else {
        acc.push({
          model: item.model,
          requests: item.grossQuantity,
          amount: item.grossAmount
        });
      }
      return acc;
    }, [] as Array<{ model: string; requests: number; amount: number }>)
    .sort((a, b) => b.requests - a.requests);

  return {
    totalGrossAmount,
    totalDiscountAmount,
    totalNetAmount,
    totalGrossRequests,
    totalBilledRequests,
    totalIncludedRequests,
    modelBreakdown
  };
}
