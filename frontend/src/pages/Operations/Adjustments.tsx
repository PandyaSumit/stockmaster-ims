import React from 'react';
import { Edit3 } from 'lucide-react';

export const Adjustments: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-warning-600 dark:text-warning-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Adjustment</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Make manual inventory adjustments for stock corrections and reconciliation.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-8">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Inventory adjustment interface coming soon...
        </p>
      </div>
    </div>
  );
};
