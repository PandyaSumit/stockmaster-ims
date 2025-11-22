import React, { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, children, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative group">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 pr-10
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              text-sm
              appearance-none
              border 
              ${error 
                ? 'border-red-300 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary-600 focus:ring-primary-600/20'
              }
              rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-4
              disabled:bg-gray-50 dark:disabled:bg-gray-900/50
              disabled:text-gray-500 dark:disabled:text-gray-600
              disabled:cursor-not-allowed
              cursor-pointer
              ${className}
            `}
            {...props}
          >
            {options ? (
              options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            ) : (
              children
            )}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {(error || helperText) && (
          <div className="mt-2 text-xs">
            {error ? (
              <p className="text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';