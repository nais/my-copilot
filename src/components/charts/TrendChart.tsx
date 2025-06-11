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

interface TrendChartProps {
  usage: CopilotMetrics[];
}

const TrendChart: React.FC<TrendChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return <div className={chartWrapperClass}>
      <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
    </div>;
  }

  const labels = usage.map((dayUsage) => dayUsage.date);

  const trendData = {
    labels,
    datasets: [
      {
        label: 'Totalt aktive brukere',
        data: usage.map((dayUsage) => dayUsage.total_active_users),
        borderColor: chartColors[0],
        backgroundColor: getBackgroundColor(chartColors[0]),
        tension: 0.4,
      },
      {
        label: 'Engasjerte brukere',
        data: usage.map((dayUsage) => dayUsage.total_engaged_users),
        borderColor: chartColors[1],
        backgroundColor: getBackgroundColor(chartColors[1]),
        tension: 0.4,
      },
      {
        label: 'Kodeforslag brukere',
        data: usage.map((dayUsage) => dayUsage.copilot_ide_code_completions?.total_engaged_users || 0),
        borderColor: chartColors[2],
        backgroundColor: getBackgroundColor(chartColors[2]),
        tension: 0.4,
      },
      {
        label: 'Chat brukere (IDE)',
        data: usage.map((dayUsage) => dayUsage.copilot_ide_chat?.total_engaged_users || 0),
        borderColor: chartColors[3],
        backgroundColor: getBackgroundColor(chartColors[3]),
        tension: 0.4,
      },
    ],
  };

  const trendOptions = {
    ...commonLineOptions,
    plugins: {
      ...commonLineOptions.plugins,
      title: {
        display: true,
        text: 'Brukertrend over tid',
      },
    },
  };

  return (
    <div className={chartWrapperClass}>
      <Line data={trendData} options={trendOptions} />
    </div>
  );
};

export default TrendChart;
