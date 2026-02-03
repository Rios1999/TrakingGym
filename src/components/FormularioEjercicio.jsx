import React, { useState, useMemo } from 'react';

// Añadimos userId como prop por si necesitas usarlo internamente
const FormularioEjercicio = ({ onEnviar, userId }) => {
    const hoy = new Date().toISOString().split('T')[0];
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [enviando, setEnviando] = useState(false);

    const [formData, setFormData] = useState({
        ejercicio: '',
        peso: '',
        tuPeso: '65', 
        repeticiones: '',
        rpe: '8',
        fecha: hoy
    });

    const rmEstimado = useMemo(() => {
        const pBarra = parseFloat(formData.peso) || 0;
        const pCuerpo = parseFloat(formData.tuPeso) || 0;
        const r = parseInt(formData.repeticiones) || 0;
        const pesoTotal = pBarra + pCuerpo;

        if (pesoTotal > 0 && r > 0) {
            return (pesoTotal * (1 + r / 30)).toFixed(1);
        }
        return "0.0";
    }, [formData.peso, formData.tuPeso, formData.repeticiones]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setErrorMsg('');

        try {
            // Enviamos todo el objeto incluyendo explícitamente el user_id
            await onEnviar({
                ...formData,
                user_id: userId, // ID proveniente de Supabase Auth
                peso: Number(formData.peso),
                peso_corporal: Number(formData.tuPeso),
                repeticiones: Number(formData.repeticiones),
                rpe: Number(formData.rpe),
                rm: Number(rmEstimado)
            });

            if ("vibrate" in navigator) navigator.vibrate([30, 50, 30]);
            setMostrarNotificacion(true);
            setTimeout(() => setMostrarNotificacion(false), 3000);

            setFormData(prev => ({
                ...prev,
                ejercicio: '',
                peso: '',
                repeticiones: '',
                rpe: '8',
                fecha: hoy
            }));

        } catch (error) {
            setErrorMsg(error.message || "Error al conectar con el servidor");
            setTimeout(() => setErrorMsg(''), 5000);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative px-4">
            {/* NOTIFICACIONES */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${mostrarNotificacion ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
                <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg font-black text-[10px] uppercase tracking-widest border border-white/20">
                    RM Actualizado ⚡
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-zinc-950 p-4 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
                {/* Visualizador de RM Dinámico */}
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-2 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Potencial Estimado (1RM TOTAL)</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white italic tracking-tighter">{rmEstimado}</span>
                        <span className="text-xs font-bold text-blue-500 italic">KG</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1 ml-1">Ejercicio</label>
                        <input
                            required type="text" name="ejercicio"
                            value={formData.ejercicio} onChange={handleChange}
                            placeholder="Ej: Sentadilla Zumo"
                            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-2 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2 ml-1">Peso Barra</label>
                            <input
                                required type="number" name="peso" step="0.5"
                                value={formData.peso} onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-2 text-lg font-black text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-2 ml-1">Repeticiones</label>
                            <input
                                required type="number" name="repeticiones"
                                value={formData.repeticiones} onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-2 text-lg font-black text-white outline-none focus:border-blue-500/50"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-1 transition-all focus-within:border-blue-500/40">
                        <label className="text-[9px] font-black text-blue-500/70 uppercase tracking-widest block  ml-1 text-center">
                            Tu Peso Corporal (Base)
                        </label>
                        <div className="relative">
                            <input
                                required
                                type="number"
                                name="tuPeso"
                                step="0.1"
                                value={formData.tuPeso}
                                onChange={handleChange}
                                className="w-full bg-transparent text-2xl font-black text-white text-center outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500/40 uppercase">KG</span>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-3">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Esfuerzo (RPE)</label>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${Number(formData.rpe) >= 9 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                                {formData.rpe}
                            </span>
                        </div>
                        <input
                            type="range" min="5" max="10" step="0.5" name="rpe"
                            value={formData.rpe} onChange={handleChange}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                        />
                        <p className="text-[8px] text-zinc-500 font-bold uppercase text-center italic">
                            {formData.rpe === '10' ? 'Fallo muscular o técnica rota' : formData.rpe >= '8' ? 'Cerca del fallo (1-2 reps extra)' : 'Moderado'}
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full rounded-2xl py-4 font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${enviando ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black hover:bg-blue-500 hover:text-white active:scale-95'}`}
                >
                    {enviando ? 'Guardando...' : 'Guardar ⚡'}
                </button>
            </form>
            {errorMsg && <p className="text-red-500 text-[10px] text-center mt-4 font-bold uppercase">{errorMsg}</p>}
        </div>
    );
};

export default FormularioEjercicio;