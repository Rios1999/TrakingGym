import { useState } from 'react';
import { gymApi } from './api/gymApi';
import GraficoProgreso from './components/GraficoProgreso';
import FormularioEjercicio from './components/FormularioEjercicio';

function App() {
  const [respuesta, setRespuesta] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);

  const manejarConsulta = async () => {
    setLoading(true);
    try {
      const datos = await gymApi.getStats();
      setRespuesta(datos.output);
      // Si el usuario le dio a "Ver" o "IA" sin datos, lo llevamos a "Ver" al terminar
      if (activeTab === 'add') setActiveTab('view');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const guardarEnSheets = async (datos) => {
    try {
      await gymApi.registrarSerie(datos);
    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">

      {/* HEADER con botón de carga integrado si no hay datos */}
      <header className="p-6 flex justify-between items-center max-w-md mx-auto">
        <h1 className="text-5xl font-black italic tracking-tighter">
          GYM<span className="text-blue-600">FLOW</span>
        </h1>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24">
        <div className="min-h-[400px]">

          {/* TAB: AÑADIR */}
          {activeTab === 'add' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <FormularioEjercicio onEnviar={guardarEnSheets} />
            </div>
          )}

          {/* TAB: ANALIZAR (IA) */}
          {activeTab === 'analyze' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!respuesta && !loading ? (
                <EmptyState onAction={manejarConsulta} title="Análisis de IA" />
              ) : (
                <div className="flex flex-col gap-6 w-full max-w-md mx-auto">

                  {/* Tarjeta del Análisis */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2.5rem] blur opacity-10"></div>

                    <div className="relative bg-zinc-950/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 border-l-4 border-l-emerald-500 shadow-xl">

                      {/* Cabecera con el Badge tipo Etiqueta */}
                      <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">IA Coach</span>
                          <h4 className="text-xl font-black italic tracking-tighter text-white uppercase">Reporte</h4>
                        </div>

                        {/* BADGET TIPO ETIQUETA (Solo si hay mejora real) */}
                        {respuesta?.mejoraGlobal > 0 && (
                          <div className="flex flex-col items-end">
                            <div className="bg-emerald-500 text-black text-[14px] font-[900] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] skew-x-[-10deg]">
                              +{respuesta.mejoraGlobal}%
                            </div>
                            <span className="text-[7px] font-black text-emerald-500 mt-1.5 uppercase tracking-widest">Growth Score</span>
                          </div>
                        )}
                      </div>

                      {/* LISTADO FILTRADO: Solo muestra si hay mejora o datos */}
                      <div className="space-y-4">
                        {respuesta?.analisis ? (
                          respuesta.analisis.split('.').map((linea, index) => {
                            const texto = linea.trim();
                            // FILTRO: Si la línea está vacía o dice "Sin datos", no renderizamos nada
                            if (texto.length < 5 || texto.toLowerCase().includes("sin datos")) return null;

                            return (
                              <div key={index} className="flex items-start gap-4 border-b border-white/[0.03] pb-4 last:border-0">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0"></div>
                                <p className="text-[13px] text-zinc-200 font-bold leading-snug tracking-tight">
                                  {texto}.
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-10 text-center">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Esperando datos de n8n...</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Gráfico debajo */}
                  <div className="bg-zinc-900/40 p-6 rounded-[3rem] border border-white/5">
                    <GraficoProgreso records={respuesta?.records || []} />
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* NAV BAR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between shadow-2xl z-50">
        <TabButton active={activeTab === 'add'} onClick={() => setActiveTab('add')} label="ADD" icon="⚡" />
        <TabButton active={activeTab === 'view'} onClick={() => setActiveTab('view')} label="VIEW" icon="📊" />
        <TabButton active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} label="AI" icon="✨" />
      </nav>
    </div>
  );
}

// Componente para cuando no hay datos
const EmptyState = ({ onAction, title }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-zinc-900/30 rounded-[2.5rem] border border-dashed border-zinc-800">
    <div className="text-3xl mb-4 opacity-20">📂</div>
    <h3 className="text-sm font-black uppercase tracking-widest mb-2">{title}</h3>
    <p className="text-xs text-zinc-500 mb-6">No hay datos recientes. Sincroniza con tu base de datos para ver el progreso.</p>
    <button
      onClick={onAction}
      className="bg-white text-black text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all"
    >
      Sincronizar ahora
    </button>
  </div>
);

const TabButton = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center rounded-3xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-zinc-500 hover:text-white'}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[8px] font-black mt-1 uppercase italic">{label}</span>
  </button>
);

export default App;