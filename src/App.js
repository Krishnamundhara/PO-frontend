import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { BackendStatusProvider, useBackendStatus } from './context/BackendStatusContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseOrderForm from './pages/PurchaseOrderForm';
import PurchaseOrderView from './pages/PurchaseOrderView';
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

// Backend wakeup notification
const BackendWakeupNotification = () => {
  const { isWakingUp } = useBackendStatus();
  
  if (!isWakingUp) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg z-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Starting server...</strong>
            <br />
            Please wait while we reconnect. This happens after 15 minutes of inactivity.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BackendStatusProvider>
      <BackendWakeupNotification />
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
          <Route path="/purchase-orders/:id/view" element={<PurchaseOrderView />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BackendStatusProvider>
  );
}

export default App;
