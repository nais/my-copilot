import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";

// Register Chart.js components once
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

// Shared color palette
export const chartColors = [
  "rgba(59, 130, 246, 1)", // blue
  "rgba(16, 185, 129, 1)", // green
  "rgba(139, 92, 246, 1)", // purple
  "rgba(245, 158, 11, 1)", // amber
  "rgba(239, 68, 68, 1)", // red
  "rgba(107, 114, 128, 1)", // gray
  "rgba(236, 72, 153, 1)", // pink
  "rgba(6, 182, 212, 1)", // cyan
];

// Helper to get background color with opacity
export const getBackgroundColor = (color: string, opacity: number = 0.1): string => {
  return color.replace("1)", `${opacity})`);
};

// Common chart options
export const commonLineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Common chart wrapper styling
export const chartWrapperClass = "bg-white p-4 rounded-lg border border-gray-200";

// Default no data message
export const NO_DATA_MESSAGE = "Ingen data tilgjengelig for visning";
