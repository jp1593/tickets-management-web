import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/ticketService';
import { TrendingUp, TrendingDown, MapPin, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const DashboardMetrics = ({ initialYear = 2023, initialWeek = 4 }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(initialYear);
    const [week, setWeek] = useState(initialWeek);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await getDashboardStats(year, week);
                setStats(res.data);
            } catch (e) {
                console.error("Error fetching stats:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [year, week]);

    // Options fro week selection
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    const years = [2023, 2024, 2025, 2026];

    const isPositiveDrift = stats?.performance?.drift > 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Calendar size={20} />
                    </div>
                    <h3 className="font-bold text-slate-700">Período de Análisis</h3>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map(y => <option key={y} value={y}>Año {y}</option>)}
                    </select>

                    <select
                        value={week}
                        onChange={(e) => setWeek(parseInt(e.target.value))}
                        className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {weeks.map(w => <option key={w} value={w}>Semana {w}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2rem]" />)}
                </div>
            ) : stats && (
                <>
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Current Total */}
                        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-900/10">
                            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">Total Semana {week}</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black">
                                    ${stats.performance.currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </h3>
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <DollarSign size={24} className="text-blue-300" />
                                </div>
                            </div>
                        </div>

                        {/* Last Week Total */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Semana Anterior</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-700">
                                    ${stats.performance.lastWeekTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </h3>
                                <span className="text-xs font-medium text-slate-400">Semana {week === 1 ? 52 : week - 1}</span>
                            </div>
                        </div>

                        {/* Drift / Trend */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Variación de Gasto</p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className={`flex items-center gap-1 text-2xl font-black ${isPositiveDrift ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {isPositiveDrift ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                        {stats.performance.drift}%
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Comparado con el período anterior</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supplier distribution per week */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Activity size={18} />
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight">Principales Proveedores</h3>
                        </div>

                        <div className="space-y-3">
                            {stats.bySupplier.map((sup, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 group-hover:border-emerald-300">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{sup.supplierName}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900">
                                            ${Number(sup.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-[10px] text-emerald-600 font-bold">
                                            {((sup.value / stats.performance.currentTotal) * 100).toFixed(1)}% del total
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Land distribution per week*/}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
                                <MapPin size={18} />
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-tight">Distribución por Ubicación</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                            {stats.byLand.map((land, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                                            {land.landName}
                                        </span>
                                        <span className="text-sm font-black text-slate-900">
                                            ${Number(land.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                            style={{ width: `${(land.value / stats.performance.currentTotal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardMetrics;