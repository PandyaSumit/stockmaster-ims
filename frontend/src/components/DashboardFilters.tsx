import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Calendar } from 'lucide-react';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { DocumentType, DocumentStatus, DashboardFilters } from '../types/dashboard';
import clsx from 'clsx';

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  warehouses: string[];
  categories: string[];
}

export const DashboardFiltersPanel: React.FC<DashboardFiltersProps> = ({
  filters,
  onFiltersChange,
  warehouses,
  categories,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const documentTypes: DocumentType[] = ['Receipt', 'Delivery', 'InternalTransfer', 'Adjustment'];
  const statuses: DocumentStatus[] = ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'];

  const toggleDocumentType = (type: DocumentType) => {
    const newTypes = filters.documentTypes.includes(type)
      ? filters.documentTypes.filter((t) => t !== type)
      : [...filters.documentTypes, type];

    onFiltersChange({ ...filters, documentTypes: newTypes });
  };

  const toggleStatus = (status: DocumentStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];

    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const toggleWarehouse = (warehouse: string) => {
    const newWarehouses = filters.warehouses.includes(warehouse)
      ? filters.warehouses.filter((w) => w !== warehouse)
      : [...filters.warehouses, warehouse];

    onFiltersChange({ ...filters, warehouses: newWarehouses });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      documentTypes: [],
      statuses: [],
      warehouses: [],
      categories: [],
      dateRange: { start: null, end: null },
    });
  };

  const activeFilterCount =
    filters.documentTypes.length +
    filters.statuses.length +
    filters.warehouses.length +
    filters.categories.length +
    (filters.dateRange.start ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isExpanded && 'transform rotate-180'
          )}
        />
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-6 border-t border-gray-200 dark:border-gray-700">
              {/* Document Types */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Document Type</h4>
                <div className="space-y-2">
                  {documentTypes.map((type) => (
                    <Checkbox
                      key={type}
                      label={type}
                      checked={filters.documentTypes.includes(type)}
                      onChange={() => toggleDocumentType(type)}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Status</h4>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <Checkbox
                      key={status}
                      label={status}
                      checked={filters.statuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                  ))}
                </div>
              </div>

              {/* Warehouses */}
              {warehouses.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Warehouse/Location</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {warehouses.map((warehouse) => (
                      <Checkbox
                        key={warehouse}
                        label={warehouse}
                        checked={filters.warehouses.includes(warehouse)}
                        onChange={() => toggleWarehouse(warehouse)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Product Category</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <Checkbox
                        key={category}
                        label={category}
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Date Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.dateRange.start ? filters.dateRange.start.toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, start: e.target.value ? new Date(e.target.value) : null },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-4 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.dateRange.end ? filters.dateRange.end.toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, end: e.target.value ? new Date(e.target.value) : null },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-4 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {activeFilterCount > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm" fullWidth onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
