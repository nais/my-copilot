"use client";

import { CopilotMetrics } from "@/lib/github";
import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import { chartColors, commonLineOptions, chartWrapperClass, NO_DATA_MESSAGE, createGradient } from "@/lib/chart-utils";
import { Heading } from "@navikt/ds-react";

interface LinesOfCodeChartProps {
  usage: CopilotMetrics[];
}

const LinesOfCodeChart: React.FC<LinesOfCodeChartProps> = ({ usage }) => {
  const chartRef = useRef<ChartJS<"line">>(null);
  const hasGradientsRef = useRef(false);

  // Add gradients after mount
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || hasGradientsRef.current || !usage || usage.length === 0) return;

    const ctx = chart.ctx;
    chart.data.datasets[0].backgroundColor = createGradient(ctx, chartColors[0]);
    chart.data.datasets[1].backgroundColor = createGradient(ctx, chartColors[1]);
    chart.update();
    hasGradientsRef.current = true;
  });

  if (!usage || usage.length === 0) {
    return (
      <div className={chartWrapperClass}>
        <div className="text-center text-gray-500 py-8">{NO_DATA_MESSAGE}</div>
      </div>
    );
  }

  // Calculate actual data synchronously
  const labels = usage.map((day) => day.date);

  const suggestedData = usage.map((day) => {
    return (
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum, editor) =>
          sum +
          (editor.models?.reduce(
            (mSum, model) =>
              mSum + (model.languages?.reduce((lSum, lang) => lSum + (lang.total_code_lines_suggested || 0), 0) || 0),
            0
          ) || 0),
        0
      ) || 0
    );
  });

  const acceptedData = usage.map((day) => {
    return (
      day.copilot_ide_code_completions?.editors?.reduce(
        (sum, editor) =>
          sum +
          (editor.models?.reduce(
            (mSum, model) =>
              mSum + (model.languages?.reduce((lSum, lang) => lSum + (lang.total_code_lines_accepted || 0), 0) || 0),
            0
          ) || 0),
        0
      ) || 0
    );
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Foreslåtte linjer",
        data: suggestedData,
        borderColor: chartColors[0],
        backgroundColor: chartColors[0].replace("1)", "0.1)"),
        fill: true,
        tension: 0.4,
      },
      {
        label: "Aksepterte linjer",
        data: acceptedData,
        borderColor: chartColors[1],
        backgroundColor: chartColors[1].replace("1)", "0.1)"),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    ...commonLineOptions,
    plugins: {
      ...commonLineOptions.plugins,
      title: {
        display: true,
        text: "Kodelinjer over tid",
        font: { size: 14 },
      },
    },
  };

  return (
    <div className={chartWrapperClass}>
      <Heading size="small" level="4" className="mb-4">
        Kodelinjer foreslått vs akseptert
      </Heading>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default LinesOfCodeChart;
