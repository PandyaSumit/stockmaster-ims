import React from 'react';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebarStore } from '../store/sidebarStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64' // Adjust margin based on sidebar state
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
