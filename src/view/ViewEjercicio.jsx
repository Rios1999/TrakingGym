import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gymApi } from '../api/gymApi';

// Skeleton que respeta exactamente tu diseño de botón
const SkeletonCard = () => (
  <div className="bg-zinc-900/20 border border-white/5 p-3 rounded-[1.8rem] flex items-center gap-3 animate-pulse">
    <div className="shrink-0 w-11 h-11 bg-zinc-900 rounded-2xl" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="h-2 w-8 bg-white/5 rounded" />
      <div className="h-3 w-20 bg-white/10 rounded" />
    </div>
  </div>
);

// ... (SkeletonCard arriba igual)

const ViewEjercicio = () => {
  const navigate = useNavigate();
  const [musculoAbierto, setMusculoAbierto] = useState("Pecho");
  const [listaEjercicios, setListaEjercicios] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [pagina, setPagina] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    console.log(hasMore)

    observer.current = new IntersectionObserver(entries => {
      // Si el último elemento entra en pantalla

      if (entries[0].isIntersecting && hasMore) {
        console.log("¡Vigilante activado! Cargando página:", pagina + 1);
        setPagina(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, pagina]); // Añadimos pagina aquí para que el callback se refresque

  useEffect(() => {
    const fetchEjercicios = async () => {
      setLoading(true);
      try {
        console.log("Pidiendo página:", pagina);
        const response = await gymApi.getEjercicios(pagina);
        const nuevosEjercicios = Array.isArray(response) ? response : (response?.records || []);

        
        setListaEjercicios(prev => {
          const filtrados = nuevosEjercicios.filter(n => !prev.some(p => p.id === n.id));
          return [...prev, ...filtrados];
        });

        // IMPORTANTE: Ajusta este número al límite de tu API (si es 10 o 20)
        setHasMore(nuevosEjercicios.length > 0);

      } catch (error) {
        console.error("Error:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEjercicios();
  }, [pagina]); // <--- CAMBIO CLAVE: Escuchar a la página

  const categorias = useMemo(() => {
    const grupos = {};
    listaEjercicios?.forEach(ej => {
      const cat = ej.categoria || "Otros";
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(ej);
    });
    return grupos;
  }, [listaEjercicios]);

  const listaMusculos = Object.keys(categorias);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto bg-zinc-950 min-h-screen">
      
      {/* Selector de Músculos (Igual) */}
      <div className="flex gap-2 overflow-x-auto py-2 sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-20">
        {listaMusculos.map((musculo) => (
          <button
            key={musculo}
            onClick={() => setMusculoAbierto(musculo)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
              musculoAbierto === musculo ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900/50 border-white/5 text-zinc-600'
            }`}
          >
            {musculo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-1 pb-10">
        {/* RENDERIZADO DE LA LISTA */}
        {categorias[musculoAbierto]?.map((ej, index) => {
          // COMPROBACIÓN: ¿Es este el último elemento visible de este músculo?
          const esUltimo = categorias[musculoAbierto].length === index + 1;

          return (
            <button
              key={ej.id || index}
              // AQUÍ SE PONE EL VIGILANTE
              ref={esUltimo ? lastElementRef : null} 
              onClick={() => navigate("/add", { state: { ejercicioSeleccionado: ej } })}
              className="group relative bg-zinc-900/40 border border-white/5 p-3 rounded-[1.8rem] flex items-center gap-3 transition-all active:scale-[0.96]"
            >
              {/* Contenido de tu botón (Icono y Texto) */}
              <div className="shrink-0 w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 12h12M4 8v8M20 8v8M6 8v8M18 8v8" />
                </svg>
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[7px] font-black text-blue-500/50 uppercase">{musculoAbierto}</span>
                <span className="text-[11px] font-black text-white uppercase italic truncate w-full text-left">{ej.nombre}</span>
              </div>
            </button>
          );
        })}

        {/* SKELETONS: Se muestran al final mientras cargan más */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewEjercicio;