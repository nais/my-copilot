'use client';

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Line } from 'react-chartjs-2';
import {
  chartColors,
  getBackgroundColor,
  commonLineOptions,
  chartWrapperClass,
  NO_DATA_MESSAGE
} from "@/lib/chart-utils";
import { getLatestUsage } from "@/lib/data-utils";

interface LanguagesChartProps {
  usage: CopilotMetrics[];
}

const LanguagesChart: React.FC<LanguagesChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return <div className={chartWrapperClass}>
      <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
    </div>;
  }

  const labels = usage.map((dayUsage) => dayUsage.date);

  // Get all unique languages across all time periods, then find the top ones from latest data
  const latestUsage = getLatestUsage(usage);
  const allLanguages = latestUsage?.copilot_ide_code_completions?.languages || [];

  // Get top 8 languages by user count from latest data
  const topLanguages = allLanguages
    .sort((a, b) => (b.total_engaged_users || 0) - (a.total_engaged_users || 0))
    .slice(0, 8)
    .map(lang => lang.name)
    .filter(name => name);

  if (topLanguages.length === 0) {
    return <div className={chartWrapperClass}>
      <div className="text-center text-gray-500 py-8">Ingen språkdata tilgjengelig for visning</div>
    </div>;
  }

  const datasets = topLanguages.map((languageName, index) => ({
    label: languageName,
    data: usage.map(dayUsage => {
      const language = dayUsage.copilot_ide_code_completions?.languages?.find(lang => lang.name === languageName);
      return language?.total_engaged_users || 0;
    }),
    borderColor: chartColors[index % chartColors.length],
    backgroundColor: getBackgroundColor(chartColors[index % chartColors.length]),
    tension: 0.4,
  }));

  const languageChartData = {
    labels,
    datasets,
  };

  const lineOptions = {
    ...commonLineOptions,
    plugins: {
      ...commonLineOptions.plugins,
      title: {
        display: true,
        text: 'Topp programmeringsspråk over tid',
      },
    },
  };

  return (
    <div className={chartWrapperClass}>
      <Line data={languageChartData} options={lineOptions} />
    </div>
  );
};

export default LanguagesChart;
