import React from 'react';
import { 
  MdDashboard, 
  MdLocalShipping, 
  MdFlightTakeoff
} from 'react-icons/md';

const Sidebar = ({ activeRoute, onRouteChange }) => {

  const Logo = () => (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
        <MdFlightTakeoff className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900">B2B - Drones</h1>
        <p className="text-xs text-gray-500">Sistema de Logística</p>
      </div>
    </div>
  );

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: MdDashboard, 
      route: '/dashboard',
      badge: null
    },
    { 
      id: 'drones', 
      label: 'Drones', 
      icon: MdFlightTakeoff, 
      route: '/drones',
      badge: null
    },
    { 
      id: 'pedidos', 
      label: 'Pedidos', 
      icon: MdLocalShipping, 
      route: '/order',
      badge: null 
    }
  ];

  const handleMenuClick = (item) => {
    onRouteChange?.(item.route, item.id);
  };

  return (
    <div className="bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen w-64">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <Logo />
      </div>

      {/* navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeRoute === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-sm
                    transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <IconComponent className={`
                    w-5 h-5 transition-colors duration-200
                    ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                  `} />
                  
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>     
    </div>
  );
};

export default Sidebar;
