import { Product, StockActivity, Warehouse, ChartDataPoint } from '../types/dashboard';

// Mock Products
export const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-001', category: 'Electronics', quantity: 45, reorderLevel: 20, warehouse: 'Main Warehouse', value: 67500, lastUpdated: new Date('2024-01-15') },
  { id: '2', name: 'Office Chair Pro', sku: 'CHAIR-PRO-001', category: 'Furniture', quantity: 120, reorderLevel: 30, warehouse: 'Main Warehouse', value: 36000, lastUpdated: new Date('2024-01-14') },
  { id: '3', name: 'Wireless Mouse', sku: 'MOUSE-W-001', category: 'Electronics', quantity: 15, reorderLevel: 25, warehouse: 'Secondary Warehouse', value: 750, lastUpdated: new Date('2024-01-16') },
  { id: '4', name: 'USB-C Cable 2m', sku: 'CABLE-USBC-2M', category: 'Accessories', quantity: 5, reorderLevel: 50, warehouse: 'Main Warehouse', value: 150, lastUpdated: new Date('2024-01-13') },
  { id: '5', name: 'Monitor 27" 4K', sku: 'MON-27-4K-001', category: 'Electronics', quantity: 30, reorderLevel: 15, warehouse: 'Main Warehouse', value: 15000, lastUpdated: new Date('2024-01-15') },
  { id: '6', name: 'Desk Lamp LED', sku: 'LAMP-LED-001', category: 'Office Supplies', quantity: 80, reorderLevel: 20, warehouse: 'Secondary Warehouse', value: 4000, lastUpdated: new Date('2024-01-12') },
  { id: '7', name: 'Notebook A4', sku: 'NB-A4-001', category: 'Office Supplies', quantity: 200, reorderLevel: 100, warehouse: 'Main Warehouse', value: 2000, lastUpdated: new Date('2024-01-11') },
  { id: '8', name: 'Webcam HD Pro', sku: 'WEBCAM-HD-001', category: 'Electronics', quantity: 8, reorderLevel: 12, warehouse: 'Main Warehouse', value: 800, lastUpdated: new Date('2024-01-16') },
];

// Mock Stock Activities
export const mockActivities: StockActivity[] = [
  { id: '1', type: 'Receipt', product: 'Laptop Dell XPS 15', quantity: 20, warehouse: 'Main Warehouse', status: 'Done', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), dueDate: new Date() },
  { id: '2', type: 'Delivery', product: 'Office Chair Pro', quantity: -10, warehouse: 'Main Warehouse', status: 'Ready', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { id: '3', type: 'InternalTransfer', product: 'Wireless Mouse', quantity: 25, warehouse: 'Secondary Warehouse', status: 'Waiting', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { id: '4', type: 'Adjustment', product: 'USB-C Cable 2m', quantity: -5, warehouse: 'Main Warehouse', status: 'Done', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  { id: '5', type: 'Receipt', product: 'Monitor 27" 4K', quantity: 15, warehouse: 'Main Warehouse', status: 'Done', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: '6', type: 'Delivery', product: 'Desk Lamp LED', quantity: -20, warehouse: 'Secondary Warehouse', status: 'Waiting', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000) },
  { id: '7', type: 'Receipt', product: 'Notebook A4', quantity: 100, warehouse: 'Main Warehouse', status: 'Draft', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '8', type: 'InternalTransfer', product: 'Webcam HD Pro', quantity: 5, warehouse: 'Main Warehouse', status: 'Ready', createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000) },
];

// Mock Warehouses
export const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', location: 'New York, NY', totalValue: 126200, productCount: 500 },
  { id: '2', name: 'Secondary Warehouse', location: 'Los Angeles, CA', totalValue: 4750, productCount: 105 },
];

// Calculate KPIs
export const calculateDashboardKPIs = (products: Product[], activities: StockActivity[]) => {
  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter((p) => p.quantity <= p.reorderLevel).length;
  const outOfStockItems = products.filter((p) => p.quantity === 0).length;
  const pendingReceipts = activities.filter((a) => a.type === 'Receipt' && a.status !== 'Done' && a.status !== 'Canceled').length;
  const pendingDeliveries = activities.filter((a) => a.type === 'Delivery' && a.status !== 'Done' && a.status !== 'Canceled').length;
  const pendingTransfers = activities.filter((a) => a.type === 'InternalTransfer' && a.status !== 'Done' && a.status !== 'Canceled').length;
  const totalValue = products.reduce((sum, p) => sum + p.value, 0);

  return {
    totalProducts,
    lowStockItems,
    outOfStockItems,
    pendingReceipts,
    pendingDeliveries,
    pendingTransfers,
    totalValue,
  };
};

// Stock Level Chart Data
export const getStockLevelChartData = (products: Product[]): ChartDataPoint[] => {
  const categories = [...new Set(products.map((p) => p.category))];

  return categories.map((category) => {
    const categoryProducts = products.filter((p) => p.category === category);
    const totalQty = categoryProducts.reduce((sum, p) => sum + p.quantity, 0);

    return {
      label: category,
      value: totalQty,
      color: getCategoryColor(category),
    };
  });
};

// Stock Value by Warehouse Chart Data
export const getWarehouseValueChartData = (products: Product[], warehouses: Warehouse[]): ChartDataPoint[] => {
  return warehouses.map((warehouse, index) => {
    const warehouseProducts = products.filter((p) => p.warehouse === warehouse.name);
    const totalValue = warehouseProducts.reduce((sum, p) => sum + p.value, 0);

    return {
      label: warehouse.name,
      value: totalValue,
      color: getWarehouseColor(index),
    };
  });
};

// Top Moving Products
export const getTopMovingProducts = (products: Product[], activities: StockActivity[], limit = 5): ChartDataPoint[] => {
  const productActivity = products.map((product) => {
    const relatedActivities = activities.filter((a) => a.product === product.name);
    const totalMovement = relatedActivities.reduce((sum, a) => sum + Math.abs(a.quantity), 0);

    return {
      label: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
      value: totalMovement,
    };
  });

  return productActivity
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

// Helper functions for colors
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Electronics': 'bg-primary-600',
    'Furniture': 'bg-success-600',
    'Accessories': 'bg-warning-500',
    'Office Supplies': 'bg-error-600',
  };
  return colors[category] || 'bg-gray-600';
};

const getWarehouseColor = (index: number): string => {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  return colors[index % colors.length];
};
