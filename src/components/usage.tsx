'use client';

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UsageChartProps {
  usage: CopilotMetrics[];
}

const UsageChart: React.FC<UsageChartProps> = ({ usage }) => {
  const labels = usage ? usage.map((dayUsage) => dayUsage.date) : [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Totale Aktive Brukere',
        data: usage ? usage.map((dayUsage) => dayUsage.total_active_users) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Totale Engasjerte Brukere',
        data: usage ? usage.map((dayUsage) => dayUsage.total_engaged_users) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Totale Kodeforslag',
        data: usage ? usage.map((dayUsage) => dayUsage.copilot_ide_code_completions?.total_engaged_users) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Totale Chatbrukere (editor)',
        data: usage ? usage.map((dayUsage) => dayUsage.copilot_ide_chat?.total_engaged_users) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Totale Chatbrukere (github.com)',
        data: usage ? usage.map((dayUsage) => dayUsage.copilot_dotcom_chat?.total_engaged_users) : [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Totale Pull Request',
        data: usage ? usage.map((dayUsage) => dayUsage.copilot_dotcom_pull_requests?.total_engaged_users) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
};

export default UsageChart;
