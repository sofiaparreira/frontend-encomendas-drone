import React from 'react'

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeRoute={activeRoute} 
        onRouteChange={handleRouteChange} 
      />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/drone" element={<DashboardDronePage />} />
          <Route path="/drone/create" element={<CreateDronePage />} />
          <Route path="/drone/:id" element={<DroneDetailPage />} />

          <Route path="/order/create" element={<CreateOrderPage />} />
          <Route path="/order" element={<DashboardOrdersPage />} />

          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard Principal</h1></div>} />
        </Routes>
      </div>

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
    </div>
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