import React from 'react';
import GraficoProgreso from './GraficoProgreso'; // Ajusta la ruta según tu proyecto

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {
  
  // Función para formatear el texto de la IA correctamente
  const renderLineas = (analisis) => {
    if (!analisis) return null;
    
    // Separamos por punto seguido de espacio para no romper decimales como 91.67
    return analisis.split(/\.\s+/).map((linea, index) => {
      const texto = linea.trim().replace(/\.$/, ""); // Quitamos punto final si existe
      if (texto.length < 5 || texto.toLowerCase().includes("sin datos")) return null;

      return (
        <div key={index} className="flex items-start gap-4 border-b border-white/[0.03] pb-4 last:border-0">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0"></div>
          <p className="text-[13px] text-zinc-200 font-bold leading-snug tracking-tight">
            {texto}.
          </p>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2.5rem] blur opacity-10"></div>

        <div className="relative bg-zinc-950/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 border-l-4 border-l-emerald-500 shadow-xl">
          
          <div className="flex justify-between items-start mb-6">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </button>

              {/* BADGE DE MEJORA */}
              {respuesta?.mejoraGlobal > 0 && (
                <div className="flex flex-col items-end">
                  <div className="bg-emerald-500 text-black text-[14px] font-[900] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] skew-x-[-10deg]">
                    +{respuesta.mejoraGlobal.toString().replace('.', ',')}%
                  </div>
                </div>
              )}
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

      <div className="bg-zinc-900/40 p-6 rounded-[3rem] border border-white/5">
        <GraficoProgreso records={respuesta?.records || []} />
      </div>
    </div>
  );
};

export default CoachAnalysis;