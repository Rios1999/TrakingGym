import { useState } from 'react';
import { gymApi } from './api/gymApi';
import GraficoProgreso from './components/GraficoProgreso';
import FormularioEjercicio from './components/FormularioEjercicio';
import CoachAnalysis from './components/CoachAnalysis';

function App() {
  const [respuesta, setRespuesta] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);

  const manejarConsulta = async () => {
    setLoading(true);
    try {
      const datos = await gymApi.getStats();
      setRespuesta(datos.output);
      if (activeTab === 'add') setActiveTab('view');
    } catch (err) {
      console.error("Error", err);
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
              <CoachAnalysis
                respuesta={respuesta}
                loading={loading}
                onRefresh={manejarConsulta}
              />
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