'use client';

import { CopilotMetrics } from "@/lib/github";
import React from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChatChartProps {
  usage: CopilotMetrics[];
}

const ChatChart: React.FC<ChatChartProps> = ({ usage }) => {
  if (!usage || usage.length === 0) {
    return <div>Ingen data tilgjengelig for visning</div>;
  }

  const latestUsage = usage[usage.length - 1];
  const chatEditors = latestUsage.copilot_ide_chat?.editors || [];

  if (chatEditors.length === 0) {
    return <div>Ingen chat data tilgjengelig for visning</div>;
  }

  // Chat metrics data
  const chatData = {
    labels: chatEditors.map(editor => editor.name || 'Unknown'),
    datasets: [
      {
        label: 'Chat brukere',
        data: chatEditors.map(editor => editor.total_engaged_users || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Totalt antall chats',
        data: chatEditors.map(editor => editor.models?.[0]?.total_chats || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'Kopieringshendelser',
        data: chatEditors.map(editor => editor.models?.[0]?.total_chat_copy_events || 0),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Innsettingshendelser',
        data: chatEditors.map(editor => editor.models?.[0]?.total_chat_insertion_events || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chat aktivitet per editor',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <Bar data={chatData} options={barOptions} />
    </div>
  );
};

export default ChatChart;
