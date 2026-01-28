import GraficoProgreso from './GraficoProgreso';

const CoachAnalysis = ({ respuesta, loading, onRefresh }) => {
    
    // Si no hay datos y no está cargando, mostramos el estado vacío
    if (!loading && (!respuesta?.records || respuesta.records.length === 0)) {
        return <EmptyState onAction={onRefresh} title="Sin Análisis" />;
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            
            {/* CONTENEDOR PRINCIPAL DEL GRÁFICO */}
            <div className="relative group bg-zinc-900/40 p-1 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
                
                {/* HEADER DEL COMPONENTE */}
                <div className="flex justify-between items-center px-8 pt-6 pb-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                            Analytics
                        </span>
                        <h4 className="text-xl font-black italic tracking-tighter text-white uppercase">
                            Evolución
                        </h4>
                    </div>

                    {/* BOTÓN DE REFRESCO INTEGRADO */}
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`p-3 rounded-2xl bg-zinc-950 border border-white/10 text-emerald-500 transition-all active:scale-90 hover:bg-zinc-900 shadow-lg ${
                            loading ? 'animate-spin opacity-50' : 'opacity-100'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                    </button>
                </div>

                {/* ÁREA DEL GRÁFICO */}
                <div className="p-2 ">
                    {loading && !respuesta ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                                Procesando Datos...
                            </p>
                        </div>
                    ) : (
                        <GraficoProgreso 
                            records={respuesta?.records} 
                            analisis={respuesta?.analisis} 
                        />
                    )}
                </div>
            </div>

            {/* NOTA PIE DE PÁGINA (Opcional) */}
            {!loading && (
                <p className="text-[9px] text-center text-zinc-600 uppercase font-bold tracking-widest">
                    Datos actualizados según los últimos registros
                </p>
            )}

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

// Componente para cuando no hay datos (Empty State)
const EmptyState = ({ onAction, title }) => (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-zinc-950/50 rounded-[3rem] border border-dashed border-zinc-800 max-w-md mx-auto">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-xl">
            <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-3">{title}</h3>
        <p className="text-[11px] text-zinc-500 mb-8 leading-relaxed uppercase font-bold">
            No hemos detectado registros previos.<br/>Sincroniza para analizar tu progresión.
        </p>
        <button
            onClick={onAction}
            className="group relative px-8 py-4 bg-emerald-500 rounded-2xl overflow-hidden transition-all active:scale-95"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative text-black text-[10px] font-black uppercase tracking-widest">
                Sincronizar Cloud
            </span>
        </button>
    </div>
);

export default CoachAnalysis;