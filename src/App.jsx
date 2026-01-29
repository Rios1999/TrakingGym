import { useState,useEffect } from 'react';
import { gymApi } from './api/gymApi';
import FormularioEjercicio from './components/FormularioEjercicio';
import CoachAnalysis from './components/CoachAnalysis';
import ViewRecords from './components/ViewRecords'; // Importamos

function App() {
  const [analisis, setAnalisis] = useState(null);
  const [records, setRecords] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);

  const manejarConsulta = async () => {
    setLoading(true);
    try {
      const datos = await gymApi.getStats();
      setAnalisis(datos);
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
      console.log("Error al guardar", error);
      throw error;
    }
  };

  const cargarRecords = async () => {
    setLoading(true);
    try {
      // Llamamos al nuevo método que configuramos
      const datos = await gymApi.getRecords();
      setRecords(datos);
    } catch (err) {
      console.error("Error al cargar récords:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view' && !records) {
      //cargarRecords();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <header className="p-6 flex justify-between items-center max-w-md mx-auto">
        <h1 className="text-5xl font-black italic tracking-tighter">
          GYM<span className="text-blue-600">FLOW</span>
        </h1>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24">
        <div className="min-h-[400px]">
          {activeTab === 'add' && <FormularioEjercicio onEnviar={guardarEnSheets} />}

          {activeTab === 'view' && (
            <ViewRecords
              respuesta={records}
              onSelectEjercicio={(ej) => console.log(ej)}
            />
          )}

          {activeTab === 'analyze' && (
            <CoachAnalysis
              respuesta={analisis}
              loading={loading}
              onRefresh={manejarConsulta}
            />
          )}
        </div>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between shadow-2xl z-50">
        <TabButton active={activeTab === 'add'} onClick={() => setActiveTab('add')} label="ADD" icon="⚡" />
        <TabButton active={activeTab === 'view'} onClick={() => setActiveTab('view')} label="VIEW" icon="📊" />
        <TabButton active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')} label="AI" icon="✨" />
      </nav>
    </div>
  );
}

const TabButton = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex-1 flex flex-col items-center py-2 rounded-3xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[8px] font-black mt-1 uppercase italic">{label}</span>
  </button>
);

export default App;