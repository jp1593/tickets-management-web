import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import { getTickets } from './api/ticketService'; 
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showSplash && activeTab === 'tickets') {
      loadTickets();
    }
  }, [showSplash, page, activeTab]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets(page);
      setTickets(response.data.data);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) return <SplashScreen onFinished={() => setShowSplash(false)} />;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {activeTab === 'tickets' ? 'Listado de Tickets' : 'Resumen de Pagos'}
            </h2>
            <p className="text-slate-500">Gestión de datos en tiempo real.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar ticket..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all w-64"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-200">
              + Nuevo Ticket
            </button>
          </div>
        </header>

        {/* Conditional render for content */}
        {activeTab === 'tickets' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">Código</th>
                  <th className="p-5 font-semibold">Proveedor</th>
                  <th className="p-5 font-semibold">Ubicación (Land)</th>
                  <th className="p-5 font-semibold text-right">Monto Total</th>
                  <th className="p-5 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">Cargando datos...</td></tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-5 font-bold text-blue-600">#{ticket.code}</td>
                      <td className="p-5 font-medium text-slate-700">{ticket.supplier?.name}</td>
                      <td className="p-5 text-slate-500">{ticket.land?.name}</td>
                      <td className="p-5 text-right font-black text-slate-900">
                        ${ticket.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-5 text-center">
                        <button className="text-slate-400 hover:text-blue-600 font-semibold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
             <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-400">Pronto: Resumen Semanal de Pagos</h3>
             <p className="text-slate-400">Aquí implementaremos la lógica del Bonus que probamos en Postman.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;