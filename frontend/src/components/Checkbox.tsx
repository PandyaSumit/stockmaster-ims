import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'w-5 h-5 rounded-md border-2 transition-all duration-300',
              'border-gray-300 dark:border-gray-600',
              'peer-checked:bg-gradient-primary peer-checked:border-transparent',
              'peer-focus:ring-4 peer-focus:ring-primary-500/20',
              'group-hover:border-primary-400',
              className
            )}
          >
            <svg
              className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>

        {label && (
          <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
