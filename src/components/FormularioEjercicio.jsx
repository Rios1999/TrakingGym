import React, { useState } from 'react';

const FormularioEjercicio = ({ onEnviar }) => {
    const hoy = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        ejercicio: '',
        peso: '',
        repeticiones: '',
        rpe: '8',
        fecha: hoy
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if ("vibrate" in navigator) navigator.vibrate(50);

        onEnviar({
            ...formData,
            peso: parseFloat(formData.peso),
            repeticiones: parseInt(formData.repeticiones),
            rpe: parseInt(formData.rpe),
        });
        setFormData({ ...formData, ejercicio: '', peso: '', repeticiones: '', rpe: '8' });
    };

    return (
        <div className="relative group w-full max-w-md mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>

            <form
                onSubmit={handleSubmit}
                className="relative bg-zinc-950/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-5 overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4 px-2">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
                            New <span className="text-blue-500">Set</span>
                        </h2>
                    </div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                </div>

                {/* Fila 1: Ejercicio + Fecha (Pulsado a p-3.5 para equilibrio) */}
                <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 ml-1 tracking-widest uppercase">Ejercicio</label>
                        <input
                            required
                            type="text"
                            name="ejercicio"
                            value={formData.ejercicio}
                            onChange={handleChange}
                            placeholder="Ej: Press Banca"
                            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 rounded-xl p-3.5 text-sm text-white placeholder:text-zinc-700 outline-none transition-all"
                        />
                    </div>
                    <div className="w-32 space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 ml-1 tracking-widest uppercase">Fecha</label>
                        <input
                            required
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 pr-2 text-[11px] text-blue-500 outline-none uppercase appearance-none webkit-appearance-none min-h-[52px]" />
                    </div>
                </div>

                {/* Fila 2: Peso + Repes (Igualado a p-3.5) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 ml-1 tracking-widest uppercase">Carga (kg)</label>
                        <div className="relative">
                            <input
                                required
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleChange}
                                placeholder="0.0"
                                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 rounded-xl p-3.5 text-sm font-bold text-white outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600">KG</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-500 ml-1 tracking-widest uppercase">Repes</label>
                        <div className="relative">
                            <input
                                required
                                type="number"
                                name="repeticiones"
                                value={formData.repeticiones}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 rounded-xl p-3.5 text-sm font-bold text-white outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-600">X</span>
                        </div>
                    </div>
                </div>

                {/* RPE Selector mejorado */}
                <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/50 overflow-hidden">
                    <div className="flex items-center p-2 pl-4">
                        <div className="flex-1 pr-4">
                            <input
                                required
                                type="range"
                                min="5"
                                max="10"
                                step="1"
                                name="rpe"
                                value={formData.rpe}
                                onChange={handleChange}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-all"
                            />
                        </div>
                        <div className={`shrink-0 min-w-[70px] text-center text-[11px] font-black px-3 py-2 rounded-xl transition-colors duration-500 shadow-lg ${parseInt(formData.rpe) >= 9 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                            RPE {formData.rpe}
                        </div>
                    </div>
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 font-black text-white transition-all hover:bg-blue-500 active:scale-[0.97] shadow-[0_10px_25px_rgba(37,99,235,0.2)]"
                >
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                        <div className="relative h-full w-10 bg-white/20" />
                    </div>
                    <span className="relative flex items-center justify-center gap-2 tracking-tight">
                        REGISTRAR SERIE ⚡
                    </span>
                </button>
            </form>
        </div>
    );
};

export default FormularioEjercicio;