import { CopilotMetrics } from "./github";
import { LanguageData, EditorData, ChatStats, PRSummaryMetrics, FeatureAdoptionMetrics, ModelData } from "./types";

export const calculateAcceptanceRate = (accepted: number, suggested: number): number => {
  return suggested > 0 ? Math.round((accepted / suggested) * 100) : 0;
};

export const getLatestUsage = (usage: CopilotMetrics[]): CopilotMetrics | null => {
  if (!usage || usage.length === 0) return null;
  return usage[usage.length - 1];
};

export const getDateRange = (usage: CopilotMetrics[]): { start: string; end: string } | null => {
  if (!usage || usage.length === 0) return null;
  return {
    start: usage[0].date,
    end: usage[usage.length - 1].date,
  };
};

export const getAggregatedMetrics = (usage: CopilotMetrics[]) => {
  if (!usage || usage.length === 0) return null;

  const maxActiveUsers = Math.max(...usage.map((u) => u.total_active_users || 0));
  const maxEngagedUsers = Math.max(...usage.map((u) => u.total_engaged_users || 0));

  let totalSuggestions = 0;
  let totalAcceptances = 0;
  let totalLinesSuggested = 0;
  let totalLinesAccepted = 0;
  let maxCodeCompletionUsers = 0;

  usage.forEach((day) => {
    const daySuggestions =
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum: number, editor) =>
          sum +
          (editor.models?.[0]?.languages?.reduce(
            (langSum: number, lang) => langSum + (lang.total_code_suggestions || 0),
            0
          ) || 0),
        0
      ) || 0;

    const dayAcceptances =
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum: number, editor) =>
          sum +
          (editor.models?.[0]?.languages?.reduce(
            (langSum: number, lang) => langSum + (lang.total_code_acceptances || 0),
            0
          ) || 0),
        0
      ) || 0;

    const dayLinesSuggested =
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum: number, editor) =>
          sum +
          (editor.models?.[0]?.languages?.reduce(
            (langSum: number, lang) => langSum + (lang.total_code_lines_suggested || 0),
            0
          ) || 0),
        0
      ) || 0;

    const dayLinesAccepted =
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum: number, editor) =>
          sum +
          (editor.models?.[0]?.languages?.reduce(
            (langSum: number, lang) => langSum + (lang.total_code_lines_accepted || 0),
            0
          ) || 0),
        0
      ) || 0;

    const dayCodeCompletionUsers = day.copilot_ide_code_completions?.total_engaged_users || 0;

    totalSuggestions += daySuggestions;
    totalAcceptances += dayAcceptances;
    totalLinesSuggested += dayLinesSuggested;
    totalLinesAccepted += dayLinesAccepted;
    maxCodeCompletionUsers = Math.max(maxCodeCompletionUsers, dayCodeCompletionUsers);
  });

  return {
    totalActiveUsers: maxActiveUsers,
    totalEngagedUsers: maxEngagedUsers,
    totalSuggestions,
    totalAcceptances,
    totalLinesSuggested,
    totalLinesAccepted,
    codeCompletionUsers: maxCodeCompletionUsers,
    overallAcceptanceRate: calculateAcceptanceRate(totalAcceptances, totalSuggestions),
    linesAcceptanceRate: calculateAcceptanceRate(totalLinesAccepted, totalLinesSuggested),
  };
};

export const getAggregatedChatStats = (usage: CopilotMetrics[]): ChatStats | null => {
  if (!usage || usage.length === 0) return null;

  let totalChats = 0;
  let totalCopyEvents = 0;
  let totalInsertionEvents = 0;
  let maxIdeUsers = 0;
  let maxDotcomUsers = 0;

  usage.forEach((day) => {
    const ideChat = day.copilot_ide_chat;
    const dotcomChat = day.copilot_dotcom_chat;

    const dayChats =
      (ideChat?.editors?.reduce((sum: number, editor) => sum + (editor.models?.[0]?.total_chats || 0), 0) || 0) +
      (dotcomChat?.models?.[0]?.total_chats || 0);

    const dayCopyEvents =
      ideChat?.editors?.reduce((sum: number, editor) => sum + (editor.models?.[0]?.total_chat_copy_events || 0), 0) ||
      0;

    const dayInsertionEvents =
      ideChat?.editors?.reduce(
        (sum: number, editor) => sum + (editor.models?.[0]?.total_chat_insertion_events || 0),
        0
      ) || 0;

    totalChats += dayChats;
    totalCopyEvents += dayCopyEvents;
    totalInsertionEvents += dayInsertionEvents;
    maxIdeUsers = Math.max(maxIdeUsers, ideChat?.total_engaged_users || 0);
    maxDotcomUsers = Math.max(maxDotcomUsers, dotcomChat?.total_engaged_users || 0);
  });

  return {
    totalChats,
    totalCopyEvents,
    totalInsertionEvents,
    ideUsers: maxIdeUsers,
    dotcomUsers: maxDotcomUsers,
  };
};

export const getAggregatedFeatureAdoption = (usage: CopilotMetrics[]): FeatureAdoptionMetrics | null => {
  if (!usage || usage.length === 0) return null;

  let maxCodeCompletionUsers = 0;
  let maxIdeChatUsers = 0;
  let maxDotcomChatUsers = 0;
  let maxPrSummaryUsers = 0;
  let maxTotalActiveUsers = 0;

  usage.forEach((day) => {
    maxCodeCompletionUsers = Math.max(
      maxCodeCompletionUsers,
      day.copilot_ide_code_completions?.total_engaged_users || 0
    );
    maxIdeChatUsers = Math.max(maxIdeChatUsers, day.copilot_ide_chat?.total_engaged_users || 0);
    maxDotcomChatUsers = Math.max(maxDotcomChatUsers, day.copilot_dotcom_chat?.total_engaged_users || 0);
    maxPrSummaryUsers = Math.max(maxPrSummaryUsers, day.copilot_dotcom_pull_requests?.total_engaged_users || 0);
    maxTotalActiveUsers = Math.max(maxTotalActiveUsers, day.total_active_users || 0);
  });

  return {
    codeCompletionUsers: maxCodeCompletionUsers,
    ideChatUsers: maxIdeChatUsers,
    dotcomChatUsers: maxDotcomChatUsers,
    prSummaryUsers: maxPrSummaryUsers,
    totalActiveUsers: maxTotalActiveUsers,
    adoptionRates: {
      codeCompletion: maxTotalActiveUsers > 0 ? Math.round((maxCodeCompletionUsers / maxTotalActiveUsers) * 100) : 0,
      ideChat: maxTotalActiveUsers > 0 ? Math.round((maxIdeChatUsers / maxTotalActiveUsers) * 100) : 0,
      dotcomChat: maxTotalActiveUsers > 0 ? Math.round((maxDotcomChatUsers / maxTotalActiveUsers) * 100) : 0,
      prSummary: maxTotalActiveUsers > 0 ? Math.round((maxPrSummaryUsers / maxTotalActiveUsers) * 100) : 0,
    },
  };
};

export const getAggregatedPRSummary = (usage: CopilotMetrics[]): PRSummaryMetrics | null => {
  if (!usage || usage.length === 0) return null;

  let maxEngagedUsers = 0;
  let totalPRSummaries = 0;
  const repoMap = new Map<string, { users: number; summaries: number }>();

  usage.forEach((day) => {
    const prData = day.copilot_dotcom_pull_requests;
    if (!prData) return;

    maxEngagedUsers = Math.max(maxEngagedUsers, prData.total_engaged_users || 0);

    prData.repositories?.forEach((repo) => {
      const summaries = repo.models?.[0]?.total_pr_summaries_created || 0;
      totalPRSummaries += summaries;

      const existing = repoMap.get(repo.name || "Unknown") || { users: 0, summaries: 0 };
      existing.users = Math.max(existing.users, repo.total_engaged_users || 0);
      existing.summaries += summaries;
      repoMap.set(repo.name || "Unknown", existing);
    });
  });

  const repositoryStats = Array.from(repoMap.entries())
    .map(([name, data]) => ({
      name,
      users: data.users,
      summaries: data.summaries,
    }))
    .sort((a, b) => b.summaries - a.summaries)
    .slice(0, 10);

  return {
    totalEngagedUsers: maxEngagedUsers,
    totalPRSummaries,
    repositoryStats,
  };
};

