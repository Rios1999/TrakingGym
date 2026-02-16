import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import ejerciciosDb from '../../tools/bbdd_ejercicio.json';

const ViewSelectEjercicio = ({ onSelectEjercicio }) => {
  const navigate = useNavigate();
  const categoriasUnicas = useMemo(() => {
    const cats = [...new Set(ejerciciosDb.map((e) => e.categoria))];
    return cats.sort((a, b) => a.localeCompare(b));
  }, []);

  const [categoriaAbierta, setCategoriaAbierta] = useState(
    categoriasUnicas[0] || ''
  );

  const ejerciciosPorCategoria = useMemo(() => {
    const grupos = {};
    ejerciciosDb.forEach((ej) => {
      const cat = ej.categoria || 'Otros';
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push({ nombre: ej.nombre });
    });
    return grupos;
  }, []);

  const handleSelect = (nombreEjercicio) => {
    if (onSelectEjercicio) {
      onSelectEjercicio(nombreEjercicio);
    }
    navigate('/add', { state: { ejercicioSeleccionado: nombreEjercicio } });
  };

  if (categoriasUnicas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center italic text-zinc-500">
        No hay ejercicios disponibles.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-10 animate-in fade-in duration-500">
      {/* SELECTOR HORIZONTAL DE CATEGORÍAS (mismo estilo que ViewRecords) */}
      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar -mx-4 px-4 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
        {categoriasUnicas.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaAbierta(categoria)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all shrink-0 border ${
              categoriaAbierta === categoria
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] scale-105'
                : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10'
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* LISTADO DE EJERCICIOS DE LA CATEGORÍA SELECCIONADA */}
      <div className="flex flex-col gap-8">
        {(ejerciciosPorCategoria[categoriaAbierta] || []).map((ej) => (
          <div
            key={ej.nombre}
            onClick={() => handleSelect(ej.nombre)}
            className="bg-zinc-900/40 border border-white/5 p-4 rounded-[2rem] flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-all active:scale-95 cursor-pointer animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="h-4 w-1 bg-blue-600 rounded-full shrink-0" />
              <h3 className="text-sm font-black italic text-white uppercase tracking-tighter">
                {ej.nombre}
              </h3>
            </div>
            <span className="absolute -bottom-2 -right-1 text-2xl font-black text-white/[0.03] italic pointer-events-none group-hover:text-blue-500/5 transition-colors">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSelectEjercicio;
