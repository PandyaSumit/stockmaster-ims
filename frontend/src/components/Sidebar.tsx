import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, X, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useSidebarStore } from '../store/sidebarStore';
import { useAuthStore } from '../store/authStore';
import { getFilteredNavigation } from '../config/navigation';
import { NavigationItem, NavigationSubItem } from '../types/navigation';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, isCollapsed, expandedItems, toggleCollapsed, toggleExpanded, closeSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Get filtered navigation based on user role
  const navigationItems = user ? getFilteredNavigation(user.role) : [];

  // Auto-expand parent if child is active
  useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => location.pathname === child.path);
        if (hasActiveChild && !expandedItems.includes(item.id)) {
          toggleExpanded(item.id);
        }
      }
    });
  }, [location.pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const isItemActive = (item: NavigationItem | NavigationSubItem) => {
    return location.pathname === item.path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderNavItem = (item: NavigationItem) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item);
    const Icon = item.icon;

    if (item.isExpandable && item.children) {
      return (
        <div key={item.id} className="mb-1">
          {/* Parent Item */}
          <button
            onClick={() => toggleExpanded(item.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </>
            )}
          </button>

          {/* Children Items */}
          <AnimatePresence>
            {isExpanded && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {item.children.map((child) => renderSubItem(child))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Regular navigation item
    return (
      <Link
        key={item.id}
        to={item.path || '#'}
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200',
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.badge && (
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  item.badgeVariant === 'primary' && 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
                  item.badgeVariant === 'warning' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
                  item.badgeVariant === 'success' && 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
                  item.badgeVariant === 'error' && 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300',
                  !item.badgeVariant && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const renderSubItem = (item: NavigationSubItem) => {
    const isActive = isItemActive(item);

    return (
      <Link
        key={item.id}
        to={item.path}
        className={clsx(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        )}
      >
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="flex-1 text-sm">{item.label}</span>
        {item.badge && (
          <span
            className={clsx(
              'px-2 py-0.5 rounded-full text-xs font-semibold',
              item.badgeVariant === 'primary' && 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
              item.badgeVariant === 'warning' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
              item.badgeVariant === 'success' && 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
              item.badgeVariant === 'error' && 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300',
              !item.badgeVariant && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">StockMaster</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">SM</span>
          </div>
        )}
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigationItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3">
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.role || 'Role'}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </>
            )}
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileDropdown && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors text-error-600 dark:text-error-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex items-center justify-center w-full mt-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          'hidden lg:block fixed left-0 top-0 h-screen transition-all duration-300 z-30',
          isCollapsed ? 'w-20' : 'w-64',
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
