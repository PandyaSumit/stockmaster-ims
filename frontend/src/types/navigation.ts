import { UserRole } from './index';
import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  badge?: number | string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error';
  allowedRoles?: UserRole[];
  children?: NavigationSubItem[];
  isExpandable?: boolean;
}

export interface NavigationSubItem {
  id: string;
  label: string;
  path: string;
  badge?: number | string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error';
  allowedRoles?: UserRole[];
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  expandedItems: string[];
}
