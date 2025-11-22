import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Auth Pages
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOTP } from './pages/VerifyOTP';
import { ResetPassword } from './pages/ResetPassword';

// Dashboard & Profile
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

// Product Pages
import { ManageProducts } from './pages/Products/ManageProducts';
import { StockAvailability } from './pages/Products/StockAvailability';
import { ProductCategories } from './pages/Products/ProductCategories';
import { ReorderRules } from './pages/Products/ReorderRules';

// Operations Pages
import { Receipts } from './pages/Operations/Receipts';
import { Deliveries } from './pages/Operations/Deliveries';
import { Adjustments } from './pages/Operations/Adjustments';

// Move History
import { MoveHistory } from './pages/MoveHistory';

// Settings Pages
import { Warehouse } from './pages/Settings/Warehouse';
import { Users } from './pages/Settings/Users';
import { General } from './pages/Settings/General';
import { Notifications } from './pages/Settings/Notifications';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';

function App() {
  const { checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Warehouse Staff']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Product Routes */}
        <Route
          path="/products/manage"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <ManageProducts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/stock"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Warehouse Staff']}>
              <DashboardLayout>
                <StockAvailability />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/categories"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <ProductCategories />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/reorder-rules"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <ReorderRules />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Operations Routes */}
        <Route
          path="/operations/receipts"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Warehouse Staff']}>
              <DashboardLayout>
                <Receipts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/deliveries"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Warehouse Staff']}>
              <DashboardLayout>
                <Deliveries />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/operations/adjustments"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <Adjustments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Move History */}
        <Route
          path="/move-history"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager', 'Warehouse Staff']}>
              <DashboardLayout>
                <MoveHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings Routes */}
        <Route
          path="/settings/warehouse"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <Warehouse />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/general"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <General />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/notifications"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inventory Manager']}>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
