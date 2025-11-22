import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
    error: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
        colorClasses[color]
      )}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity focus:outline-none"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

interface FilterChipsProps {
  filters: Array<{ id: string; label: string; color?: 'primary' | 'success' | 'warning' | 'error' }>;
  onRemove: (id: string) => void;
  onClearAll?: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence>
        {filters.map((filter) => (
          <FilterChip key={filter.id} label={filter.label} color={filter.color} onRemove={() => onRemove(filter.id)} />
        ))}
      </AnimatePresence>

      {filters.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};
