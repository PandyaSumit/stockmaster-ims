import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ReorderRule {
  _id: string;
  name: string;
  sku: string;
  category: {
    _id: string;
    name: string;
  };
  warehouse?: {
    _id: string;
    name: string;
    code: string;
  };
  currentStock: number;
  reorderLevel: number;
  maxStockLevel: number | null;
  autoReorderEnabled: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  suggestedOrderQty: number;
}

export const ReorderRules: React.FC = () => {
  const [products, setProducts] = useState<ReorderRule[]>([]);
  const [suggestions, setSuggestions] = useState<ReorderRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Record<string, Partial<ReorderRule>>>({});

  useEffect(() => {
    fetchReorderRules();
    fetchPurchaseSuggestions();
  }, []);

  const fetchReorderRules = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/reorder-rules`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching reorder rules:', error);
      toast.error('Failed to load reorder rules');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPurchaseSuggestions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/purchase-suggestions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuggestions(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching purchase suggestions:', error);
    }
  };

  const handleFieldChange = (
    productId: string,
    field: keyof ReorderRule,
    value: number | boolean
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSaveProduct = async (productId: string) => {
    if (!editedProducts[productId]) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('accessToken');
      const updates = editedProducts[productId];

      await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${productId}/reorder-rule`,
        updates,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Reorder rule updated successfully');

      // Remove from edited products
      setEditedProducts((prev) => {
        const newEdited = { ...prev };
        delete newEdited[productId];
        return newEdited;
      });

      // Refresh data
      await fetchReorderRules();
      await fetchPurchaseSuggestions();
    } catch (error: any) {
      console.error('Error updating reorder rule:', error);
      toast.error(error.response?.data?.message || 'Failed to update reorder rule');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400';
      case 'low_stock':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400';
      case 'out_of_stock':
        return 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const getValue = (product: ReorderRule, field: keyof ReorderRule) => {
    if (editedProducts[product._id] && editedProducts[product._id][field] !== undefined) {
      return editedProducts[product._id][field];
    }
    return product[field];
  };

  const hasChanges = (productId: string) => {
    return editedProducts[productId] && Object.keys(editedProducts[productId]).length > 0;
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Reordering Rules
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure automatic reordering rules for inventory management
            </p>
          </div>
        </div>
      </motion.div>

      {/* Purchase Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-800/30 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-warning-900 dark:text-warning-300 mb-1">
                Purchase Suggestions
              </h3>
              <p className="text-sm text-warning-800 dark:text-warning-400 mb-3">
                {suggestions.length} product(s) need reordering
              </p>
              <div className="space-y-2">
                {suggestions.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between text-sm bg-white dark:bg-gray-900 rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Current: {product.currentStock} | Reorder: {product.reorderLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Suggested Order
                      </div>
                      <div className="font-semibold text-warning-700 dark:text-warning-400">
                        {product.suggestedOrderQty}
                      </div>
                    </div>
                  </div>
                ))}
                {suggestions.length > 5 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center pt-2">
                    +{suggestions.length - 5} more products
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reorder Rules Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading reorder rules...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <RefreshCw className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Add products to manage reordering rules
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Max Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Auto Reorder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map((product) => {
                  const isEdited = hasChanges(product._id);
                  return (
                    <tr
                      key={product._id}
                      className={`transition-colors ${
                        isEdited
                          ? 'bg-primary-50/50 dark:bg-primary-900/10'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {product.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {product.category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {product.currentStock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={getValue(product, 'reorderLevel') as number}
                          onChange={(e) =>
                            handleFieldChange(product._id, 'reorderLevel', parseInt(e.target.value) || 0)
                          }
                          min="0"
                          className="w-24 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={getValue(product, 'maxStockLevel') as number || ''}
                          onChange={(e) =>
                            handleFieldChange(
                              product._id,
                              'maxStockLevel',
                              e.target.value ? parseInt(e.target.value) : 0
                            )
                          }
                          min="0"
                          className="w-24 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getValue(product, 'autoReorderEnabled') as boolean}
                            onChange={(e) =>
                              handleFieldChange(product._id, 'autoReorderEnabled', e.target.checked)
                            }
                            className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                            product.stockStatus
                          )}`}
                        >
                          {getStatusText(product.stockStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {isEdited && (
                          <button
                            onClick={() => handleSaveProduct(product._id)}
                            disabled={isSaving}
                            className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Save changes"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};
