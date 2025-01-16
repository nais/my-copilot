'use client';

import { CopilotUsage } from "@/lib/github";
import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface UsageChartProps {
  usage: CopilotUsage[];
}

const UsageChart: React.FC<UsageChartProps> = ({ usage }) => {
  const labels = usage ? usage.map((dayUsage) => dayUsage.day) : [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Suggestions',
        data: usage ? usage.map((dayUsage) => dayUsage.total_suggestions_count) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Total Acceptances',
        data: usage ? usage.map((dayUsage) => dayUsage.total_acceptances_count) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Total Lines Suggested',
        data: usage ? usage.map((dayUsage) => dayUsage.total_lines_suggested) : [],
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Total Lines Accepted',
        data: usage ? usage.map((dayUsage) => dayUsage.total_lines_accepted) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Total Active Users',
        data: usage ? usage.map((dayUsage) => dayUsage.total_active_users) : [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
      {
        label: 'Total Chat Acceptances',
        data: usage ? usage.map((dayUsage) => dayUsage.total_chat_acceptances) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Total Chat Turns',
        data: usage ? usage.map((dayUsage) => dayUsage.total_chat_turns) : [],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'Total Active Chat Users',
        data: usage ? usage.map((dayUsage) => dayUsage.total_active_chat_users) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
};

export default UsageChart;