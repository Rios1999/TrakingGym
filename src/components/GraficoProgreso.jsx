import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraficoProgreso = ({ records, analisis, onEjercicioChange }) => {
  const listaEjercicios = useMemo(() => {
    if (!records) return [];
    return [...new Set(records.map(r => r.ejercicio))];
  }, [records]);

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(
    listaEjercicios.length > 0 ? listaEjercicios[0] : ""
  );

  // Sincronizar selección
  useMemo(() => {
    if (listaEjercicios.length > 0 && !listaEjercicios.includes(ejercicioSeleccionado)) {
      setEjercicioSeleccionado(listaEjercicios[0]);
    }
  }, [listaEjercicios, ejercicioSeleccionado]);

  useEffect(() => {
    if (onEjercicioChange) {
      onEjercicioChange(ejercicioSeleccionado);
    }
  }, [ejercicioSeleccionado, onEjercicioChange]);

  // Filtrado directo por ejercicio (Sin RPE)
  const datosFiltrados = useMemo(() => {
    return records
      .filter(r => r.ejercicio === ejercicioSeleccionado)
      .sort((a, b) => {
        const parse = (f) => f.includes('/') ? new Date(f.split('/').reverse().join('-')) : new Date(f);
        return parse(a.fecha) - parse(b.fecha);
      });
  }, [records, ejercicioSeleccionado]);

  const analisisSeleccionado = useMemo(() => {
    return analisis?.find(a => a.ejercicio === ejercicioSeleccionado);
  }, [analisis, ejercicioSeleccionado]);

  if (!records || records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-2"> {/* Espacio entre secciones reducido */}
      {/* Selectores superiores - Más densos */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar items-center px-1 py-1">
        {listaEjercicios.map((ej) => {
          const info = analisis?.find(a => a.ejercicio === ej);
          const seleccionado = ejercicioSeleccionado === ej;
          let estiloEstado = "border-zinc-800 text-zinc-500";
          if (info?.valor_numerico > 0) estiloEstado = "border-emerald-500/30 text-emerald-500/80";
          if (info?.valor_numerico < 0) estiloEstado = "border-red-500/30 text-red-500/80";

          return (
            <button
              key={ej}
              onClick={() => setEjercicioSeleccionado(ej)}
              className={`px-3 py-2 rounded-xl transition-all border shrink-0 flex items-center justify-between gap-3 min-w-[120px] ${seleccionado ? 'bg-blue-600 border-blue-500 text-white scale-105' : `bg-zinc-900/50 ${estiloEstado}`
                }`}
            >
              <span className="text-[7px] font-black uppercase truncate max-w-[80px]">{ej}</span>
              {info && <span className="text-[7px] font-black">{info.porcentaje}</span>}
            </button>
          );
        })}
      </div>

      {/* Contenedor principal - Altura y paddings reducidos */}
      <div className="w-full bg-zinc-950/50 p-4 rounded-[2rem] border border-white/10 shadow-2xl relative">
        <div className="flex justify-between items-start mb-4 px-1"> {/* Margen inferior de 8 a 4 */}
          <div className="flex flex-col">
            <h3 className="text-zinc-500 text-[7px] font-black uppercase tracking-[0.2em] leading-none">
              TENDENCIA <span className="text-blue-500">RM</span>
            </h3>
            <span className="text-white text-lg font-black italic uppercase tracking-tighter leading-tight">EVOLUCIÓN</span>
          </div>

          {analisisSeleccionado && (
            <div className={`text-[6px] font-black px-2 py-0.5 rounded-full border ${analisisSeleccionado.valor_numerico >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
              }`}>
              {analisisSeleccionado.porcentaje} TOTAL
            </div>
          )}
        </div>

        {/* Área del gráfico - Altura ajustada para ser más compacta */}
        <div className="w-full h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosFiltrados} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis
                dataKey="fecha"
                stroke="#3f3f46"
                fontSize={8}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => {
                  const f = str.split(str.includes('/') ? '/' : '-');
                  return f[0].length === 4 ? `${f[2]}/${f[1]}` : `${f[0]}/${f[1]}`;
                }}
              />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />

              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '9px', padding: '8px' }}
                cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
                formatter={(value, name, props) => {
                  const { peso, repeticiones, rpe } = props.payload;
                  return [
                    <div key="rm" className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 uppercase text-[7px]">RM Estimado:</span>
                        <span className="text-white font-black">{value.toFixed(1)} kg</span>
                      </div>
                      <div className="flex items-center gap-2 border-t border-white/5 pt-1 mt-0.5 text-blue-400 font-bold text-[8px]">
                        Serie: {peso}kg x {repeticiones} <span className="text-zinc-500 font-normal ml-0.5">(RPE {rpe})</span>
                      </div>
                    </div>
                  ];
                }}
              />

              <Line
                type="monotone"
                dataKey="puntosFuerza"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficoProgreso;