import React from 'react';
import GraficoProgreso from './GraficoProgreso'; // Ajusta la ruta según tu proyecto

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {

    // Función para formatear el texto de la IA correctamente
    const renderLineas = (analisis) => {
        if (!analisis) return null;

        return analisis.split(/\.\s+/).map((linea, index) => {
            const texto = linea.trim().replace(/\.$/, "");
            if (texto.length < 5 || texto.toLowerCase().includes("sin datos")) return null;

            const partes = texto.split(/:\s+/);
            const nombreEjercicio = partes[0];
            const restoTexto = partes[1] || "";

            const esNegativo = restoTexto.includes("-");
            const esCero = restoTexto.includes("0,00%");

            // Estilos dinámicos para la etiqueta
            const estiloEtiqueta = esNegativo
                ? "text-red-500 border-red-500/20 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                : esCero
                    ? "text-zinc-500 border-zinc-500/20 bg-zinc-500/5"
                    : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]";

            return (
                <div key={index} className="flex flex-row items-center justify-between py-2 border-b border-white/5 last:border-0 bg-transparent">
                    <div className="flex items-center gap-2">
                        <div className={`h-1 w-1 rounded-full ${esNegativo ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                            {nombreEjercicio}
                        </span>
                    </div>

                    {/* Etiqueta de Porcentaje */}
                    <div className={`px-1.5  rounded-md border ${estiloEtiqueta} backdrop-blur-sm`}>
                        <span className="text-[13px] font-black tracking-tighter tabular-nums">
                            {restoTexto}
                        </span>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2.5rem] blur opacity-10"></div>

                <div className="relative bg-zinc-950/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 border-l-4 border-l-emerald-500 shadow-xl">

                    <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">IA Coach</span>
                            <h4 className="text-xl font-black italic tracking-tighter text-white uppercase">Reporte</h4>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* BOTÓN ACTUALIZAR */}
                            <button
                                onClick={onRefresh}
                                disabled={loading}
                                className={`p-2 rounded-full bg-zinc-900 border border-white/5 text-emerald-500 transition-all active:scale-95 ${loading ? 'animate-spin' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading && !respuesta ? (
                            <div className="py-10 text-center animate-pulse">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Analizando Progresión...</p>
                            </div>
                        ) : respuesta?.analisis ? (
                            renderLineas(respuesta.analisis)
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No hay datos para analizar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {respuesta?.records && <div className="bg-zinc-900/40 p-6 rounded-[3rem] border border-white/5">
                <GraficoProgreso records={respuesta.records} />
            </div>}

        </div>
    );
};

export default CoachAnalysis;