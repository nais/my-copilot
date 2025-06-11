'use client';

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AcceptanceRateChartProps {
  usage: CopilotMetrics[];
}

const AcceptanceRateChart: React.FC<AcceptanceRateChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return <div>Ingen data tilgjengelig for visning</div>;
  }

  const labels = usage.map((dayUsage) => dayUsage.date);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Aksepteringsrate over tid</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Aksepteringsrate (%)',
              data: usage.map((dayUsage) => {
                const totalAcceptances = dayUsage.copilot_ide_code_completions?.editors?.reduce((sum, editor) =>
                  sum + (editor.models?.[0]?.languages?.reduce((langSum, lang) =>
                    langSum + (lang.total_code_acceptances || 0), 0) || 0), 0) || 0;
                const totalSuggestions = dayUsage.copilot_ide_code_completions?.editors?.reduce((sum, editor) =>
                  sum + (editor.models?.[0]?.languages?.reduce((langSum, lang) =>
                    langSum + (lang.total_code_suggestions || 0), 0) || 0), 0) || 0;
                return totalSuggestions > 0 ? Math.round((totalAcceptances / totalSuggestions) * 100) : 0;
              }),
              borderColor: 'rgba(16, 185, 129, 1)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            },
          },
        }}
      />
    </div>
  );
};

export default AcceptanceRateChart;
