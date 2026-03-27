import React from 'react';
import { X, Package, User, MapPin, Receipt, Trash2 } from 'lucide-react';

const TicketDetailModal = ({ ticket, onClose, onDelete }) => {
    if (!ticket) return null;

    const [confirming, setConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        console.log("🟡 Modal sending delete for:", ticket.id);
        setLoading(true);
        try {
            await onDelete(ticket.id);
        } catch (e) {
            console.error("🔴 Modal delete error:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Ticket #{ticket.code}</h2>
                        <p className="text-slate-500 text-sm font-medium">Detalle completo de la transacción</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Delete Ticket*/}
                        {!confirming ? (
                            <button
                                onClick={() => setConfirming(true)}
                                className="p-2 hover:bg-red-100 rounded-full transition"
                                title="Eliminar ticket"
                            >
                                <Trash2 size={20} className="text-red-500" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-xl">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-red-600">
                                        ¿Eliminar este ticket?
                                    </span>
                                    <span className="text-[10px] text-red-500">
                                        Esta acción no se puede deshacer
                                    </span>
                                </div>
                                <button
                                    onClick={() => setConfirming(false)}
                                    className="text-xs px-2 py-1 rounded bg-white border"
                                >
                                    No
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="text-xs px-2 py-1 rounded bg-red-600 text-white font-bold disabled:opacity-50"
                                >
                                    {loading ? "..." : "Sí"}
                                </button>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Proveedor</p>
                                <p className="font-bold text-slate-700">{ticket.supplier?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20} /></div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Destino</p>
                                <p className="font-bold text-slate-700">{ticket.land?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table of Items */}
                    <div>
                        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                            <Package size={18} className="text-blue-500" /> Productos Incluidos
                        </h3>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-bold">Producto</th>
                                        <th className="px-4 py-3 font-bold text-center">Cant.</th>
                                        <th className="px-4 py-3 font-bold text-right">Precio</th>
                                        <th className="px-4 py-3 font-bold text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {ticket.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {item.product?.name || 'Producto sin nombre'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-slate-600">
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                ${Number(item.subtotal).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Receipt size={24} className="text-blue-400" />
                            <span className="font-bold uppercase tracking-widest text-xs">Total del Ticket</span>
                        </div>
                        <span className="text-3xl font-black">
                            ${Number(ticket.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailModal;