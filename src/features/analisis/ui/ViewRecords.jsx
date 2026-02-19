import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../../../app/providers/GymProvider';

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

const ViewRecords = () => {
  const { data, loading } = useGym();
  const [musculoAbierto, setMusculoAbierto] = useState("");
  const navigate = useNavigate();

  const getRpeColor = (rpe) => {
    const n = Number(rpe);
    if (n <= 7) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (n <= 8.5) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  };


  const categorias = useMemo(() => {
    if (!data?.records || data.records.length === 0) return null;

    const grupos = {};

    data.records.forEach(item => {
      const nombreMusculo = item.records_por_rpe[0]?.["Musculo"] || "Otros";

      if (!grupos[nombreMusculo]) {
        grupos[nombreMusculo] = [];
      }

      const ejercicioProcesado = {
        nombre: item.ejercicio,
        rpes: item.records_por_rpe.reduce((acc, r) => {
          const rpeKey = String(r.RPE);
          const rmNuevo = Number(r.RM || 0);
          const rmExistente = acc[rpeKey]?.rm || 0;

          if (!acc[rpeKey] || rmNuevo > rmExistente) {
            acc[rpeKey] = {
              peso: r["Peso (kg)"],
              reps: r["Repeticiones"],
              fecha: r["Fecha"],
              rm: rmNuevo 
            };
          }
          return acc;
        }, {})
      };

      grupos[nombreMusculo].push(ejercicioProcesado);
    });

    return grupos;
  }, [data.records]);

  useEffect(() => {
    if (categorias && !musculoAbierto) {
      const primerMusculo = Object.keys(categorias)[0];
      setMusculoAbierto(primerMusculo);
    }
  }, [categorias, musculoAbierto]);

  if (loading) return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto pb-10 px-1">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-zinc-900/40 rounded-full shrink-0 animate-pulse" />)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    </div>
  );

  if (!categorias || Object.keys(categorias).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center italic text-zinc-500">
        No hay récords registrados aún.
      </div>
    );
  }

  const listaMusculos = Object.keys(categorias);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-10 animate-in fade-in duration-500">

      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar -mx-4 px-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        {listaMusculos.map((musculo) => (
          <button
            key={musculo}
            onClick={() => setMusculoAbierto(musculo)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shrink-0 border ${musculoAbierto === musculo
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] scale-105'
                : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10'
              }`}
          >
            {musculo}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {categorias[musculoAbierto]?.map((ej) => (
          <div key={ej.nombre} className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 px-1">
              <div className="h-4 w-1 bg-blue-600 rounded-full" />
              <h3 className="text-sm font-black italic text-white uppercase tracking-tighter">
                {ej.nombre}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.keys(ej.rpes).sort((a, b) => b - a).map((rpe) => (
                <div
                  key={rpe}
                  onClick={() => navigate("/history", { state: { nombreEjercicio: ej.nombre, rpeFiltrado: rpe } })}
                  className="bg-zinc-900/40 border border-white/5 p-4 rounded-[2rem] flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-all active:scale-95"
                >
                  <div className={`absolute top-3 right-4 px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-tighter ${getRpeColor(rpe)}`}>
                    RPE {rpe}
                  </div>

                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums">
                      {ej.rpes[rpe].peso > 0 ? ej.rpes[rpe].peso : ej.rpes[rpe].reps}
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

                  <span className="absolute -bottom-2 -left-1 text-4xl font-black text-white/[0.02] italic pointer-events-none group-hover:text-blue-500/5 transition-colors">
                    {rpe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRecords;
