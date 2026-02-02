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

  const rpeAuto = useMemo(() => {
    const conteo = records
      .filter(r => r.ejercicio === ejercicioSeleccionado)
      .reduce((acc, cur) => {
        acc[cur.rpe] = (acc[cur.rpe] || 0) + 1;
        return acc;
      }, {});
    return Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b, "8");
  }, [records, ejercicioSeleccionado]);

  const datosFiltrados = useMemo(() => {
    return records
      .filter(r => r.ejercicio === ejercicioSeleccionado && String(r.rpe) === String(rpeAuto))
      .sort((a, b) => {
        const parse = (f) => f.includes('/') ? new Date(f.split('/').reverse().join('-')) : new Date(f);
        return parse(a.fecha) - parse(b.fecha);
      });
  }, [records, ejercicioSeleccionado, rpeAuto]);

  const analisisSeleccionado = useMemo(() => {
    return analisis?.find(a => a.ejercicio === ejercicioSeleccionado && String(a.rpe) === String(rpeAuto));
  }, [analisis, ejercicioSeleccionado, rpeAuto]);

  if (!records || records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex gap-3 overflow-x-auto no-scrollbar items-center px-1 py-2">
        {listaEjercicios.map((ej) => {
          const info = analisis?.find(a => a.ejercicio === ej && String(a.rpe) === String(rpeAuto));
          const seleccionado = ejercicioSeleccionado === ej;
          let estiloEstado = "border-zinc-800 text-zinc-500";
          if (info?.valor_numerico > 0) estiloEstado = "border-emerald-500/30 text-emerald-500/80";
          if (info?.valor_numerico < 0) estiloEstado = "border-red-500/30 text-red-500/80";

          return (
            <button
              key={ej}
              onClick={() => setEjercicioSeleccionado(ej)}
              className={`px-4 py-3 rounded-2xl transition-all border shrink-0 whitespace-nowrap flex items-center justify-between gap-4 min-w-[140px] ${
                seleccionado ? 'bg-blue-600 border-blue-500 text-white scale-105 z-10' : `bg-zinc-900/50 ${estiloEstado}`
              }`}
            >
              <span className="text-[8px] font-black uppercase truncate max-w-[85px]">{ej}</span>
              {info && <span className="text-[8px] font-black tabular-nums">{info.porcentaje}</span>}
            </button>
          );
        })}
      </div>

      <div className="w-full h-72 bg-zinc-950/50 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
        <div className="flex justify-between items-start mb-8 px-2 gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.2em] truncate">
              Trend: <span className="text-blue-500">{ejercicioSeleccionado}</span> <span className="text-zinc-700 ml-1">(RPE {rpeAuto})</span>
            </h3>
            
            {datosFiltrados.length > 0 && (
              <span className="text-[7px] font-bold uppercase mt-1 flex items-center gap-1">
                <span className="text-blue-400 text-[10px]">📊</span>
                <span className="text-zinc-400">Métrica: Fuerza Estimada (Base 65kg)</span>
              </span>
            )}
          </div>

          {analisisSeleccionado && (
            <div className={`text-[7px] font-black px-2 py-1 rounded-full border shrink-0 ${
              analisisSeleccionado.valor_numerico >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}>
              {analisisSeleccionado.porcentaje}
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
              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', fontSize: '10px', padding: '12px' }}
              cursor={{ stroke: '#3f3f46', strokeWidth: 1 }}
              formatter={(value, name, props) => {
                const { peso, reps } = props.payload;
                return [
                  <div key="fuerza" className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 uppercase text-[8px]">Puntos Totales:</span>
                      <span className="text-white font-black">{value.toFixed(1)} Pts</span>
                    </div>
                    <div className="flex items-center gap-2 border-t border-white/5 pt-1 mt-1">
                      <span className="text-zinc-500 uppercase text-[8px]">Carga Real:</span>
                      <span className="text-blue-400 font-bold">{peso > 0 ? `+${peso}kg` : 'Autocarga'}</span>
                    </div>
                    <div className="text-zinc-600 text-[8px] italic">{reps} repeticiones al RPE {rpeAuto}</div>
                  </div>
                ];
              }}
            />
            
            <Line
              type="monotone"
              dataKey="puntosFuerza"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficoProgreso;