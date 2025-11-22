import { UserRole } from './index';

// Dashboard Types
export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: number; // Percentage change from last period
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

// Document Types
export type DocumentType = 'Receipt' | 'Delivery' | 'InternalTransfer' | 'Adjustment';
export type DocumentStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';

// Filter Types
export interface DashboardFilters {
  documentTypes: DocumentType[];
  statuses: DocumentStatus[];
  warehouses: string[];
  categories: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

// Inventory Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  warehouse: string;
  value: number;
  lastUpdated: Date;
}

export interface StockActivity {
  id: string;
  type: DocumentType;
  product: string;
  quantity: number;
  warehouse: string;
  status: DocumentStatus;
  createdAt: Date;
  dueDate?: Date;
}

// Chart Data
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

// Warehouse
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalValue: number;
  productCount: number;
}
