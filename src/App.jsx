import React from 'react'

import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreateDronePage from './pages/drone/create/page';
import DashboardDronePage from './pages/drone/page';
import CreateOrderPage from './pages/order/create/page';
import DashboardOrdersPage from './pages/order/page';
import Sidebar from './components/Sidebar'; 
import SettingsPage from './pages/settings/page';
import DroneDetailPage from './pages/drone/details/page';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import DashboardPage from './pages/dashboard/page';
import LoginPage from './pages/auth/login/page';



const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState('dashboard');

 
  const getActiveRoute = (pathname) => {
    
    if (pathname.startsWith('/drone')) {
      return 'drones';
    }
    
    if (pathname.startsWith('/order')) {
      return 'pedidos';
    }
    
    if (pathname === '/settings') {
      return 'configuracoes';
    }
    if (pathname === '/' || pathname === '/') {
      return 'dashboard';
    }
    
    
    return 'dashboard';
  };

  useEffect(() => {
    const currentRoute = getActiveRoute(location.pathname);
    setActiveRoute(currentRoute);
  }, [location.pathname]);

  const handleRouteChange = (route, id) => {
    setActiveRoute(id);
    
    switch(id) {
      case 'drones':
        navigate('/drone');
        break;
      case 'pedidos':
        navigate('/order');
        break;
      case 'dashboard':
        navigate('/');
        break;
      case 'configuracoes':
        navigate('/settings')
        break;
      default:
        navigate('/');
    }
  };

  const AppLayout = () => (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeRoute={activeRoute} 
        onRouteChange={handleRouteChange} 
      />

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/drone" element={<DashboardDronePage />} />
          <Route path="/drone/create" element={<CreateDronePage />} />
          <Route path="/drone/:id" element={<DroneDetailPage />} />

          <Route path="/order/create" element={<CreateOrderPage />} />
          <Route path="/order" element={<DashboardOrdersPage />} />

          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false} 
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;