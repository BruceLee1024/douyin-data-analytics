import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
    }[];
  };
  title: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#111827',
        font: {
          size: 16,
          weight: 700,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          },
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
          color: '#f3f4f6',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div style={{ height: `${height}px` }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;