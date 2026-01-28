import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraficoProgreso = ({ records, analisis }) => {
  const listaEjercicios = useMemo(() => {
    if (!records) return [];
    return [...new Set(records.map(r => r.ejercicio))];
  }, [records]);

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(
    listaEjercicios.length > 0 ? listaEjercicios[0] : ""
  );

  useMemo(() => {
    if (listaEjercicios.length > 0 && !listaEjercicios.includes(ejercicioSeleccionado)) {
      setEjercicioSeleccionado(listaEjercicios[0]);
    }
  }, [listaEjercicios, ejercicioSeleccionado]);

  const datosFiltrados = useMemo(() => {
    return records
      .filter(r => r.ejercicio === ejercicioSeleccionado)
      .sort((a, b) => {
        const parse = (f) => f.includes('/') ? new Date(f.split('/').reverse().join('-')) : new Date(f);
        return parse(a.fecha) - parse(b.fecha);
      });
  }, [records, ejercicioSeleccionado]);

  // Buscamos la info de análisis del ejercicio que está seleccionado actualmente
  const analisisSeleccionado = useMemo(() => {
    return analisis?.find(a => a.ejercicio === ejercicioSeleccionado);
  }, [analisis, ejercicioSeleccionado]);

  if (!records || records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* BOTONES LARGOS EN UNA SOLA LÍNEA */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar items-center px-1">
        {listaEjercicios.map((ej) => {
          const info = analisis?.find(a => a.ejercicio === ej);
          const esPositivo = info?.valor_numerico > 0;
          const esNegativo = info?.valor_numerico < 0;
          const seleccionado = ejercicioSeleccionado === ej;

          let estiloEstado = "border-zinc-800 text-zinc-500";
          if (esPositivo) estiloEstado = "border-emerald-500/30 text-emerald-500/80";
          if (esNegativo) estiloEstado = "border-red-500/30 text-red-500/80";

          return (
            <button
              key={ej}
              onClick={() => setEjercicioSeleccionado(ej)}
              className={`px-4 py-3 rounded-2xl transition-all border shrink-0 whitespace-nowrap flex items-center justify-between gap-4 min-w-[140px] ${
                seleccionado
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 scale-105 z-10'
                  : `bg-zinc-900/50 ${estiloEstado} hover:border-zinc-700`
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[85px]">
                {ej}
              </span>
              
              {info && (
                <span className={`text-[10px] font-black tabular-nums ${seleccionado ? 'text-blue-100' : ''}`}>
                  {info.porcentaje}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR DEL GRÁFICO CON INFO INTERNA */}
      <div className="w-full h-64 bg-zinc-950/50 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Trend: <span className="text-blue-500">{ejercicioSeleccionado}</span>
            </h3>

            {/* BADGE INTERNO DEL GRÁFICO (El que molaba) */}
            {analisisSeleccionado && (
                <div className={`text-[9px] font-black px-3 py-1 rounded-full border shadow-sm transition-all ${
                    analisisSeleccionado.valor_numerico >= 0 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-red-400 bg-red-500/10 border-red-500/20'
                }`}>
                    PROGRESO: {analisisSeleccionado.porcentaje}
                </div>
            )}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosFiltrados}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis
              dataKey="fecha"
              stroke="#3f3f46"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(str) => {
                  const f = str.split(str.includes('/') ? '/' : '-');
                  return f[0].length === 4 ? `${f[2]}/${f[1]}` : `${f[0]}/${f[1]}`;
              }}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              labelStyle={{ color: '#71717a', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoProgreso;