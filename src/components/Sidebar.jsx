import React from 'react';
import { LayoutDashboard, Ticket, CreditCard, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'tickets', icon: <Ticket size={20} />, label: 'Gestión de Tickets' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Resumen de Pagos' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Ticket size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-black tracking-tight">CFG <span className="text-blue-500">SYSTEM</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 space-y-2">
      </div>
    </aside>
  );
};

export default Sidebar;