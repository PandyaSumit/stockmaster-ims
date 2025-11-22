import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useSidebarStore } from '../store/sidebarStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Header: React.FC = () => {
  const { toggleSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'USB-C Cable 2m is running low', time: '5 min ago', type: 'warning' },
    { id: 2, title: 'New Receipt', message: 'Receipt #R-001 has been created', time: '1 hour ago', type: 'info' },
    { id: 3, title: 'Delivery Complete', message: 'Delivery #D-045 completed successfully', time: '2 hours ago', type: 'success' },
  ];

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo - Mobile Only */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-bold text-base text-gray-900 dark:text-white">StockMaster</span>
          </div>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, orders..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search Icon - Mobile Only */}
          <button
            className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                        >
                          <div className="flex gap-3">
                            <div className={clsx(
                              "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                              notification.type === 'warning' && "bg-warning-500",
                              notification.type === 'info' && "bg-primary-500",
                              notification.type === 'success' && "bg-success-500"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={clsx(
                "flex items-center gap-2 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200",
                showProfileDropdown && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || 'Role'}
                </p>
              </div>
              <ChevronDown className={clsx(
                "hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200",
                showProfileDropdown && "rotate-180"
              )} />
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'email@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">My Profile</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors text-error-600 dark:text-error-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
