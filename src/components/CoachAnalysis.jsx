import React, { useState, useMemo, useEffect } from 'react';
import GraficoProgreso from './GraficoProgreso';

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {
    const [rpeFiltro, setRpeFiltro] = useState("");

    // 1. Obtener RPEs disponibles
    const rpesDisponibles = useMemo(() => {
        if (!respuesta?.analisis) return [];
        const uniqueRpes = [...new Set(respuesta.analisis.map(a => String(a.rpe)))];
        return uniqueRpes.sort((a, b) => Number(a) - Number(b));
    }, [respuesta]);

    // 2. Auto-selección inteligente
    useEffect(() => {
        if (!loading && rpesDisponibles.length > 0) {
            if (!rpeFiltro || !rpesDisponibles.includes(String(rpeFiltro))) {
                if (rpesDisponibles.includes("8")) {
                    setRpeFiltro("8");
                } else {
                    setRpeFiltro(rpesDisponibles[0]);
                }
            }
        }
    }, [rpesDisponibles, loading, rpeFiltro]);

    // 3. Filtrado de datos
    const datosFiltrados = useMemo(() => {
        if (!respuesta || !rpeFiltro) return { records: [], analisis: [] };
        return {
            records: (respuesta.records || []).filter(r => String(r.rpe) === String(rpeFiltro)),
            analisis: (respuesta.analisis || []).filter(a => String(a.rpe) === String(rpeFiltro))
        };
    }, [respuesta, rpeFiltro]);

    // --- RENDERIZADO DE ESTADOS ---

    // A. Si está cargando por primera vez
    if (loading && !respuesta) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 rounded-[2.5rem] border border-white/5 animate-pulse">
                <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sincronizando...</span>
            </div>
        );
    }

    // B. Si la respuesta está vacía o no hay registros mínimos
    const tieneDatos = respuesta?.records && respuesta.records.length > 0;
    if (!loading && !tieneDatos) {
        return <EmptyState onAction={onRefresh} title="Sin Historial" subtitle="Registra al menos 2 entrenamientos para ver tu progreso" />;
    }

    return (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto px-2">
            <div className="relative bg-zinc-900/40 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
                
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 pt-6 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                            {rpeFiltro ? `Tendencia RPE ${rpeFiltro}` : "Analítica"}
                        </span>
                        <h4 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none mt-1">
                            Evolución
                        </h4>
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`p-2.5 rounded-2xl bg-zinc-950 border border-white/10 text-emerald-500 transition-all hover:border-emerald-500/30 active:scale-90 ${
                            loading ? 'animate-spin opacity-50' : 'opacity-100'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                    </button>
                </div>

                {/* CUERPO CENTRAL (Gráfico o EmptyState de Filtro) */}
                <div className="px-4 pb-4 min-h-[220px] flex flex-col justify-center"> 
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : datosFiltrados.analisis.length > 0 ? (
                        <GraficoProgreso 
                            records={datosFiltrados.records} 
                            analisis={datosFiltrados.analisis} 
                        />
                    ) : (
                        <div className="py-8 text-center bg-zinc-950/30 rounded-[2rem] border border-dashed border-white/5">
                            <span className="text-2xl mb-2 block">📈</span>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight px-6">
                                Datos insuficientes para RPE {rpeFiltro}. <br/>Sigue entrenando a esta intensidad.
                            </p>
                        </div>
                    )}
                </div>

                {/* SELECTOR DE RPE */}
                {rpesDisponibles.length > 0 && (
                    <div className="px-8 pb-8 pt-2">
                        <div className="w-full h-px bg-white/5 mb-4" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-3 text-center">
                            Filtrar por Intensidad
                        </span>
                        <div className="flex gap-2 justify-center">
                            {rpesDisponibles.map((rpe) => (
                                <button
                                    key={rpe}
                                    onClick={() => !loading && setRpeFiltro(String(rpe))}
                                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] transition-all border ${
                                        String(rpeFiltro) === String(rpe)
                                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                                        : 'bg-zinc-950 border-white/5 text-zinc-500 hover:border-zinc-700'
                                    }`}
                                >
                                    {rpe}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente de Estado Vacío Mejorado
const EmptyState = ({ onAction, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-800 w-full max-w-md mx-auto">
        <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl relative">
            <span className="text-2xl">📊</span>
            <div className="absolute -right-1 -top-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-zinc-950 animate-ping" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-2">{title}</h3>
        <p className="text-[10px] text-zinc-500 mb-8 font-bold uppercase leading-relaxed max-w-[200px]">
            {subtitle || "No hay registros suficientes para procesar el análisis"}
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