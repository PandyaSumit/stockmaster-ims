import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, Users, Settings, BarChart3, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import { ThemeToggle } from '../components/ThemeToggle';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const stats = [
    { label: 'Total Products', value: '1,234', icon: Package, color: 'bg-blue-500' },
    { label: 'Total Users', value: '56', icon: Users, color: 'bg-green-500' },
    { label: 'Low Stock', value: '12', icon: Bell, color: 'bg-orange-500' },
    { label: 'Analytics', value: '98%', icon: BarChart3, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  StockMaster IMS
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inventory Management System
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft-lg border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Role: <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.role}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Email: {user?.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Login ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.loginId}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-soft border border-white/20 dark:border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-soft`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {stat.label}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Role-Based Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-soft-lg border border-white/20 dark:border-gray-700/50"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Role-Based Access
            </h2>
          </div>

          <div className="space-y-4">
            {user?.role === 'Admin' && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Admin Access
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  You have full access to all features including user management, role assignment, and system settings.
                </p>
              </div>
            )}

            {user?.role === 'Inventory Manager' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Inventory Manager Access
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  You can manage inventory, view reports, and handle stock operations.
                </p>
              </div>
            )}

            {user?.role === 'Warehouse Staff' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  Warehouse Staff Access
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  You can view inventory, update stock levels, and manage shipments.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🎉 <strong>Authentication successful!</strong> Your user authentication system is now fully functional with role-based access control.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
