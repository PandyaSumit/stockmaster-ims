import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package, Upload, Sparkles, Loader2, ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
}

interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: {
    city: string;
    state: string;
  };
}

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  currentStock: number;
  reorderLevel: number;
  maxStockLevel: number | null;
  autoReorderEnabled: boolean;
  imageUrl: string;
  description: string;
  warehouse: string;
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  category: '',
  unitOfMeasure: 'pieces',
  currentStock: 0,
  reorderLevel: 0,
  maxStockLevel: null,
  autoReorderEnabled: false,
  imageUrl: '',
  description: '',
  warehouse: '',
};

const unitOfMeasureOptions = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'grams', label: 'Grams (g)' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'packs', label: 'Packs' },
  { value: 'meters', label: 'Meters (m)' },
  { value: 'cm', label: 'Centimeters (cm)' },
];

export const ManageProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Fetch categories and warehouses on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      fetchProductData(productId);
    }
  }, [isEditMode, productId]);

  const fetchInitialData = async () => {
    try {
      setIsFetchingData(true);
      const token = localStorage.getItem('accessToken');

      const [categoriesRes, warehousesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        // Assuming warehouse endpoint exists (will be created later)
        axios.get(`${import.meta.env.VITE_API_URL}/warehouses`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })), // Fallback if warehouses endpoint doesn't exist yet
      ]);

      setCategories(categoriesRes.data.data || []);
      setWarehouses(warehousesRes.data.data || []);
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load categories and warehouses');
    } finally {
      setIsFetchingData(false);
    }
  };

  const fetchProductData = async (id: string) => {
    try {
      setIsFetchingData(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const product = response.data.data;
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category._id,
        unitOfMeasure: product.unitOfMeasure,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel,
        maxStockLevel: product.maxStockLevel,
        autoReorderEnabled: product.autoReorderEnabled,
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        warehouse: product.warehouse?._id || '',
      });
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product data');
      navigate('/products/manage');
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleGenerateSKU = async () => {
    try {
      setIsGeneratingSKU(true);
      const token = localStorage.getItem('accessToken');
      const url = formData.category
        ? `${import.meta.env.VITE_API_URL}/products/generate-sku?categoryId=${formData.category}`
        : `${import.meta.env.VITE_API_URL}/products/generate-sku`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ ...formData, sku: response.data.data.sku });
      toast.success('SKU generated successfully');
    } catch (error: any) {
      console.error('Error generating SKU:', error);
      toast.error('Failed to generate SKU');
    } finally {
      setIsGeneratingSKU(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.unitOfMeasure) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Current stock cannot be negative';
    }

    if (formData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative';
    }

    if (formData.maxStockLevel !== null && formData.maxStockLevel < 0) {
      newErrors.maxStockLevel = 'Max stock level cannot be negative';
    }

    if (formData.maxStockLevel !== null && formData.maxStockLevel < formData.reorderLevel) {
      newErrors.maxStockLevel = 'Max stock level must be greater than reorder level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      const payload = {
        ...formData,
        maxStockLevel: formData.maxStockLevel === null || formData.maxStockLevel === 0 ? null : formData.maxStockLevel,
        warehouse: formData.warehouse || null,
        imageUrl: formData.imageUrl || null,
      };

      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Product updated successfully');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Product created successfully');
      }

      navigate('/products/stock');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field
    if (errors[name as keyof ProductFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  if (isFetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate('/products/stock')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stock Availability
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {isEditMode ? 'Update Product' : 'Create New Product'}
          </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEditMode
            ? 'Update product information and inventory details'
            : 'Add a new product to your inventory catalog'}
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.name ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.name}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU / Product Code <span className="text-error-600">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                      errors.sku ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white uppercase`}
                    placeholder="Enter SKU"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSKU}
                    disabled={isGeneratingSKU}
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingSKU ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Auto</span>
                  </button>
                </div>
                {errors.sku && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.sku}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-error-600">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.category ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.parentCategory
                        ? `${category.parentCategory.name} > ${category.name}`
                        : category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.category}</p>
                )}
              </div>

              {/* Unit of Measure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit of Measure <span className="text-error-600">*</span>
                </label>
                <select
                  name="unitOfMeasure"
                  value={formData.unitOfMeasure}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  {unitOfMeasureOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Warehouse (Optional)
                </label>
                <select
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                >
                  <option value="">No warehouse assigned</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name} ({warehouse.code}) - {warehouse.location.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.currentStock ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white`}
                />
                {errors.currentStock && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.currentStock}</p>
                )}
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reorder Level <span className="text-error-600">*</span>
                </label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.reorderLevel ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white`}
                />
                {errors.reorderLevel && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.reorderLevel}</p>
                )}
              </div>

              {/* Max Stock Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Stock Level (Optional)
                </label>
                <input
                  type="number"
                  name="maxStockLevel"
                  value={formData.maxStockLevel || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-2.5 bg-white dark:bg-gray-800 border ${
                    errors.maxStockLevel ? 'border-error-500' : 'border-gray-300 dark:border-gray-700'
                  } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white`}
                />
                {errors.maxStockLevel && (
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.maxStockLevel}</p>
                )}
              </div>
            </div>

            {/* Auto Reorder Toggle */}
            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoReorderEnabled"
                  checked={formData.autoReorderEnabled}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Auto Reorder
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Automatically create purchase orders when stock falls below reorder level
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </button>
                </div>
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                  placeholder="Enter product description..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate('/products/stock')}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
