import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error de acceso: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Elementos decorativos de fondo (Grid técnico) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent"></div>

      <div className="max-w-sm mx-auto w-full relative z-10">
        {/* Header del Formulario */}
        <div className="mb-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-blue-600"></div>
            <span className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase">System Access</span>
          </div>
          <h2 className="text-white font-black text-4xl italic leading-none tracking-tighter uppercase">
            Gym<span className="text-blue-600">Flow</span><span className="text-[12px] not-italic ml-2 text-zinc-600">v3.0</span>
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Campo Email */}
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

            {/* Campo Password */}
            <div className="group">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-blue-500 transition-colors">
                Access Key
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

          {/* Botón de Acción */}
          <button 
            disabled={loading}
            className="group relative w-full overflow-hidden bg-white text-black font-black py-4 rounded-xl uppercase italic tracking-[0.2em] text-sm hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Iniciando Protocolo...' : 'Establecer Conexión'}
              {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </span>
          </button>
        </form>

        {/* Footer del Login */}
        <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Encrypted Session</span>
          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 GF-LABS</span>
        </div>
      </div>
    </div>
  );
};

//prueba