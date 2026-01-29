import React, { useState, useMemo, useEffect } from 'react';
import GraficoProgreso from './GraficoProgreso';

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {
    // Iniciamos vacío para que el sistema elija el mejor RPE disponible al cargar
    const [rpeFiltro, setRpeFiltro] = useState("");

    // 1. Obtener todos los RPEs que tienen datos de análisis
    const rpesDisponibles = useMemo(() => {
        if (!respuesta?.analisis) return [];
        const uniqueRpes = [...new Set(respuesta.analisis.map(a => String(a.rpe)))];
        return uniqueRpes.sort((a, b) => Number(a) - Number(b));
    }, [respuesta]);

    // 2. Lógica de Auto-selección
    useEffect(() => {
        if (!loading && rpesDisponibles.length > 0) {
            // Si no hay filtro seleccionado o el seleccionado ya no existe en los nuevos datos
            if (!rpeFiltro || !rpesDisponibles.includes(String(rpeFiltro))) {
                // Priorizar RPE 8 si existe, si no, el primero de la lista
                if (rpesDisponibles.includes("8")) {
                    setRpeFiltro("8");
                } else {
                    setRpeFiltro(rpesDisponibles[0]);
                }
            }
        }
    }, [rpesDisponibles, loading, rpeFiltro]);

    // 3. Filtrar los datos que se le pasan al gráfico según el RPE seleccionado
    const datosFiltrados = useMemo(() => {
        if (!respuesta || !rpeFiltro) return { records: [], analisis: [] };
        return {
            records: respuesta.records.filter(r => String(r.rpe) === String(rpeFiltro)),
            analisis: respuesta.analisis.filter(a => String(a.rpe) === String(rpeFiltro))
        };
    }, [respuesta, rpeFiltro]);

    // Estado de carga inicial o vacío
    if (!loading && (!respuesta?.records || respuesta.records.length === 0)) {
        return <EmptyState onAction={onRefresh} title="Sin Análisis" />;
    }

    return (
        <div className="flex flex-col gap-3 w-full max-w-md mx-auto px-2">
            
            <div className="relative bg-zinc-900/40 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                
                {/* HEADER */}
                <div className="flex justify-between items-center px-4 pt-4 pb-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                            {rpeFiltro ? `Analytics RPE ${rpeFiltro}` : "Analizando..."}
                        </span>
                        <h4 className="text-xl font-black italic tracking-tighter text-white uppercase leading-none mt-1">
                            Evolución
                        </h4>
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`p-2.5 rounded-xl bg-zinc-950 border border-white/10 text-emerald-500 transition-all active:scale-90 ${
                            loading ? 'animate-spin opacity-50' : 'opacity-100'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                    </button>
                </div>

                {/* CUERPO DEL GRÁFICO */}
                <div className="px-2 pb-2"> 
                    {(loading || !rpeFiltro) ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <GraficoProgreso 
                            records={datosFiltrados.records} 
                            analisis={datosFiltrados.analisis} 
                        />
                    )}
                </div>

                {/* SELECTOR DE RPE DINÁMICO */}
                {rpesDisponibles.length > 0 && (
                    <div className="px-8 pb-6 pt-4 bg-transparent">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-2 text-center opacity-70">
                            CAMBIAR NIVEL DE ESFUERZO
                        </span>
                        <div className="flex gap-2 justify-center">
                            {rpesDisponibles.map((rpe) => (
                                <button
                                    key={rpe}
                                    onClick={() => setRpeFiltro(String(rpe))}
                                    className={`flex-1 py-2.5 rounded-xl font-black text-[10px] transition-all border ${
                                        String(rpeFiltro) === String(rpe)
                                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                                        : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-zinc-700'
                                    }`}
                                >
                                    RPE {rpe}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FEEDBACK INFERIOR */}
            {!loading && rpeFiltro && (
                <p className="text-[8px] text-center text-zinc-600 uppercase font-black tracking-[0.2em] opacity-40">
                    MOSTRANDO TENDENCIA PARA INTENSIDAD {rpeFiltro}
                </p>
            )}
        </div>
    );
};

const EmptyState = ({ onAction, title }) => (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-zinc-950/50 rounded-[2.5rem] border border-dashed border-zinc-800 max-w-sm mx-auto">
        <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-xl">
            <span className="text-xl">📊</span>
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-2">{title}</h3>
        <p className="text-[10px] text-zinc-600 mb-8 font-bold uppercase">No hay registros suficientes para analizar</p>
        <button onClick={onAction} className="px-8 py-3 bg-emerald-500 rounded-xl font-black text-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
            Sincronizar Datos
        </button>
    </div>
);

export default CoachAnalysis;