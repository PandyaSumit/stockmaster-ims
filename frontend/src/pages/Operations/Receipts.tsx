import React from 'react';
import { PackagePlus } from 'lucide-react';

export const Receipts: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
            <PackagePlus className="w-5 h-5 text-success-600 dark:text-success-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receipts (Incoming)</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage incoming stock receipts and track deliveries from suppliers.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 p-8">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Receipts management interface coming soon...
        </p>
      </div>
    </div>
  );
};
