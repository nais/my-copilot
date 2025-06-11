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

interface EditorsChartProps {
  usage: CopilotMetrics[];
}

const EditorsChart: React.FC<EditorsChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return <div className={chartWrapperClass}>
      <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
    </div>;
  }

  const labels = usage.map((dayUsage) => dayUsage.date);

  // Get all unique editors across all time periods
  const allEditors = new Set<string>();
  usage.forEach(dayUsage => {
    dayUsage.copilot_ide_code_completions?.editors?.forEach(editor => {
      if (editor.name) allEditors.add(editor.name);
    });
  });

  const editorList = Array.from(allEditors);

  if (editorList.length === 0) {
    return <div className={chartWrapperClass}>
      <div className="text-center text-gray-500 py-8">Ingen editor data tilgjengelig for visning</div>
    </div>;
  }

  const datasets = editorList.map((editorName, index) => ({
    label: editorName,
    data: usage.map(dayUsage => {
      const editor = dayUsage.copilot_ide_code_completions?.editors?.find(e => e.name === editorName);
      return editor?.total_engaged_users || 0;
    }),
    borderColor: chartColors[index % chartColors.length],
    backgroundColor: getBackgroundColor(chartColors[index % chartColors.length]),
    tension: 0.4,
  }));

  const editorChartData = {
    labels,
    datasets,
  };

  const lineOptions = {
    ...commonLineOptions,
    plugins: {
      ...commonLineOptions.plugins,
      title: {
        display: true,
        text: 'Editor bruk over tid',
      },
    },
  };

  return (
    <div className={chartWrapperClass}>
      <Line data={editorChartData} options={lineOptions} />
    </div>
  );
};

export default EditorsChart;
