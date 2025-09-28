import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreateDronePage from './pages/drone/create/page';
import React from 'react'
import DashboardDronePage from './pages/drone/page';
import CreateOrderPage from './pages/order/create/page';
import DashboardOrdersPage from './pages/order/page';
import Sidebar from './components/Sidebar'; // ajuste o caminho conforme sua estrutura
import SettingsPage from './pages/settings/page';
import DroneDetailPage from './pages/drone/details/page';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


// Componente wrapper que contém a sidebar e o conteúdo
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState('dashboard');

  // Função para determinar a rota ativa baseada no pathname
  const getActiveRoute = (pathname) => {
    // Para rotas que começam com /drone (incluindo /drone/123, /drone/create, etc.)
    if (pathname.startsWith('/drone')) {
      return 'drones';
    }
    // Para rotas que começam com /order
    if (pathname.startsWith('/order')) {
      return 'pedidos';
    }
    // Para outras rotas específicas
    if (pathname === '/settings') {
      return 'configuracoes';
    }
    if (pathname === '/dashboard' || pathname === '/') {
      return 'dashboard';
    }
    
    // Fallback para dashboard
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
        navigate('/dashboard');
        break;
      case 'configuracoes':
        navigate('/settings')
        break;
      default:
        navigate('/dashboard');
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
          <Route path="/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard Principal</h1></div>} />

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