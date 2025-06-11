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
