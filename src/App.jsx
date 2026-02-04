import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Asegúrate de crear este archivo
import { gymApi } from './api/gymApi';
import FormularioEjercicio from './components/FormularioEjercicio';
import CoachAnalysis from './components/CoachAnalysis';
import EjercicioHistorial from './components/EjercicioHistorial';
import ViewRecords from './components/ViewRecords';
import { Auth } from './components/Auth'; // Importamos tu nuevo componente de Login
import { Toaster, toast } from 'react-hot-toast';

function App() {
  // Estado de sesión de Supabase
  const [session, setSession] = useState(null);

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState({ userId: session?.user.id, ejercicio: "", rpe: "" });
  const [analisis, setAnalisis] = useState(null);
  const [records, setRecords] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);


  const resetForm = () => {
    // Restablecemos el ejercicio manteniendo el userId actual
    setEjercicioSeleccionado({
      userId: session?.user.id,
      ejercicio: "",
      rpe: ""
    });

    // Limpiamos los resultados de las consultas
    setAnalisis(null);
    setRecords(null);

    // Volvemos a la pestaña inicial y quitamos estados de carga
    setActiveTab('add');
    setLoading(false);
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const manejarConsulta = async () => {
    setLoading(true);
    try {
      // Pasamos el ID del usuario para que n8n/Supabase filtre sus datos
      const datos = await gymApi.getStats(session.user.id);
      setAnalisis(datos);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  // Si no hay sesión iniciada, mostramos la pantalla de Auth
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Definir estilos por defecto
          style: {
            background: '#18181b', // zinc-900
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          // Personalizar tipos específicos
          success: {
            iconTheme: {
              primary: '#3b82f6', // azul para que pegue con tu app
              secondary: '#fff',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      <header className="flex items-center justify-between py-2 px-4 border-b border-white/5 mb-2">
        {/* Sección Izquierda: Usuario / Info Técnica */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /> {/* Indicador de status */}
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none">
              Active Session
            </span>
          </div>
          <h1 className="text-xl font-black italic text-white uppercase tracking-tighter leading-none">
            {session.user.email.split('@')[0]}
          </h1>
        </div>

        {/* Sección Derecha: Botón de Salida Cuadrado */}
        <button
          onClick={() => { resetForm(), supabase.auth.signOut() }}
          className="group relative p-3 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 transition-all active:scale-95"
          title="Cerrar Sesión"
        >
          {/* Icono de Power / Salida */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            className="text-zinc-500 group-hover:text-red-500 transition-colors"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>

          {/* Tooltip opcional muy pequeño */}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-red-500 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity">
            Logout
          </span>
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24">
        <div className="min-h-[400px]">
          {activeTab === 'add' && (
            <FormularioEjercicio
              userId={session.user.id}
            />
          )}

          {activeTab === 'view' && (
            ejercicioSeleccionado.ejercicio === "" ? (
              <ViewRecords
                userId={session.user.id}
                onSelectEjercicio={(nombre, rpe) => setEjercicioSeleccionado({ ejercicio: nombre, rpe: rpe })}
              />
            ) : (
              <EjercicioHistorial
                nombreEjercicio={ejercicioSeleccionado.ejercicio}
                rpeFiltrado={ejercicioSeleccionado.rpe}
                onVolver={() => setEjercicioSeleccionado({ ejercicio: "", rpe: "" })}
                userId={session.user.id}
              />
            )
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