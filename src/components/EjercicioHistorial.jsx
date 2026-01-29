import { useState, useEffect } from 'react';
import { gymApi } from '../api/gymApi';

const EjercicioHistorial = ({ nombreEjercicio, rpeFiltrado, onVolver }) => {
    const [logs, setLogs] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchHistorial = async () => {
            setLoading(true);
            try {
                const data = await gymApi.getHistorialDetallado(nombreEjercicio, rpeFiltrado, pagina);

                // BLINDAJE: Nos aseguramos de que logs siempre sea un array
                const recordsValidos = Array.isArray(data) ? data : (data?.records || []);

                console.log(recordsValidos)

                setLogs(recordsValidos);
                setHasMore(recordsValidos.length === 10);
            } catch (error) {
                console.error("Error cargando logs:", error);
                setLogs([]); // Si hay error, vaciamos para que no rompa el .map
            } finally {
                setLoading(false);
            }
        };

        fetchHistorial();
    }, [nombreEjercicio, rpeFiltrado, pagina]);

    return (
        <div className="flex flex-col w-full max-w-md mx-auto pb-32 animate-in fade-in slide-in-from-right duration-500">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 px-2">
                <button
                    onClick={onVolver}
                    className="p-4 bg-zinc-900 rounded-[1.5rem] border border-white/5 text-zinc-400 active:scale-90 transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>

                <div className="text-right">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                        History RPE {rpeFiltrado}
                    </span>
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">
                        {nombreEjercicio}
                    </h2>
                </div>
            </div>

            {/* LISTA DE LOGS */}
            <div className="flex flex-col gap-3 px-2">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 w-full bg-zinc-900/40 rounded-[2rem] animate-pulse border border-white/5" />
                    ))
                ) : logs.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 font-black italic uppercase">No hay registros</div>
                ) : (
                    logs.map((log, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden bg-zinc-900/40 border border-white/10 p-4 rounded-[1.8rem] transition-all duration-300 hover:bg-zinc-900/60 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                        >
                            {/* Decoración lateral sutil para RPE alto */}
                            {parseInt(log['RPE / Esfuerzo']) >= 9 && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50" />
                            )}

                            <div className="flex justify-between items-center gap-4">

                                {/* SECCIÓN IZQUIERDA: Fecha y Contexto */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                                            {log.Fecha}
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-200 tracking-tight leading-none uppercase italic">
                                            {log.Musculo || 'Entrenamiento'}
                                        </span>
                                    </div>
                                </div>

                                {/* SECCIÓN DERECHA: Datos de Carga y RPE */}
                                <div className="flex items-center gap-3">

                                    {/* Bloque de Carga */}
                                    <div className="flex flex-col items-end pr-3 border-r border-white/5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">
                                                {log['Peso (kg)'] || log.Repeticiones}
                                            </span>
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                                                {log['Peso (kg)'] > 0 ? 'kg' : 'reps'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase leading-none mt-1">
                                            {log['Peso (kg)'] > 0 ? `${log.Repeticiones} Reps` : 'Bodyweight'}
                                        </span>
                                    </div>

                                    {/* Badge de RPE Circular/Moderno */}
                                    <div className="flex flex-col items-center justify-center min-w-[40px] h-[40px] rounded-xl bg-zinc-950 border border-white/10 shadow-inner group-hover:border-blue-500/50 transition-colors">
                                        <span className="text-[7px] font-black text-zinc-500 uppercase leading-none mb-0.5">RPE</span>
                                        <span className="text-sm font-black text-white leading-none">
                                            {log['RPE / Esfuerzo']}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            {/* Brillo de fondo interactivo */}
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER */}
            {!loading && logs.length > 0 && (
                <div className="mt-12 flex items-center justify-between px-6">
                    <button
                        disabled={pagina === 1}
                        onClick={() => setPagina(p => p - 1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-0 transition-all"
                    >
                        <div className="p-3 bg-zinc-900 rounded-xl border border-white/5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6" /></svg>
                        </div>
                        Prev
                    </button>

                    <button
                        disabled={!hasMore}
                        onClick={() => setPagina(p => p + 1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 disabled:opacity-0 transition-all"
                    >
                        Next
                        <div className="p-3 bg-zinc-900 rounded-xl border border-blue-500/20">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default EjercicioHistorial;