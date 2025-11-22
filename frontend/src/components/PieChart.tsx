import React from 'react';
import { ChartDataPoint } from '../types/dashboard';
import { motion } from 'framer-motion';

interface PieChartProps {
  data: ChartDataPoint[];
  title: string;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return slice;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{title}</h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice, index) => {
              const radius = size / 2 - 10;
              const centerX = size / 2;
              const centerY = size / 2;

              const startRad = (slice.startAngle * Math.PI) / 180;
              const endRad = (slice.endAngle * Math.PI) / 180;

              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);

              const largeArc = slice.percentage > 50 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ');

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={slice.color || `hsl(${index * 60}, 70%, 50%)`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>{`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}</title>
                </motion.path>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: slice.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{slice.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {slice.value} ({slice.percentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
