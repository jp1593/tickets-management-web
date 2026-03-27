import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import { getTickets, getTicketById } from './api/ticketService';
import { ChevronRight, ChevronLeft, Search, Receipt } from 'lucide-react';
import PaymentSummary from './components/PaymentSummary';
import TicketDetailModal from './components/TicketDetailModal';
import DashboardMetrics from './components/DashboardMetrics';
import CreateTicketModal from './components/CreateTicketModal';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets'); //Variable established to set teh first section to load
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  const itemsPerPage = 10;

  useEffect(() => {
    if (!showSplash && activeTab === 'tickets') {
      loadTickets();
    }
  }, [showSplash, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await getTickets(1, 1000);
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalles = async (ticketId) => {
    setLoading(true);
    try {
      const response = await getTicketById(ticketId);
      setSelectedTicket(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.code?.toLowerCase().includes(term) ||
      ticket.supplier?.name?.toLowerCase().includes(term) ||
      ticket.land?.name?.toLowerCase().includes(term)
    );
  });

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  if (showSplash) return <SplashScreen onFinished={() => setShowSplash(false)} />;

  const totalGlobal = tickets.reduce((acc, t) => acc + (parseFloat(t.total) || 0), 0);

  // Function to render content by page/section
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMetrics year={2023} week={4} />;

      case 'tickets':
        return (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-220px)]">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                    <th className="p-5 font-semibold">Código</th>
                    <th className="p-5 font-semibold">Proveedor</th>
                    <th className="p-5 font-semibold">Ubicación</th>
                    <th className="p-5 font-semibold text-right">Monto Total</th>
                    <th className="p-5 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-400 italic">Cargando...</td></tr>
                  ) : currentTickets.length === 0 ? (
                    <tr><td colSpan="5" className="p-20 text-center text-slate-400">No se encontraron resultados.</td></tr>
                  ) : (
                    currentTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-5 font-bold text-blue-600">#{ticket.code}</td>
                        <td className="p-5 font-medium text-slate-700">{ticket.supplier?.name}</td>
                        <td className="p-5 text-slate-500">{ticket.land?.name}</td>
                        <td className="p-5 text-right font-black text-slate-900">
                          ${ticket.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-5 text-center">
                          <button
                            onClick={() => handleVerDetalles(ticket.id)}
                            className="text-slate-400 hover:text-blue-600 font-semibold text-sm transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                          >
                            Detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-between items-center bg-slate-50 border-t mt-auto">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl disabled:opacity-50 hover:bg-slate-100 transition shadow-sm font-medium text-slate-600"
              >
                <ChevronLeft size={18} /> Anterior
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">
                  Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredTickets.length)} de {filteredTickets.length}
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold">
                  Pág. {page} / {totalPages || 1}
                </span>
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl disabled:opacity-50 hover:bg-slate-100 transition shadow-sm font-medium text-slate-600"
              >
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );

      case 'payments':
        return <PaymentSummary />;

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'tickets' ? 'Listado de Tickets' :
                activeTab === 'dashboard' ? 'Panel de Control' : 'Resumen de Pagos'}
            </h2>

            {activeTab === 'tickets' && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {filteredTickets.length} Encontrados
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Total: ${totalGlobal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'tickets' && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar código, proveedor o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-76 text-sm"
                />
              </div>
              <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm">
                + Nuevo Ticket
              </button>
            </div>
          )}
        </header>

        {/* Dinamic render */}
        {renderTabContent()}

        {isModalOpen && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isCreateModalOpen && (
          <CreateTicketModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={loadTickets}
          />
        )}
      </main>
    </div>
  );
}

export default App;