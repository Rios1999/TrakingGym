import { useState, useEffect, useRef, useCallback } from 'react';
import { gymApi } from '../api/gymApi';
import { useLocation,useNavigate } from 'react-router-dom';

const EjercicioHistorial = ({userId }) => {
    const [logs, setLogs] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate()
    const location = useLocation()

    const {nombreEjercicio,rpeFiltrado} = location.state || {}
    
    // Referencia para detectar el final de la lista
    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPagina(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Resetear todo cuando cambian los filtros principales
    useEffect(() => {
        setLogs([]);
        setPagina(1);
        setHasMore(true);
    }, [nombreEjercicio, rpeFiltrado, userId]);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (!userId || userId === "1" || !nombreEjercicio) return;

            setLoading(true);
            try {
                const response = await gymApi.getHistorialDetallado(
                    nombreEjercicio,
                    rpeFiltrado,
                    userId,
                    pagina
                );

                let dataLimpia = Array.isArray(response) ? response : (response?.records || []);

                setLogs(prev => {
                    // Evitamos duplicados por si acaso
                    const nuevosFiltered = dataLimpia.filter(
                        n => !prev.some(p => p.id === n.id)
                    );
                    return [...prev, ...nuevosFiltered];
                });

                // Si vienen menos de 10, es que ya no hay más en la DB
                setHasMore(dataLimpia.length === 10);

            } catch (error) {
                console.error("Error cargando logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [nombreEjercicio, rpeFiltrado, pagina, userId]);

    return (
        <div className="flex flex-col w-full max-w-md mx-auto pb-32 animate-in fade-in slide-in-from-right duration-500">
            
            {/* HEADER (Igual que antes) */}
            <div className="flex items-center justify-between mb-8 px-2">
                <button onClick={() => navigate(-1)} className="p-4 bg-zinc-900 rounded-[1.5rem] border border-white/5 text-zinc-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <div className="text-right">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">History RPE {rpeFiltrado}</span>
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">{nombreEjercicio}</h2>
                </div>
            </div>

            {/* LISTA DE LOGS */}
            <div className="flex flex-col gap-3 px-2">
                {logs.map((log, index) => {
                    // Si es el último elemento de la lista actual, le ponemos la referencia
                    const isLast = logs.length === index + 1;
                    return (
                        <div 
                            key={log.id || index} 
                            ref={isLast ? lastElementRef : null}
                            className="group relative overflow-hidden bg-zinc-900/40 border border-white/10 p-4 rounded-[1.8rem]"
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex flex-col gap-2">
                                    <span className="px-2 py-0.5 w-fit rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                                        {log.Fecha}
                                    </span>
                                    <span className="text-xs font-bold text-zinc-200 uppercase italic">
                                        {log.Musculo || 'Entrenamiento'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end pr-3 border-r border-white/5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white tracking-tighter tabular-nums">
                                                {log["Peso (kg)"] > 0 ? log["Peso (kg)"] : log["Repeticiones"]}
                                            </span>
                                            <span className="text-[10px] font-black text-blue-500 uppercase">
                                                {log["Peso (kg)"] > 0 ? 'kg' : 'reps'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] rounded-xl bg-zinc-950 border border-white/10">
                                        <span className="text-[7px] font-black text-zinc-500 uppercase mb-0.5">RPE</span>
                                        <span className="text-sm font-black text-white">{log["RPE / Esfuerzo"]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* SKELETON DE CARGA AL FINAL */}
                {loading && (
                    <div className="h-24 w-full bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5" />
                )}

                {/* MENSAJE FINAL */}
                {!hasMore && logs.length > 0 && (
                    <div className="text-center py-10 text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">
                        Fin del historial
                    </div>
                )}
                
                {!loading && logs.length === 0 && (
                    <div className="text-center py-10 text-zinc-600 font-black italic uppercase">No hay registros</div>
                )}
            </div>
        </div>
    );
};

export default EjercicioHistorial;