export const getTopLanguages = (usage: CopilotMetrics[], limit: number = 5): LanguageData[] => {
  const latestUsage = getLatestUsage(usage);
  if (!latestUsage) return [];

  const languages = latestUsage.copilot_ide_code_completions?.languages || [];

  return languages
    .filter((lang) => (lang.total_engaged_users || 0) > 0)
    .sort((a, b) => (b.total_engaged_users || 0) - (a.total_engaged_users || 0))
    .slice(0, limit)
    .map((lang) => ({
      name: lang.name || "Unknown",
      total_engaged_users: lang.total_engaged_users || 0,
    }));
};

export const getEditorStats = (usage: CopilotMetrics[]): EditorData[] => {
  const latestUsage = getLatestUsage(usage);
  if (!latestUsage) return [];

  const editors = latestUsage.copilot_ide_code_completions?.editors || [];

  return editors
    .map((editor) => {
      const totalAcceptances =
        editor.models?.[0]?.languages?.reduce((sum: number, lang) => sum + (lang.total_code_acceptances || 0), 0) || 0;
      const totalSuggestions =
        editor.models?.[0]?.languages?.reduce((sum: number, lang) => sum + (lang.total_code_suggestions || 0), 0) || 0;

      return {
        name: editor.name || "Unknown",
        users: editor.total_engaged_users || 0,
        acceptances: totalAcceptances,
        suggestions: totalSuggestions,
        acceptanceRate: calculateAcceptanceRate(totalAcceptances, totalSuggestions),
      };
    })
    .sort((a, b) => (b.users || 0) - (a.users || 0));
};

export const getLanguageAcceptanceData = (usage: CopilotMetrics[], languageName: string) => {
  const latestUsage = getLatestUsage(usage);
  if (!latestUsage) return { acceptances: 0, suggestions: 0 };

  const totalAcceptances =
    latestUsage.copilot_ide_code_completions?.editors?.reduce(
      (sum: number, editor) =>
        sum + (editor.models?.[0]?.languages?.find((l) => l.name === languageName)?.total_code_acceptances || 0),
      0
    ) || 0;

  const totalSuggestions =
    latestUsage.copilot_ide_code_completions?.editors?.reduce(
      (sum: number, editor) =>
        sum + (editor.models?.[0]?.languages?.find((l) => l.name === languageName)?.total_code_suggestions || 0),
      0
    ) || 0;

  return { acceptances: totalAcceptances, suggestions: totalSuggestions };
};

export const getModelUsageMetrics = (usage: CopilotMetrics[]): ModelData[] | null => {
  const latestUsage = getLatestUsage(usage);
  if (!latestUsage) return null;

  const models = new Map<string, { users: number; isCustom: boolean; features: string[] }>();

  latestUsage.copilot_ide_code_completions?.editors?.forEach((editor) => {
    editor.models?.forEach((model) => {
      const modelName = model.name || "Unknown";
      const existing = models.get(modelName) || { users: 0, isCustom: false, features: [] };
      existing.users += model.total_engaged_users || 0;
      existing.isCustom = model.is_custom_model || false;
      if (!existing.features.includes("Code Completion")) {
        existing.features.push("Code Completion");
      }
      models.set(modelName, existing);
    });
  });

  latestUsage.copilot_ide_chat?.editors?.forEach((editor) => {
    editor.models?.forEach((model) => {
      const modelName = model.name || "Unknown";
      const existing = models.get(modelName) || { users: 0, isCustom: false, features: [] };
      existing.users += model.total_engaged_users || 0;
      existing.isCustom = model.is_custom_model || false;
      if (!existing.features.includes("IDE Chat")) {
        existing.features.push("IDE Chat");
      }
      models.set(modelName, existing);
    });
  });

  latestUsage.copilot_dotcom_chat?.models?.forEach((model) => {
    const modelName = model.name || "Unknown";
    const existing = models.get(modelName) || { users: 0, isCustom: false, features: [] };
    existing.users += model.total_engaged_users || 0;
    existing.isCustom = model.is_custom_model || false;
    if (!existing.features.includes("GitHub Chat")) {
      existing.features.push("GitHub Chat");
    }
    models.set(modelName, existing);
  });

  return Array.from(models.entries())
    .map(([name, data]) => ({
      name,
      users: data.users,
      isCustom: data.isCustom,
      features: data.features,
    }))
    .sort((a, b) => b.users - a.users);
};
