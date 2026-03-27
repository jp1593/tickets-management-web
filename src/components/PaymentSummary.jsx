import React, { useState, useEffect } from 'react';
import { getWeeklySummary } from '../api/ticketService';
import {
  Calendar,
  Receipt,
  Loader2,
  DollarSign,
  Users,
  BarChart3,
  Package,
  Info,
  X,
  MapPin
} from 'lucide-react';

const PaymentSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(8);
  const [year, setYear] = useState(2023);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (item) => {
    setSelectedSupplier(item);
    setIsModalOpen(true);
  };

  // Global calculations
  const globalTotal = summary.reduce((acc, item) => acc + Number(item.totalAmount || 0), 0);
  const totalSuppliers = summary.length;
  const totalTickets = summary.reduce((acc, item) => acc + Number(item.ticketCount || 0), 0);
  const totalProducts = summary.reduce((acc, item) => acc + Number(item.productCount || 0), 0);

  useEffect(() => {
    if (week && year) {
      fetchSummary();
    }
  }, [week, year]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getWeeklySummary(year, week);
      if (res.data && res.data.payments) {
        setSummary(res.data.payments);
      } else {
        setSummary([]);
      }
    } catch (error) {
      console.error("Error al obtener el resumen:", error);
      setSummary([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnalysis = (item) => {
    setSelectedAnalysis(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Filter section */}
      <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Calendar size={20} className="text-blue-600" />
          <div className="flex items-center gap-2">
            <span>Semana:</span>
            <input
              type="number"
              min="1"
              max="53"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="w-16 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-blue-600 outline-none p-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span>Año:</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 outline-none p-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Cards of content */}
      {!loading && summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Total */}
          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative group overflow-hidden">
            <div className="z-10 relative">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Semanal</p>
              <h2 className="text-2xl font-black">
                ${globalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <DollarSign size={60} className="absolute -right-2 -bottom-2 text-slate-700 opacity-40 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Card: Providers */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Proveedores</p>
              <h2 className="text-xl font-black text-slate-800">{totalSuppliers}</h2>
            </div>
          </div>

          {/* Card: Tickets */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tickets</p>
              <h2 className="text-xl font-black text-slate-800">{totalTickets}</h2>
            </div>
          </div>

          {/* Card: Products */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
              <Package size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Productos</p>
              <h2 className="text-xl font-black text-slate-800">{totalProducts}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Providers list - Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Sincronizando datos de la semana...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.length > 0 ? (
            summary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                    {item.supplier?.code || 'S/C'}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {item.ticketCount} Tickets
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {item.productCount || 0} Prod.
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-6 h-12 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.supplier?.name || 'Proveedor Desconocido'}
                </h3>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Inversión Total</p>
                    <p className="text-2xl font-black text-slate-900">
                      ${Number(item.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenDetails(item)}
                    className="bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white p-3 rounded-2xl transition-all duration-300 group/btn shadow-sm hover:shadow-blue-200"
                    title="Ver detalles"
                  >
                    <Info size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <Receipt size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium italic">
                No se encontraron movimientos para la semana {week} del {year}.
              </p>
            </div>
          )}

          {/* Supplier detail Modal */}
           {isModalOpen && selectedSupplier && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsModalOpen(false)}
              />

              <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
                      {selectedSupplier.supplier?.code}
                    </span>
                    <h2 className="text-2xl font-black text-slate-800 mt-2">
                      {selectedSupplier.supplier?.name}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">Resumen detallado de la semana</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={24} className="text-slate-600" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">

                  {/* Products table */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest">
                      <Package size={18} className="text-blue-500" /> Productos Comprados
                    </h3>

                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-bold">Ticket</th>
                            <th className="px-4 py-3 font-bold">Producto</th>
                            <th className="px-4 py-3 font-bold text-center">Cant.</th>
                            <th className="px-4 py-3 font-bold text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedSupplier.tickets?.flatMap(ticket =>
                            (ticket.items || []).map((item, idx) => (
                              <tr key={`${ticket.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                    #{ticket.code}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-700">
                                  {item.product?.name || 'Producto sin nombre'}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-600 font-bold">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-3 text-right font-black text-slate-900">
                                  ${Number(item.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex justify-between items-center shadow-lg shadow-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Inversión Total Semanal</p>
                        <p className="text-xs text-blue-400 font-medium">Sumatoria de todos los tickets</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black">
                      ${Number(selectedSupplier.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-50">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    Cerrar Vista
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default PaymentSummary;