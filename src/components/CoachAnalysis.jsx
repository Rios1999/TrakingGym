import React, { useState, useMemo } from 'react';
import GraficoProgreso from './GraficoProgreso';

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {
    // Estado para saber qué ejercicio está mirando el usuario en el gráfico
    const [ejercicioActivo, setEjercicioActivo] = useState("");

    // LÓGICA DE AVISO: Se ejecuta cada vez que cambia el ejercicio o los datos
    const alertaFatiga = useMemo(() => {
        if (!respuesta?.records || !ejercicioActivo) return null;

        // Filtramos el historial solo del ejercicio que estamos viendo
        const historialEjercicio = respuesta.records
            .filter(r => r.ejercicio === ejercicioActivo)
            .sort((a, b) => {
                const parse = (f) => f.includes('/') ? new Date(f.split('/').reverse().join('-')) : new Date(f);
                return parse(b.fecha) - parse(a.fecha); // Orden descendente (más nuevo primero)
            });

        if (historialEjercicio.length < 3) return null;

        // Comprobamos si el RM (puntosFuerza) ha bajado en las últimas 3 sesiones
        const n1 = historialEjercicio[0].puntosFuerza; // Entrenamiento HOY (ej: 90kg)
        const n2 = historialEjercicio[1].puntosFuerza; // Entrenamiento ANTERIOR (ej: 95kg)
        const n3 = historialEjercicio[2].puntosFuerza; // Entrenamiento TRAS-ANTERIOR (ej: 100kg)

        // Si hoy es menor que ayer Y ayer menor que antes de ayer -> BAJADA Sostenida
        if (n1 < n2 && n2 < n3) {
            const perdida = (((n3 - n1) / n3) * 100).toFixed(1);
            return {
                titulo: "Fatiga detectada en " + ejercicioActivo,
                mensaje: `Tu RM ha caído un ${perdida}% en las últimas 3 sesiones. Considera bajar la intensidad o descansar.`,
                nivel: "critico"
            };
        }
        return null;
    }, [respuesta, ejercicioActivo]);

    if (loading && !respuesta) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 rounded-[2.5rem] border border-white/5 animate-pulse">
                <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronizando...</span>
            </div>
        );
    }

    if (!loading && (!respuesta?.records || respuesta.records.length === 0)) {
        return <EmptyState onAction={onRefresh} title="Sin Historial" subtitle="Registra entrenamientos para ver tu evolución" />;
    }

    return (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto px-2">
            <div className="relative bg-zinc-900/40 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 pt-6 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Analítica de Rendimiento</span>
                        <h4 className="text-xl font-black italic tracking-tighter text-white uppercase mt-1">Evolución</h4>
                    </div>

                    <button onClick={onRefresh} disabled={loading} className="p-2.5 rounded-2xl bg-zinc-950 border border-white/10 text-emerald-500 transition-all active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
                        </svg>
                    </button>
                </div>

                {/* GRÁFICO: Pasamos la función setEjercicioActivo para sincronizar el aviso */}
                <div className="px-4 pb-4 min-h-[220px]">
                    <GraficoProgreso
                        records={respuesta.records}
                        analisis={respuesta.analisis}
                        onEjercicioChange={setEjercicioActivo} // Necesitas añadir esta prop en GraficoProgreso
                    />
                </div>

                {/* AVISO DEBAJO DEL GRÁFICO */}
                <div className="px-6 pb-6 pt-2">
                    <div className="w-full h-px bg-white/5 mb-4" />

                    {alertaFatiga ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                            <span className="text-lg">⚠️</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{alertaFatiga.titulo}</span>
                                <p className="text-[9px] text-zinc-400 font-medium leading-tight mt-1">{alertaFatiga.mensaje}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight text-center leading-relaxed">
                            Tendencia basada en RM estimado.<br />
                            Los puntos bajos pueden indicar fatiga acumulada.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Componente de Estado Vacío (Igual al anterior)
const EmptyState = ({ onAction, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800 w-full max-w-md mx-auto">
        <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl relative">
            <span className="text-2xl">📊</span>
            <div className="absolute -right-1 -top-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-zinc-950 animate-ping" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-2">{title}</h3>
        <p className="text-[10px] text-zinc-500 mb-8 font-bold uppercase leading-relaxed max-w-[200px]">
            {subtitle}
        </p>
        <button
            onClick={onAction}
            className="group flex items-center gap-3 px-8 py-4 bg-emerald-500 rounded-2xl font-black text-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
        >
            <svg className="group-hover:rotate-180 transition-transform duration-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
            </svg>
            Sincronizar Ahora
        </button>
    </div>
);

export default CoachAnalysis;