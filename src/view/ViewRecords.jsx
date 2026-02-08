import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../context/GymProvider';

// Sub-componente para el efecto de carga
const SkeletonCard = () => (
  <div className="bg-zinc-900/20 border border-white/5 p-5 rounded-[2.2rem] animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 w-20 bg-white/10 rounded-full" />
      <div className="h-4 w-12 bg-white/10 rounded-full" />
    </div>
    <div className="h-8 w-24 bg-white/10 rounded-lg mb-2" />
    <div className="h-3 w-16 bg-white/5 rounded-full" />
  </div>
);

const ViewRecords = ({ userId }) => {
  const { data, loading } = useGym();
  const [musculoAbierto, setMusculoAbierto] = useState("Pierna");
  const navigate = useNavigate()

  const getRpeColor = (rpe) => {
    const n = Number(rpe);
    if (n <= 7) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (n <= 8.5) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  };

  // Procesamiento de datos
  const categorias = useMemo(() => {
    // Si no hay respuesta, devolvemos null para activar el esqueleto
    if (!data?.records) return null;

    const grupos = {};
    data.records.forEach(rec => {
      const musculo = rec.musculo || "Otros";
      if (!grupos[musculo]) grupos[musculo] = {};

      const nombreEj = rec.ejercicio;
      if (!grupos[musculo][nombreEj]) grupos[musculo][nombreEj] = { nombre: nombreEj, rpes: {} };

      const rpeKey = String(rec.rpe);
      const pesoActual = Number(rec.peso) || 0;
      const repsActual = Number(rec.reps) || 0;

      const recordExistente = grupos[musculo][nombreEj].rpes[rpeKey];
      const esMejor = !recordExistente ||
        (pesoActual > recordExistente.peso) ||
        (pesoActual === recordExistente.peso && repsActual > recordExistente.reps);

      if (esMejor) {
        grupos[musculo][nombreEj].rpes[rpeKey] = {
          peso: pesoActual,
          reps: repsActual,
          fecha: rec.fecha
        };
      }
    });

    const final = {};
    Object.keys(grupos).forEach(m => final[m] = Object.values(grupos[m]));
    return final;
  }, [data.records]);


  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto pb-10">
        <div className="h-16 w-full bg-zinc-900/40 rounded-[2rem] animate-pulse mb-2" />
        <div className="px-4 border-l-2 border-blue-900 ml-1">
          <div className="h-4 w-32 bg-zinc-900 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2 px-1">
          <SkeletonCard /><SkeletonCard />
          <SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  // 2. SI NO HAY DATOS: Empty State (Prioridad 2)
  if (!data?.records || data.records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-700">
        {/* Tu código de HISTORIAL VACÍO */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto pb-10 animate-in fade-in duration-500">
      {Object.keys(categorias).map((musculo) => (
        <div key={musculo} className="flex flex-col w-full">
          <button
            onClick={() => setMusculoAbierto(musculoAbierto === musculo ? "" : musculo)}
            className={`flex justify-between items-center p-5 rounded-[2rem] border transition-all ${musculoAbierto === musculo ? 'bg-zinc-900 border-white/20 mb-2' : 'bg-zinc-900/40 border-white/5 opacity-50'
              }`}
          >
            <span className="text-xs font-black uppercase tracking-widest text-white">{musculo}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={`transition-transform duration-300 ${musculoAbierto === musculo ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
          </button>

          <div className={`flex flex-col gap-5 transition-all ${musculoAbierto === musculo ? 'opacity-100 mb-8 pt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {categorias[musculo].map((ej) => (
              <div key={ej.nombre} className="flex flex-col gap-3">
                <div className="px-4 border-l-2 border-blue-600 ml-1">
                  <h3 className="text-sm font-black italic text-zinc-100 uppercase tracking-tighter">{ej.nombre}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 px-1">
                  {Object.keys(ej.rpes).sort((a, b) => b - a).map((rpe) => (
                    <div
                      key={rpe}
                      onClick={() => { navigate("/history", { state: { nombreEjercicio: ej.nombre, rpeFiltrado: rpe } }) }}
                      className="bg-zinc-900/40 border border-white/5 p-4 rounded-[2rem] flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-colors cursor-pointer"
                    >
                      <div className={`absolute top-3 right-4 px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-tighter ${getRpeColor(rpe)}`}>
                        RPE {rpe}
                      </div>

                      <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-2xl font-black text-white tracking-tighter tabular-nums">
                          {ej.rpes[rpe].peso || ej.rpes[rpe].reps}
                        </span>
                        <span className="text-[9px] font-black text-blue-500 uppercase">
                          {ej.rpes[rpe].peso > 0 ? 'kg' : 'reps'}
                        </span>
                      </div>

                      <div className="flex justify-between items-end mt-1">
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">
                          {ej.rpes[rpe].peso > 0 ? `${ej.rpes[rpe].reps} reps` : 'Bodyweight'}
                        </span>
                        <span className="text-[7px] text-zinc-800 font-bold">{ej.rpes[rpe].fecha}</span>
                      </div>

                      <span className="absolute -bottom-2 -left-1 text-4xl font-black text-white/[0.02] italic pointer-events-none">
                        {rpe}
                      </span>
                    </div>
                  ))}
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