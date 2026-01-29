import { useState, useMemo } from 'react';

const ViewRecords = ({ respuesta, onSelectEjercicio }) => {
  const [musculoAbierto, setMusculoAbierto] = useState("Pierna");

  const categorias = useMemo(() => {
    if (!respuesta || !respuesta.records) return null;
    const grupos = {};
    respuesta.records.forEach(rec => {
      const musculo = rec.musculo || "Otros";
      if (!grupos[musculo]) grupos[musculo] = {};
      const nombreEj = rec.ejercicio;
      if (!grupos[musculo][nombreEj]) grupos[musculo][nombreEj] = { nombre: nombreEj, rpes: {} };
      const rpeKey = String(rec.rpe);
      const pesoActual = Number(rec.peso) || 0;
      const repsActual = Number(rec.reps) || 0;
      const recordExistente = grupos[musculo][nombreEj].rpes[rpeKey];
      const esMejor = !recordExistente || (pesoActual > recordExistente.peso) || (pesoActual === recordExistente.peso && repsActual > recordExistente.reps);
      if (esMejor) {
        grupos[musculo][nombreEj].rpes[rpeKey] = { peso: pesoActual, reps: repsActual, fecha: rec.fecha };
      }
    });
    const final = {};
    Object.keys(grupos).forEach(m => final[m] = Object.values(grupos[m]));
    return final;
  }, [respuesta]);

  const getRpeStyle = (rpe) => {
    const n = Number(rpe);
    if (n <= 7) return 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20';
    if (n <= 8.5) return 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20';
    return 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/20';
  };

  if (!categorias) return <div className="p-10 text-center animate-pulse text-zinc-500 font-black italic">LOADING DATA...</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto pb-20">
      {Object.keys(categorias).map((musculo) => (
        <div key={musculo} className="flex flex-col w-full px-2">
          
          {/* BOTÓN ACORDEÓN MEJORADO */}
          <button
            onClick={() => setMusculoAbierto(musculoAbierto === musculo ? "" : musculo)}
            className={`flex justify-between items-center p-5 rounded-3xl border transition-all duration-300 ${
              musculoAbierto === musculo 
              ? 'bg-zinc-900 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
              : 'bg-zinc-900/40 border-white/5 opacity-70'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">{musculo}</span>
            <div className={`transition-transform duration-300 ${musculoAbierto === musculo ? 'rotate-180 text-blue-500' : 'text-zinc-600'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </button>

          {/* CONTENEDOR ANIMADO */}
          <div className={`grid grid-cols-1 gap-8 transition-all duration-500 ease-in-out ${
            musculoAbierto === musculo ? 'max-h-[2000px] opacity-100 mt-6 mb-10' : 'max-h-0 opacity-0 pointer-events-none'
          }`}>
            
            {categorias[musculo].map((ej) => (
              <div key={ej.nombre} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Título de Ejercicio con Línea */}
                <div className="flex items-center gap-3 px-2">
                  <h3 className="text-xs font-black italic text-white uppercase tracking-wider whitespace-nowrap">{ej.nombre}</h3>
                  <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/50 to-transparent" />
                </div>

                {/* GRID 2x2 DE TARJETAS */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(ej.rpes).sort((a,b) => b-a).map((rpe) => {
                    const esBW = ej.rpes[rpe].peso === 0;
                    return (
                      <div 
                        key={rpe}
                        onClick={() => onSelectEjercicio && onSelectEjercicio(ej.nombre, rpe)}
                        className={`relative group overflow-hidden bg-gradient-to-br p-[1px] rounded-[1.8rem] ${getRpeStyle(rpe)} transition-transform active:scale-95`}
                      >
                        <div className="bg-zinc-950 rounded-[1.8rem] p-4 h-full">
                          {/* Header de la tarjeta */}
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">{ej.rpes[rpe].fecha}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border ${getRpeStyle(rpe)}`}>RPE {rpe}</span>
                          </div>

                          {/* Valor Principal */}
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter tabular-nums leading-none">
                              {esBW ? ej.rpes[rpe].reps : ej.rpes[rpe].peso}
                            </span>
                            <span className="text-[9px] font-black text-blue-500 uppercase italic">
                              {esBW ? 'reps' : 'kg'}
                            </span>
                          </div>

                          {/* Info Secundaria */}
                          <div className="mt-1">
                            {esBW ? (
                              <span className="text-[8px] font-black text-emerald-500 uppercase italic tracking-tighter">Bodyweight</span>
                            ) : (
                              <span className="text-[9px] font-bold text-zinc-500 lowercase">x{ej.rpes[rpe].reps} reps</span>
                            )}
                          </div>

                          {/* Marca de agua de fondo */}
                          <span className="absolute -bottom-2 -right-1 text-5xl font-black text-white/[0.03] italic group-hover:text-blue-500/10 transition-colors">
                            {rpe}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewRecords;