import React, { useState, useEffect } from 'react';
import { getWeeklySummary } from '../api/ticketService';
import { Calendar, Receipt, Loader2, DollarSign, Users, BarChart3 } from 'lucide-react';

const PaymentSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [week, setWeek] = useState(9); 
  const [year, setYear] = useState(2023);

  // Global calculations
  const globalTotal = summary.reduce((acc, item) => acc + Number(item.totalAmount || 0), 0);
  const totalSuppliers = summary.length;
  const totalTickets = summary.reduce((acc, item) => acc + Number(item.ticketCount || 0), 0);

  useEffect(() => {
    fetchSummary();
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Filters section */}
      <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Calendar size={20} className="text-blue-600" />
          <div className="flex items-center gap-2">
            <span>Semana:</span>
            <input 
              type="number" 
              min="1"
              value={week} 
              onChange={(e) => setWeek(e.target.value)}
              className="w-16 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-blue-600 outline-none p-1"
            />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span>Año:</span>
            <input 
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-700 outline-none p-1"
            />
          </div>
        </div>
      </div>

      {/* Resume*/}
      {!loading && summary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total amount card */}
          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl flex items-center justify-between overflow-hidden relative group">
            <div className="z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Gran Total Semanal</p>
              <h2 className="text-3xl font-black text-white">
                ${globalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <DollarSign size={80} className="absolute -right-4 -bottom-4 text-slate-700 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Providers card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Proveedores</p>
              <h2 className="text-2xl font-black text-slate-800">{totalSuppliers}</h2>
            </div>
          </div>

          {/* Tickets Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Tickets Totales</p>
              <h2 className="text-2xl font-black text-slate-800">{totalTickets}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Providers list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Calculando totales...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.length > 0 ? (
            summary.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                        {item.supplier?.code || 'S/C'}
                    </span>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.ticketCount} Tickets
                    </div>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 mb-6 h-12 line-clamp-2">
                    {item.supplier?.name || 'Proveedor Desconocido'}
                </h3>
                
                <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Monto Total</p>
                        <p className="text-2xl font-black text-slate-900">
                          ${Number(item.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                        <BarChart3 size={18} />
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
              <Receipt size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium italic">Sin movimientos para la semana {week} del {year}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;