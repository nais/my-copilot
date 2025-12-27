"use client";

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { chartColors, commonDonutOptions, chartWrapperClass, NO_DATA_MESSAGE } from "@/lib/chart-utils";
import { Heading } from "@navikt/ds-react";
import { TooltipItem } from "chart.js";

interface LanguageDistributionChartProps {
  usage: CopilotMetrics[];
}

const LanguageDistributionChart: React.FC<LanguageDistributionChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return (
      <div className={chartWrapperClass}>
        <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
      </div>
    );
  }

  // Get latest day's language data
  const latestUsage = usage[usage.length - 1];
  const languages = latestUsage.copilot_ide_code_completions?.languages || [];

  const sortedLanguages = languages
    .filter((lang) => (lang.total_engaged_users || 0) > 0)
    .sort((a, b) => (b.total_engaged_users || 0) - (a.total_engaged_users || 0))
    .slice(0, 8);

  if (sortedLanguages.length === 0) {
    return (
      <div className={chartWrapperClass}>
        <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
      </div>
    );
  }

  const total = sortedLanguages.reduce((sum, lang) => sum + (lang.total_engaged_users || 0), 0);

  const data = {
    labels: sortedLanguages.map((lang) => lang.name || "Unknown"),
    datasets: [
      {
        data: sortedLanguages.map((lang) => lang.total_engaged_users || 0),
        backgroundColor: sortedLanguages.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: sortedLanguages.map((_, i) => chartColors[i % chartColors.length]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    ...commonDonutOptions,
    plugins: {
      ...commonDonutOptions.plugins,
      tooltip: {
        ...commonDonutOptions.plugins.tooltip,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} brukere (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={chartWrapperClass}>
      <Heading size="small" level="4" className="mb-4">
        Språkfordeling
      </Heading>
      <div className="max-w-md mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default LanguageDistributionChart;
