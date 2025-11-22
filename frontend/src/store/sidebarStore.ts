import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  expandedItems: string[];
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
  toggleExpanded: (itemId: string) => void;
  setExpandedItems: (items: string[]) => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: false,
      expandedItems: [],

      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),

      closeSidebar: () => set({ isOpen: false }),

      openSidebar: () => set({ isOpen: true }),

      toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),

      toggleExpanded: (itemId) =>
        set((state) => ({
          expandedItems: state.expandedItems.includes(itemId)
            ? state.expandedItems.filter((id) => id !== itemId)
            : [...state.expandedItems, itemId],
        })),

      setExpandedItems: (items) => set({ expandedItems: items }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ isCollapsed: state.isCollapsed, expandedItems: state.expandedItems }),
    }
  )
);
