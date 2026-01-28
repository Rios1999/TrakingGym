import React, { useState } from 'react';

const FormularioEjercicio = ({ onEnviar }) => {
    const hoy = new Date().toISOString().split('T')[0];
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
    const [errorMsg, setErrorMsg] = useState(''); // Estado para el mensaje de error
    const [enviando, setEnviando] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setErrorMsg(''); // Limpiamos errores previos

        try {
            await onEnviar({
                ...formData,
                peso: Number(formData.peso),
                repeticiones: Number(formData.repeticiones),
                rpe: Number(formData.rpe),
            });

            // ÉXITO
            if ("vibrate" in navigator) navigator.vibrate(50);
            setMostrarNotificacion(true);
            setTimeout(() => setMostrarNotificacion(false), 3000);

            setFormData({
                ejercicio: '',
                peso: '',
                repeticiones: '',
                rpe: '8',
                fecha: hoy
            });

        } catch (error) {
            // FALLO: Capturamos el mensaje que lanzamos en n8n o gymApi

            console.error("Error al registrar:", error);
            setErrorMsg(error.message || "Error inesperado al conectar con el servidor");

            // Auto-cerrar el error después de 5 segundos
            setTimeout(() => setErrorMsg(''), 5000);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative px-4">

            {/* TOAST DE ÉXITO (Verde) */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${mostrarNotificacion ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 border border-white/20">
                    <span className="text-xs font-black uppercase tracking-widest">Serie Guardada ⚡</span>
                </div>
            </div>

            {/* TOAST DE ERROR (Rojo) */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${errorMsg ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl flex flex-col items-center border border-white/20 min-w-[280px]">
                    <span className="text-[10px] font-black uppercase opacity-70">Error de Registro</span>
                    <span className="text-xs font-bold text-center italic">{errorMsg}</span>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-950 p-6 rounded-[2rem] border border-white/10 shadow-2xl space-y-5"
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
                        New <span className="text-blue-500">Set</span>
                    </h2>
                    {enviando && <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>}
                </div>

                {/* Ejercicio + Fecha */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Ejercicio</label>
                        <input
                            required type="text" name="ejercicio"
                            value={formData.ejercicio} onChange={handleChange}
                            placeholder="Ej: Press Banca"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="w-full sm:w-32">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                            Fecha
                        </label>
                        <input
                            required
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            /* Añadimos 'input-fecha-gym' y quitamos flex-1 si lo tuviera */
                            className="input-fecha-gym w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pr-10 text-[11px] text-blue-500 outline-none uppercase min-h-[45px]"
                        />
                    </div>
                </div>

                {/* Carga + Repes */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Carga (kg)</label>
                        <input
                            required type="number" name="peso" step="0.1"
                            value={formData.peso} onChange={handleChange}
                            placeholder="0.0"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Repes</label>
                        <input
                            required type="number" name="repeticiones"
                            value={formData.repeticiones} onChange={handleChange}
                            placeholder="0"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* RPE Selector */}
                <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-2 flex items-center gap-4">
                    <input
                        type="range" min="5" max="10" step="0.5" name="rpe"
                        value={formData.rpe} onChange={handleChange}
                        className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className={`shrink-0 w-16 text-center text-[11px] font-black py-2 rounded-lg ${Number(formData.rpe) >= 9 ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
                        RPE {formData.rpe}
                    </div>
                </div>

                {/* Botón Principal */}
                <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full rounded-xl py-4 font-black text-white transition-all shadow-lg flex items-center justify-center gap-2 ${enviando ? 'bg-zinc-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-blue-900/20'}`}
                >
                    {enviando ? 'PROCESANDO...' : 'REGISTRAR SERIE ⚡'}
                </button>
            </form>
        </div>
    );
};

export default FormularioEjercicio;