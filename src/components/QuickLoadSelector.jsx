import React, { useState, useMemo } from 'react';
// Importamos el icono genérico de Lucide
import { Dumbbell, Search } from 'lucide-react';

const EJERCICIOS_CARGA = [
  { id: 1, nombre: "Sentadilla", musculo: "Pierna" },
  { id: 2, nombre: "Press Banca", musculo: "Pecho" },
  { id: 3, nombre: "Peso Muerto", musculo: "Espalda" },
  { id: 4, nombre: "Press Militar", musculo: "Hombro" },
  { id: 5, nombre: "Dominadas", musculo: "Espalda" },
  { id: 6, nombre: "Zancadas", musculo: "Pierna" },
  { id: 7, nombre: "Curl Bíceps", musculo: "Brazos" },
  { id: 8, nombre: "Tríceps Polea", musculo: "Brazos" },
  { id: 9, nombre: "Remo Barra", musculo: "Espalda" },
  { id: 10, nombre: "Aperturas", musculo: "Pecho" },
  { id: 11, nombre: "Prensa", musculo: "Pierna" },
  { id: 12, nombre: "Elev. Lateral", musculo: "Hombro" },
];

const CATEGORIAS = ["Todos", "Pecho", "Pierna", "Espalda", "Hombro", "Brazos"];

export const QuickLoadSelector = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroMusculo, setFiltroMusculo] = useState('Todos');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  
  const [history, setHistory] = useState({
    [new Date().toISOString().split('T')[0]]: ["Sentadilla"]
  });

  const ejerciciosCompletados = useMemo(() => history[fechaSeleccionada] || [], [history, fechaSeleccionada]);

  const ejerciciosFiltrados = useMemo(() => {
    return EJERCICIOS_CARGA.filter(ej => {
      const coincideBusqueda = ej.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideMusculo = filtroMusculo === 'Todos' || ej.musculo === filtroMusculo;
      return coincideBusqueda && coincideMusculo;
    });
  }, [busqueda, filtroMusculo]);

  const toggleExercise = (nombre) => {
    const listaActual = [...ejerciciosCompletados];
    const index = listaActual.indexOf(nombre);
    const nuevaLista = index > -1 
      ? listaActual.filter(item => item !== nombre) 
      : [...listaActual, nombre];

    setHistory({ ...history, [fechaSeleccionada]: nuevaLista });
    if ("vibrate" in navigator) navigator.vibrate(25);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-4 mb-4">
      <div className="bg-zinc-950 h-[600px] p-5 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* 1. HEADER */}
        <div className="flex justify-between items-center px-1 mb-4 shrink-0">
          <div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Map Mode</span>
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Estímulo</h2>
          </div>
          <input 
            type="date" 
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black text-blue-400 p-2.5 outline-none"
          />
        </div>

        {/* 2. REJILLA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 mb-4 pt-2 px-2">
          <div className="grid grid-cols-3 gap-4">
            {ejerciciosFiltrados.length > 0 ? (
              ejerciciosFiltrados.map((ej) => {
                const isDone = ejerciciosCompletados.includes(ej.nombre);
                return (
                  <button
                    key={ej.id}
                    onClick={() => toggleExercise(ej.nombre)}
                    className={`relative flex flex-col items-center justify-center aspect-square p-3 rounded-[2rem] border transition-all duration-300 active:scale-90 ${
                      isDone 
                        ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)] opacity-100' 
                        : 'bg-zinc-900 border-white/5 opacity-40'
                    }`}
                  >
                    {/* ICONO GENÉRICO ÚNICO */}
                    <Dumbbell 
                      size={24} 
                      strokeWidth={2.5}
                      className={`mb-2 transition-colors ${isDone ? 'text-white' : 'text-zinc-500'}`} 
                    />

                    <span className={`text-[8px] font-black uppercase text-center leading-tight px-1 ${isDone ? 'text-white' : 'text-zinc-500'}`}>
                      {ej.nombre}
                    </span>
                    
                    {isDone && (
                      <div className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black shadow-xl z-10 border-2 border-zinc-950">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-3 py-10 text-center opacity-30 italic text-xs font-black uppercase">
                Vacio
              </div>
            )}
          </div>
        </div>

        {/* 3. CONTROLES INFERIORES */}
        <div className="flex flex-col gap-3 shrink-0 bg-zinc-950 pt-2 border-t border-white/5">
          
          <div className="flex justify-between items-center px-4 py-2 bg-zinc-900/50 rounded-2xl border border-white/5">
             <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Ejercicios marcados</span>
             <span className="text-xs font-black text-blue-500">{ejerciciosCompletados.length}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroMusculo(cat)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all shrink-0 border ${
                  filtroMusculo === cat 
                    ? 'bg-blue-600 text-white border-blue-400' 
                    : 'bg-zinc-900 border-white/5 text-zinc-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={busqueda}
              placeholder="BUSCAR..." 
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-black text-white outline-none focus:border-blue-500/50 placeholder:text-zinc-700 shadow-2xl"
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                onClick={() => setBusqueda('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 rounded-full text-zinc-500 text-[10px] font-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLoadSelector;