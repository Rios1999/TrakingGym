import React, { useEffect, useState } from 'react';
import { calcularRmEpley } from '../lib/fitnessUtils';
import { toast } from 'react-hot-toast';
import { gymApi } from '../api/gymApi';
import { useGym } from '../context/GymProvider';
import { useNavigate,useLocation } from 'react-router-dom';

const FormularioEjercicio = ({ userId }) => {
    const { enviarDatos } = useGym();
    const navigate = useNavigate();
    const location = useLocation();

    const hoy = new Date().toISOString().split('T')[0];
    const [enviando, setEnviando] = useState(false);
    const [cargandoPeso, setCargandoPeso] = useState(false);

    const [formData, setFormData] = useState({
        ejercicio: '',
        peso: '',
        tuPeso: '65',
        repeticiones: '',
        rpe: '8',
        fecha: hoy
    });

    const { ejercicioSeleccionado } = location.state || {};

    useEffect(() => {
        if (ejercicioSeleccionado) {
            setFormData(prev => ({
                ...prev,
                ejercicio: ejercicioSeleccionado.nombre
            }));
        }
    }, [ejercicioSeleccionado]);
    
    useEffect(() => {
        const fetchUltimoRegistro = async () => {
            if (!userId) return;
            setCargandoPeso(true);
            try {
                const ultimo = await gymApi.getUltimoRegistro(userId);
                const pesoCuerpo = ultimo?.ultimoPeso;
                if (pesoCuerpo) {
                    setFormData(prev => ({
                        ...prev,
                        tuPeso: pesoCuerpo
                    }));
                }
            } catch (err) {
                console.error("Error al traer el peso:", err);
            } finally {
                setCargandoPeso(false);
            }
        }
        fetchUltimoRegistro();
    }, [userId]);

    const rmEstimado = calcularRmEpley(formData.ejercicio, formData.peso, formData.tuPeso, formData.repeticiones, formData.rpe);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        const loadingToast = toast.loading('Guardando en la nube... ☁️');

        try {
            await enviarDatos({ ...formData, rmEstimado });
            if ("vibrate" in navigator) navigator.vibrate([30, 50, 30]);
            toast.success('¡Entrenamiento guardado!', { id: loadingToast });

            setFormData(prev => ({
                ...prev,
                ejercicio: '',
                peso: '',
                repeticiones: '',
                rpe: '8',
                fecha: hoy
            }));
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative px-4">
            <form onSubmit={handleSubmit} className="bg-zinc-950 p-4 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-5">

                {/* Visualizador de RM - Más refinado */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-[2rem] py-1 flex flex-col items-center justify-center">
                    <span className="text-[7px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-1">Estimated Max Power</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-3xl font-black text-white italic tracking-tighter leading-none">{rmEstimado}</span>
                        <span className="text-[10px] font-black text-blue-500 italic mt-auto">KG</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* SELECTOR DE EJERCICIO - Mejora UX Crítica */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Actividad</label>
                            <button
                                type="button"
                                onClick={() => navigate('/view')}
                                className="text-[9px] font-black text-blue-500 hover:text-white transition-colors uppercase"
                            >
                                Ver Récords ↗
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/view-ejercicio')}
                            className={`w-full relative p-4 rounded-2xl border transition-all duration-300 group overflow-hidden flex items-center justify-between active:scale-[0.97] ${formData.ejercicio
                                    ? 'bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                                    : 'bg-zinc-900/50 border-white/5 border-dashed'
                                }`}
                        >
                            <div className="flex flex-col items-start z-10">
                                <span className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${formData.ejercicio ? 'text-blue-500' : 'text-zinc-600'}`}>
                                    {formData.ejercicio ? 'Ejercicio' : 'Requerido'}
                                </span>
                                <span className={`text-sm font-black uppercase italic tracking-tighter ${formData.ejercicio ? 'text-white' : 'text-zinc-500'}`}>
                                    {formData.ejercicio || 'PULSA PARA SELECCIONAR...'}
                                </span>
                            </div>

                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${formData.ejercicio ? 'bg-blue-500 text-white shadow-blue-500/50 shadow-md' : 'bg-zinc-800 text-zinc-600'}`}>
                                {formData.ejercicio ? '✓' : '+'}
                            </div>

                            {!formData.ejercicio && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            )}
                        </button>
                    </div>

                    {/* INPUTS DE CARGA - Estilo "Control Block" */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-3 focus-within:border-blue-500/40 transition-all">
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Peso (Barra)</label>
                            <div className="flex items-center gap-1">
                                <input
                                    required type="number" name="peso" step="0.5"
                                    value={formData.peso} onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-800"
                                />
                                <span className="text-[10px] font-bold text-zinc-700 italic">KG</span>
                            </div>
                        </div>
                        <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-3 focus-within:border-blue-500/40 transition-all">
                            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Reps</label>
                            <div className="flex items-center gap-1">
                                <input
                                    required type="number" name="repeticiones"
                                    value={formData.repeticiones} onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-800"
                                />
                                <span className="text-[10px] font-bold text-zinc-700 italic">X</span>
                            </div>
                        </div>
                    </div>

                    {/* PESO CORPORAL - Diseño Slim */}
                    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl px-4 py-2 flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            {cargandoPeso ? 'Sincronizando...' : 'Peso Corporal'}
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                required type="number" name="tuPeso" step="0.1"
                                value={cargandoPeso ? '' : formData.tuPeso}
                                onChange={handleChange}
                                className="bg-transparent text-right text-sm font-black text-blue-500 outline-none w-12"
                            />
                            <span className="text-[8px] font-black text-zinc-700">KG</span>
                        </div>
                    </div>

                    {/* RPE - Más "Gaming" */}
                    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Esfuerzo (RPE)</label>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-black italic transition-colors ${Number(formData.rpe) >= 9 ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                RPE {formData.rpe}
                            </div>
                        </div>
                        <input
                            type="range" min="5" max="10" step="0.5" name="rpe"
                            value={formData.rpe} onChange={handleChange}
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                {/* BOTÓN SUBMIT - El gran final */}
                <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full rounded-2xl py-4 font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${enviando
                            ? 'bg-zinc-800 text-zinc-600'
                            : 'bg-white text-black hover:bg-blue-500 hover:text-white'
                        }`}
                >
                    {enviando ? 'Sincronizando...' : 'Registrar Marca ⚡'}
                </button>
            </form>
        </div>
    );
};

export default FormularioEjercicio;