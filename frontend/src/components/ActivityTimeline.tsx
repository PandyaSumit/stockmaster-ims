import React from 'react';
import { motion } from 'framer-motion';
import { Package, TruckIcon, ArrowRightLeft, Edit3, Clock } from 'lucide-react';
import { StockActivity } from '../types/dashboard';
import clsx from 'clsx';

interface ActivityTimelineProps {
  activities: StockActivity[];
  maxItems?: number;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, maxItems = 10 }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Receipt':
        return Package;
      case 'Delivery':
        return TruckIcon;
      case 'InternalTransfer':
        return ArrowRightLeft;
      case 'Adjustment':
        return Edit3;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-success-600';
      case 'Ready':
        return 'bg-primary-600';
      case 'Waiting':
        return 'bg-warning-500';
      case 'Draft':
        return 'bg-gray-400';
      case 'Canceled':
        return 'bg-error-600';
      default:
        return 'bg-gray-400';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {displayedActivities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          const timeAgo = formatTimeAgo(activity.createdAt);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4"
            >
              {/* Icon with status indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className={clsx('absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800', getStatusColor(activity.status))} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.type} - {activity.product}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {activity.warehouse} • Qty: {activity.quantity > 0 ? '+' : ''}{activity.quantity}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{timeAgo}</span>
                </div>

                {/* Status badge */}
                <div className="mt-2">
                  <span
                    className={clsx(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                      activity.status === 'Done' && 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
                      activity.status === 'Ready' && 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
                      activity.status === 'Waiting' && 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
                      activity.status === 'Draft' && 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                      activity.status === 'Canceled' && 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300'
                    )}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
          </div>
        )}

        {activities.length > maxItems && (
          <button className="w-full text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-2">
            View all activity ({activities.length})
          </button>
        )}
      </div>
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}
