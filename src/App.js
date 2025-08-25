import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseOrderForm from './pages/PurchaseOrderForm';
import CompanyProfile from './pages/CompanyProfile';
import NotFound from './pages/NotFound';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      
      {/* Main app routes */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={
          <ProtectedRoute adminOnly={true}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/purchase-orders/new" element={<PurchaseOrderForm />} />
        <Route path="/purchase-orders/:id" element={<PurchaseOrderForm />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
