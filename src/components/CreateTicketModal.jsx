import React, { useEffect, useState } from "react";
import { X, Package, User, MapPin, Plus } from "lucide-react";
import { createTicket, getSuppliers, getLands, getProducts } from "../api/ticketService";

const CreateTicketModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        code: "",
        date: "",
        supplierCode: "",
        landCode: "",
        items: [],
    });

    const [suppliers, setSuppliers] = useState([]);
    const [lands, setLands] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadCatalogs();
    }, []);

    const loadCatalogs = async () => {
        try {
            const [supRes, landRes, prodRes] = await Promise.all([
                getSuppliers(),
                getLands(),
                getProducts(),
            ]);

            setSuppliers(supRes.data);
            setLands(landRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addItem = () => {
        setForm({
            ...form,
            items: [...form.items, { productCode: "", quantity: 1, price: 0, subtotal: 0 }],
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...form.items];
        newItems[index][field] = value;

        const q = parseFloat(newItems[index].quantity || 0);
        const p = parseFloat(newItems[index].price || 0);
        newItems[index].subtotal = q * p;

        setForm({ ...form, items: newItems });
    };

    const total = form.items.reduce((acc, i) => acc + (i.subtotal || 0), 0);

    const handleSubmit = async () => {
        try {
            await createTicket(form);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error creando ticket");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Nuevo Ticket</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            Completa la información para crear un ticket
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">

                    {/* Basic information*/}
                    <div className="grid grid-cols-2 gap-6">
                        <input
                            placeholder="Código"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            className="border border-slate-200 p-3 rounded-xl"
                        />

                        <input
                            type="date"
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="border border-slate-200 p-3 rounded-xl"
                        />
                    </div>

                    {/* Supplier + Land */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <User className="text-blue-500" />
                            <select
                                onChange={(e) => setForm({ ...form, supplierCode: e.target.value })}
                            >
                                <option value="">Proveedor</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.code}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="text-purple-500" />
                            <select
                                onChange={(e) => setForm({ ...form, landCode: e.target.value })}
                            >
                                <option value="">Ubicación</option>
                                {lands.map((l) => (
                                    <option key={l.id} value={l.code}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                <Package size={18} className="text-blue-500" />
                                Productos
                            </h3>

                            <button
                                onClick={addItem}
                                className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg"
                            >
                                <Plus size={16} /> Agregar
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.items.map((item, i) => (
                                <div key={i} className="grid grid-cols-4 gap-2">

                                    <select
                                        className="border p-2 rounded-lg"
                                        onChange={(e) => updateItem(i, "productCode", e.target.value)}
                                    >
                                        <option value="">Producto</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.code}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        className="border p-2 rounded-lg"
                                        onChange={(e) => updateItem(i, "quantity", e.target.value)}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        className="border p-2 rounded-lg"
                                        onChange={(e) => updateItem(i, "price", e.target.value)}
                                    />

                                    <div className="flex items-center justify-end font-bold text-slate-700">
                                        ${item.subtotal?.toFixed(2) || "0.00"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white flex justify-between items-center">
                        <span className="font-bold uppercase text-xs">Total</span>
                        <span className="text-2xl font-black">
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold"
                        >
                            Guardar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateTicketModal;