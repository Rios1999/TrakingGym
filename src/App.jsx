import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { gymApi } from './api/gymApi';
import FormularioEjercicio from './view/FormularioEjercicio';
import CoachAnalysis from './view/CoachAnalysis';
import EjercicioHistorial from './view/EjercicioHistorial';
import ViewRecords from './view/ViewRecords';
import { Auth } from './components/Auth';
import { QuickLoadSelector } from './components/QuickLoadSelector';
import { toast } from 'react-hot-toast';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { GymProvider } from './context/GymProvider';
import packageInfo from '../package.json';

// --- NUEVO COMPONENTE PARA RESETEAR SCROLL ---
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Usamos un pequeño delay de 10ms para que el DOM se asiente
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // 'smooth' puede ser lento en apps de records, 'instant' con delay elimina el parpadeo
      });
    }, 10);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />;

  const isSubPage = location.pathname === '/history' || location.pathname === '/view';

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Componente invisible que resetea el scroll */}
      <ScrollToTop />

      <header className="flex items-center justify-between py-3 px-4 border-b border-white/5 mb-2 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-[60]">
        <div className="flex items-center w-52 shrink-0">
          {isSubPage ? (
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 bg-zinc-900/50 border border-white/10 pl-2 pr-4 py-1.5 rounded-2xl shadow-xl active:scale-95 transition-all w-full max-w-[170px]"
            >
              <div className="w-7 h-7 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-blue-500/50 transition-colors shadow-inner shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Volver</span>
                <span className="text-[7px] font-bold text-blue-500/80 uppercase tracking-tighter mt-1 truncate">
                  {location.pathname === '/history' ? 'Records Log' : 'Home Panel'}
                </span>
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-0.5 w-full">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none">
                  Active Session
                </span>
              </div>
              <h1 className="text-lg font-black italic text-white uppercase tracking-tighter leading-none truncate">
                {session.user.email.split('@')[0]}
              </h1>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center min-w-[42px]">
          {!isSubPage ? (
            <button
              onClick={() => { supabase.auth.signOut(), toast('Sesión finalizada', { icon: '📤' }) }}
              className="group p-2.5 bg-zinc-900/50 border border-white/10 rounded-xl hover:border-red-500/50 transition-all active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 group-hover:text-red-500 transition-colors">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          ) : (
            <div className="flex flex-col items-end opacity-40 select-none">
              <span className="text-[15px] font-black text-white tracking-[0.2em] leading-none">GYM-OS</span>
              <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">v.{packageInfo.version}</span>
            </div>
          )}
        </div>
      </header>

      <GymProvider userId={session?.user?.id}>
        <main className="max-w-md mx-auto px-4 pb-24 transition-all duration-300 ease-in-out">

          {/* SECCIÓN ADD: Ahora también se muestra si el path es "/" */}
          <div className={(location.pathname === '/add' || location.pathname === '/') ? 'block' : 'hidden'}>
            <FormularioEjercicio userId={session.user.id} />
            <div className="flex items-center gap-4 my-4 px-6 opacity-30">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">O registrar récord</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>
            <QuickLoadSelector />
          </div>

          <div className={location.pathname === '/view' ? 'block' : 'hidden'}>
            <ViewRecords userId={session.user.id} />
          </div>

          <div className={location.pathname === '/analyze' ? 'block' : 'hidden'}>
            <CoachAnalysis userId={session.user.id} />
          </div>

          {/* Las Routes solo para el historial, que sí es una página aparte */}
          <Routes>
            <Route path="/" element={<Navigate replace to="/add" />} />
            <Route path="/history" element={<EjercicioHistorial userId={session.user.id} />} />
            {/* Las demás rutas en null porque ya las manejas con los div de arriba */}
            <Route path="/add" element={null} />
            <Route path="/view" element={null} />
            <Route path="/analyze" element={null} />
          </Routes>
        </main>
      </GymProvider>

      {/* NAV INFERIOR CORREGIDO */}
      {!isSubPage && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex justify-between shadow-2xl z-50">
          <TabButton
            // IMPORTANTE: ADD activo si es /add o si es /
            active={location.pathname === '/add' || location.pathname === '/'}
            onClick={() => navigate("/add")}
            label="ADD" icon="⚡"
          />
          <TabButton
            active={location.pathname === '/analyze'}
            onClick={() => navigate("/analyze")}
            label="ANALYZE" icon="✨"
          />
        </nav>
      )}
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