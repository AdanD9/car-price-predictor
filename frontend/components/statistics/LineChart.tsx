'use client';

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
  options?: any;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ 
  title, 
  data, 
  options = {}, 
  height = 400 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (typeof value === 'number') {
              return value.toLocaleString();
            }
            return value;
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    ...options,
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div style={{ height: `${height}px` }}>
          <Line data={data} options={defaultOptions} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
