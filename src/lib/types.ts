// Types for processed Copilot data
export interface LanguageData {
  name: string;
  total_engaged_users: number;
}

export interface EditorData {
  name: string;
  users: number;
  acceptances: number;
  suggestions: number;
  acceptanceRate: number;
}

export interface RepositoryData {
  name: string;
  users: number;
  summaries: number;
}

export interface ModelData {
  name: string;
  users: number;
  isCustom: boolean;
  features: string[];
}

// Billing types
export interface BillingUsageItem {
  date: string;
  product: string;
  sku: string;
  quantity: number;
  unitType: string;
  pricePerUnit: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  organizationName?: string;
  repositoryName?: string;
}

export interface PremiumRequestUsageItem {
  product: string;
  sku: string;
  model: string;
  unitType: string;
  pricePerUnit: number;
  grossQuantity: number;
  grossAmount: number;
  discountQuantity: number;
  discountAmount: number;
  netQuantity: number;
  netAmount: number;
}

export interface BillingTimePeriod {
  year: number;
  month?: number;
  day?: number;
}

export interface PremiumRequestUsage {
  timePeriod: BillingTimePeriod;
  organization: string;
  usageItems: PremiumRequestUsageItem[];
}

export interface AggregatedBillingMetrics {
  totalRequests: number;
  includedRequests: number;
  billedRequests: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  modelBreakdown: {
    model: string;
    requests: number;
    amount: number;
  }[];
  productBreakdown: {
    product: string;
    requests: number;
    amount: number;
  }[];
}

export interface ChatStats {
  totalChats: number;
  totalCopyEvents: number;
  totalInsertionEvents: number;
  ideUsers: number;
  dotcomUsers: number;
}

export interface OverallMetrics {
  totalSuggestions: number;
  totalAcceptances: number;
  overallAcceptanceRate: number;
}

export interface LinesMetrics {
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  linesAcceptanceRate: number;
}

export interface PRSummaryMetrics {
  totalEngagedUsers: number;
  totalPRSummaries: number;
  repositoryStats: RepositoryData[];
}

export interface FeatureAdoptionMetrics {
  codeCompletionUsers: number;
  ideChatUsers: number;
  dotcomChatUsers: number;
  prSummaryUsers: number;
  totalActiveUsers: number;
  adoptionRates: {
    codeCompletion: number;
    ideChat: number;
    dotcomChat: number;
    prSummary: number;
  };
}
