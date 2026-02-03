import { useState, useEffect } from 'react'; // Añadido useEffect
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Estado para detectar si el usuario viene a cambiar su contraseña
  const [modoEstablecerPassword, setModoEstablecerPassword] = useState(false);

  useEffect(() => {
    // 1. Comprobación inmediata al cargar el componente
    const checkHash = () => {
      const hash = window.location.hash;
      // Si la URL contiene 'type=invite' o 'type=recovery', activamos el modo
      if (hash && (hash.includes("type=invite") || hash.includes("type=recovery"))) {
        setModoEstablecerPassword(true);
      }
    };

    checkHash();

    // 2. Escuchar cambios de estado (por si acaso el evento llega después)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setModoEstablecerPassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (modoEstablecerPassword) {
      // Lógica para actualizar la contraseña (Invitación/Recuperación)
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        alert("Error al establecer contraseña: " + error.message);
      } else {
        alert("Protocolo completado. Contraseña actualizada.");
        setModoEstablecerPassword(false);
      }
    } else {
      // Lógica de Login normal
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert("Error de acceso: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="max-w-sm mx-auto w-full relative z-10">
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-blue-600"></div>
            <span className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase">
              {modoEstablecerPassword ? 'Security Update' : 'System Access'}
            </span>
          </div>
          <h2 className="text-white font-black text-4xl italic leading-none tracking-tighter uppercase">
            Gym<span className="text-blue-600">Flow</span>
            <span className="text-[12px] not-italic ml-2 text-zinc-600">v3.0</span>
          </h2>
          {modoEstablecerPassword && (
            <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
              Configura tu clave de acceso personal
            </p>
          )}
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          <div className="space-y-4">
            {/* Solo mostramos Email si NO estamos en modo password */}
            {!modoEstablecerPassword && (
              <div className="group">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                  Terminal ID (Email)
                </label>
                <input
                  type="email"
                  placeholder="USER@SYSTEM.COM"
                  className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-600/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="group">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                {modoEstablecerPassword ? 'New Access Key' : 'Access Key'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-600/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`group relative w-full overflow-hidden font-black py-4 rounded-xl uppercase italic tracking-[0.2em] text-sm transition-all active:scale-[0.98] disabled:opacity-50 ${modoEstablecerPassword ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading
                ? 'Procesando...'
                : modoEstablecerPassword ? 'Confirmar Clave' : 'Establecer Conexión'}
              {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
            </span>
          </button>
        </form>

        <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Encrypted Session</span>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 GF-LABS</span>
        </div>
      </div>
    </div>
  );
};