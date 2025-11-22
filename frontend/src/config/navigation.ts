import {
  LayoutDashboard,
  Package,
  Activity,
  History,
  Settings,
} from 'lucide-react';
import { NavigationItem } from '../types/navigation';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    isExpandable: true,
    allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
    children: [
      {
        id: 'products-manage',
        label: 'Create/Update Products',
        path: '/products/manage',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
      {
        id: 'products-stock',
        label: 'Stock Availability',
        path: '/products/stock',
        allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
      },
      {
        id: 'products-categories',
        label: 'Product Categories',
        path: '/products/categories',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
      {
        id: 'products-reorder',
        label: 'Reordering Rules',
        path: '/products/reorder-rules',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: Activity,
    isExpandable: true,
    allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
    children: [
      {
        id: 'operations-receipts',
        label: 'Receipts (Incoming)',
        path: '/operations/receipts',
        badge: 5, // This should come from API/state
        badgeVariant: 'warning',
        allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
      },
      {
        id: 'operations-deliveries',
        label: 'Delivery Orders (Outgoing)',
        path: '/operations/deliveries',
        badge: 3, // This should come from API/state
        badgeVariant: 'primary',
        allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
      },
      {
        id: 'operations-adjustments',
        label: 'Inventory Adjustment',
        path: '/operations/adjustments',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
    ],
  },
  {
    id: 'move-history',
    label: 'Move History',
    icon: History,
    path: '/move-history',
    allowedRoles: ['Admin', 'Inventory Manager', 'Warehouse Staff'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    isExpandable: true,
    allowedRoles: ['Admin', 'Inventory Manager'],
    children: [
      {
        id: 'settings-warehouse',
        label: 'Warehouse',
        path: '/settings/warehouse',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
      {
        id: 'settings-users',
        label: 'Users',
        path: '/settings/users',
        allowedRoles: ['Admin'],
      },
      {
        id: 'settings-general',
        label: 'General',
        path: '/settings/general',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
      {
        id: 'settings-notifications',
        label: 'Notifications',
        path: '/settings/notifications',
        allowedRoles: ['Admin', 'Inventory Manager'],
      },
    ],
  },
];

// Helper function to filter navigation based on user role
export const getFilteredNavigation = (userRole: string): NavigationItem[] => {
  return navigationItems
    .filter((item) => !item.allowedRoles || item.allowedRoles.includes(userRole as any))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.allowedRoles || child.allowedRoles.includes(userRole as any)
      ),
    }));
};
