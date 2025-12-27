"use client";

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { chartColors, commonDonutOptions, chartWrapperClass, NO_DATA_MESSAGE } from "@/lib/chart-utils";
import { Heading } from "@navikt/ds-react";
import { TooltipItem } from "chart.js";

interface ModelUsageChartProps {
  usage: CopilotMetrics[];
}

interface ModelStats {
  name: string;
  users: number;
}

const ModelUsageChart: React.FC<ModelUsageChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return (
      <div className={chartWrapperClass}>
        <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
      </div>
    );
  }

  // Aggregate model usage across all days
  const modelMap = new Map<string, number>();

  usage.forEach((day) => {
    // IDE code completions models
    day.copilot_ide_code_completions?.editors?.forEach((editor) => {
      editor.models?.forEach((model) => {
        const name = model.name || "default";
        const current = modelMap.get(name) || 0;
        modelMap.set(name, Math.max(current, model.total_engaged_users || 0));
      });
    });

    // IDE chat models
    day.copilot_ide_chat?.editors?.forEach((editor) => {
      editor.models?.forEach((model) => {
        const name = model.name || "default";
        const current = modelMap.get(name) || 0;
        modelMap.set(name, Math.max(current, model.total_engaged_users || 0));
      });
    });

    // Dotcom chat models
    day.copilot_dotcom_chat?.models?.forEach((model) => {
      const name = model.name || "default";
      const current = modelMap.get(name) || 0;
      modelMap.set(name, Math.max(current, model.total_engaged_users || 0));
    });
  });

  const modelStats: ModelStats[] = Array.from(modelMap.entries())
    .map(([name, users]) => ({ name, users }))
    .filter((m) => m.users > 0)
    .sort((a, b) => b.users - a.users)
    .slice(0, 6);

  if (modelStats.length === 0) {
    return (
      <div className={chartWrapperClass}>
        <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
      </div>
    );
  }

  const total = modelStats.reduce((sum, m) => sum + m.users, 0);

  const data = {
    labels: modelStats.map((m) => m.name),
    datasets: [
      {
        data: modelStats.map((m) => m.users),
        backgroundColor: modelStats.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: modelStats.map((_, i) => chartColors[i % chartColors.length]),
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
        Modellbruk
      </Heading>
      <div className="max-w-md mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default ModelUsageChart;
