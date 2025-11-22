import React from 'react';
import { motion } from 'framer-motion';
import { ChartDataPoint } from '../types/dashboard';
import clsx from 'clsx';

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, height = 300 }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{title}</h3>

      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="absolute left-14 right-0 top-0 bottom-8 flex items-end justify-around gap-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={clsx(
                    'w-full rounded-t-lg relative group',
                    item.color || 'bg-primary-600'
                  )}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.value}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-14 right-0 bottom-0 h-8 flex items-start justify-around gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate block">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
