import React from 'react';
import { motion } from 'framer-motion';
import {
  Package, Users, Settings, BarChart3, Bell,
  TrendingUp, ArrowUpRight, Shield, Clock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    { 
      label: 'Total Products', 
      value: '1,234', 
      change: '+12.5%',
      trend: 'up',
      icon: Package 
    },
    { 
      label: 'Active Users', 
      value: '56', 
      change: '+3.2%',
      trend: 'up',
      icon: Users 
    },
    { 
      label: 'Low Stock Items', 
      value: '12', 
      change: '-5.1%',
      trend: 'down',
      icon: Bell 
    },
    { 
      label: 'Efficiency', 
      value: '98%', 
      change: '+2.4%',
      trend: 'up',
      icon: BarChart3 
    },
  ];

  return (
    <>
      {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight mb-1">
                Welcome back, {user?.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Here's what's happening with your inventory today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.loginId}
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-white dark:text-gray-900">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* User Info Card - Mobile */}
          <div className="sm:hidden mt-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Role</div>
                <div className="font-medium text-gray-900 dark:text-white">{user?.role}</div>
              </div>
              <div>
                <div className="text-gray-500 dark:text-gray-400 mb-1">Login ID</div>
                <div className="font-medium text-gray-900 dark:text-white">{user?.loginId}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="
                p-6 
                bg-white dark:bg-gray-900 
                border border-gray-200 dark:border-gray-800
                rounded-xl
                hover:border-gray-300 dark:hover:border-gray-700
                transition-colors duration-200
              "
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={2} />
                </div>
                <div className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                  ${stat.trend === 'up' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }
                `}>
                  <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} strokeWidth={2} />
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Role-Based Access */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={2} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Access & Permissions
                </h2>
              </div>

              <div className="space-y-4">
                {user?.role === 'Admin' && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-white dark:text-gray-900" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Administrator Access
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          Full system access including user management, role assignments, system configuration, and all inventory operations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'Inventory Manager' && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="w-4 h-4 text-white dark:text-gray-900" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Manager Access
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          Manage inventory levels, generate reports, oversee stock operations, and coordinate warehouse activities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'Warehouse Staff' && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package className="w-4 h-4 text-white dark:text-gray-900" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          Staff Access
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          View inventory, update stock levels, process shipments, and manage daily warehouse operations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                        Authentication successful
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-400 leading-relaxed">
                        Your authentication system is fully operational with role-based access control.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - User Info & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Account Details */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Account Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white break-all">
                    {user?.email}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Login ID</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.loginId}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Role</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-2">
                <button className="
                  w-full flex items-center justify-between px-4 py-3
                  text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  rounded-lg
                  transition-colors duration-200
                ">
                  <span>View Inventory</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </button>
                
                <button className="
                  w-full flex items-center justify-between px-4 py-3
                  text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  rounded-lg
                  transition-colors duration-200
                ">
                  <span>Generate Report</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </button>
                
                <button className="
                  w-full flex items-center justify-between px-4 py-3
                  text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-800
                  rounded-lg
                  transition-colors duration-200
                ">
                  <span>Settings</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Last login: Just now</p>
              </div>
            </div>
          </motion.div>
        </div>
    </>
  );
};