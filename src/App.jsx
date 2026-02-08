import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Asegúrate de crear este archivo
import { gymApi } from './api/gymApi';
import FormularioEjercicio from './view/FormularioEjercicio';
import CoachAnalysis from './view/CoachAnalysis';
import EjercicioHistorial from './view/EjercicioHistorial';
import ViewRecords from './view/ViewRecords';
import { Auth } from './components/Auth'; // Importamos tu nuevo componente de Login
import { toast } from 'react-hot-toast';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { GymProvider } from './context/GymProvider';


function App() {
  // Estado de sesión de Supabase
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Si no hay sesión iniciada, mostramos la pantalla de Auth
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
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
          onClick={() => { supabase.auth.signOut(), toast('Sesión finalizada', { icon: '📤', }) }}
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

      <GymProvider userId={session?.user?.id}>
        <main className="max-w-md mx-auto px-4 pb-24">
          {/* PESTAÑAS PERSISTENTES: Se mantienen montadas pero se ocultan con CSS */}
          <div className={location.pathname === '/add' ? 'block' : 'hidden'}>
            <FormularioEjercicio userId={session.user.id} />
          </div>

          <div className={location.pathname === '/view' ? 'block' : 'hidden'}>
            <ViewRecords userId={session.user.id} />
          </div>

          <div className={location.pathname === '/analyze' ? 'block' : 'hidden'}>
            <CoachAnalysis userId={session.user.id} />
          </div>

          {/* RUTAS DE NAVEGACIÓN REAL: Para páginas que no son pestañas principales */}
          <Routes>
            {/* Si entran a la raíz, el sistema los manda a /add y se activa el div de arriba */}
            <Route path="/" element={<Navigate to="/add" />} />
            <Route path="/add" element={null} />
            <Route path="/view" element={null} />
            <Route path="/analyze" element={null} />

            {/* El historial sí se monta/desmonta normalmente */}
            <Route path="/history" element={<EjercicioHistorial userId={session.user.id} />} />
          </Routes>
        </main>
      </GymProvider>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between shadow-2xl z-50">
        <TabButton
          active={location.pathname === '/add'}
          onClick={() => navigate("/add")}
          label="ADD" icon="⚡"
        />
        <TabButton
          active={location.pathname === '/view' || location.pathname === '/history'}
          onClick={() => navigate("/view")}
          label="VIEW" icon="📊"
        />
        <TabButton
          active={location.pathname === '/analyze'}
          onClick={() => navigate("/analyze")}
          label="ANALYZE" icon="✨"
        />
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