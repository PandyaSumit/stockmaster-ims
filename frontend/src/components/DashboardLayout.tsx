import React from 'react';
import { Menu } from 'lucide-react';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          'lg:ml-64', // Default margin for expanded sidebar on desktop
          isCollapsed && 'lg:ml-20' // Reduced margin for collapsed sidebar on desktop
        )}
      >
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden sticky top-0 z-20 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">StockMaster</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
